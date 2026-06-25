-- ============================================
-- Friend System Tables
-- ============================================

-- Drop existing tables if needed (for clean setup)
-- drop table if exists friends cascade;
-- drop table if exists friend_requests cascade;

-- Friend requests table
-- Stores incoming/outgoing friend requests between users
-- Status: pending | accepted | rejected
-- When accepted, rows are deleted and entries added to friends table
create table if not exists friend_requests (
  id uuid default gen_random_uuid() primary key,
  from_user_id uuid references auth.users(id) on delete cascade not null,
  to_user_id uuid references auth.users(id) on delete cascade not null,
  from_name text,
  from_emoji text default '👤',
  status text default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(from_user_id, to_user_id)
);

-- Friends table (bidirectional: each friendship stored twice for easy querying)
-- Or we can store once and use OR queries. Let's store once with a view.
-- Actually for performance and simplicity, store once with user_id < friend_id convention.
-- But for RLS simplicity, let's store bidirectionally.

create table if not exists friends (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  friend_id uuid references auth.users(id) on delete cascade not null,
  friend_name text,
  friend_emoji text default '👤',
  friend_level integer default 1,
  friend_xp integer default 0,
  friend_streak integer default 0,
  created_at timestamptz default now(),
  unique(user_id, friend_id)
);

-- Indexes for performance
create index if not exists idx_friend_requests_to on friend_requests(to_user_id, status);
create index if not exists idx_friend_requests_from on friend_requests(from_user_id, status);
create index if not exists idx_friends_user on friends(user_id);
create index if not exists idx_friends_friend on friends(friend_id);

-- Trigger to auto-update updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists update_friend_requests_updated_at on friend_requests;
create trigger update_friend_requests_updated_at
  before update on friend_requests
  for each row
  execute function update_updated_at_column();

-- ============================================
-- RLS Policies
-- ============================================

alter table friend_requests enable row level security;
alter table friends enable row level security;

-- Friend requests policies
-- Users can see requests sent TO them (incoming) and FROM them (outgoing)
create policy "Users can view their own friend requests"
  on friend_requests for select
  to authenticated
  using (from_user_id = auth.uid() or to_user_id = auth.uid());

-- Users can insert requests FROM themselves
create policy "Users can send friend requests"
  on friend_requests for insert
  to authenticated
  with check (from_user_id = auth.uid());

-- Users can update requests where they are the recipient (accept/reject)
-- OR sender (cancel their own request)
create policy "Users can update their own requests"
  on friend_requests for update
  to authenticated
  using (from_user_id = auth.uid() or to_user_id = auth.uid());

-- Users can delete requests they sent or received
create policy "Users can delete their own requests"
  on friend_requests for delete
  to authenticated
  using (from_user_id = auth.uid() or to_user_id = auth.uid());

-- Friends policies
-- Users can see their own friend entries (where they are user_id)
create policy "Users can view their own friends"
  on friends for select
  to authenticated
  using (user_id = auth.uid());

-- Users can insert their own friend entries
create policy "Users can add friends"
  on friends for insert
  to authenticated
  with check (user_id = auth.uid());

-- Users can delete their own friends
create policy "Users can remove friends"
  on friends for delete
  to authenticated
  using (user_id = auth.uid());

-- ============================================
-- Function: accept_friend_request
-- ============================================
-- This function handles accepting a request atomically:
-- 1. Updates request status to 'accepted'
-- 2. Creates bidirectional friendship entries
-- 3. Deletes the request (optional - keep for history)

create or replace function accept_friend_request(request_id uuid)
returns void
language plpgsql
security definer
as $$
declare
  req record;
begin
  select * into req from friend_requests where id = request_id and status = 'pending';
  
  if not found then
    raise exception 'Request not found or not pending';
  end if;
  
  if req.to_user_id != auth.uid() then
    raise exception 'Not authorized to accept this request';
  end if;

  -- Mark as accepted
  update friend_requests set status = 'accepted' where id = request_id;

  -- Insert bidirectional friendship (only if not already exists)
  insert into friends (user_id, friend_id, friend_name, friend_emoji)
  values (req.from_user_id, req.to_user_id, 
    (select raw_user_meta_data->>'name' from auth.users where id = req.to_user_id),
    '👤')
  on conflict (user_id, friend_id) do nothing;

  insert into friends (user_id, friend_id, friend_name, friend_emoji)
  values (req.to_user_id, req.from_user_id, req.from_name, req.from_emoji)
  on conflict (user_id, friend_id) do nothing;

end;
$$;

-- ============================================
-- Function: reject_friend_request
-- ============================================

create or replace function reject_friend_request(request_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  delete from friend_requests 
  where id = request_id and to_user_id = auth.uid() and status = 'pending';
end;
$$;

-- Grant execute permissions
grant execute on function accept_friend_request(uuid) to authenticated;
grant execute on function reject_friend_request(uuid) to authenticated;

-- ============================================
-- Grant table permissions
-- ============================================
grant select, insert, update, delete on friend_requests to authenticated;
grant select, insert, delete on friends to authenticated;
grant usage on sequence friend_requests_id_seq to authenticated;
grant usage on sequence friends_id_seq to authenticated;

-- Note: If using gen_random_uuid() instead of serial, sequence grants may not be needed.
-- But keeping them for safety.

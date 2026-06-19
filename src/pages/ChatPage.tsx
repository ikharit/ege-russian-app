import { AIChat } from '../components/AIChat';
import { useChatStore } from '../stores/chatStore';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export function ChatPage() {
  const navigate = useNavigate();
  const isOpen = useChatStore((s) => s.messages.length > 0 || true);

  useEffect(() => {
    // On desktop direct access, chat is always open
    // On mobile, this page acts as the chat screen
  }, []);

  return (
    <div className="h-full">
      <AIChat isOpen={true} onClose={() => navigate('/')} />
    </div>
  );
}

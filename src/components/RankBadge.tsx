import { getRankByLevel, Rank } from '../data/ranks'

interface RankBadgeProps {
  level: number
  size?: 'sm' | 'md' | 'lg'
  showName?: boolean
}

export function RankBadge({ level, size = 'md', showName = false }: RankBadgeProps) {
  const rank = getRankByLevel(level)
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-3 py-1 gap-1.5',
    lg: 'text-base px-4 py-2 gap-2',
  }
  
  const emojiSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
  }

  return (
    <div 
      className={`inline-flex items-center rounded-full font-bold text-white ${sizeClasses[size]}`}
      style={{ backgroundColor: rank.color }}
    >
      <span className={emojiSizes[size]}>{rank.emoji}</span>
      {showName && <span>{rank.name}</span>}
      <div className="flex gap-0.5">
        {Array.from({ length: rank.stripeCount }).map((_, i) => (
          <div key={i} className="w-1.5 h-3 bg-white/80 rounded-sm" />
        ))}
      </div>
    </div>
  )
}

export function RankStripes({ rank, size = 'md' }: { rank: Rank; size?: 'sm' | 'md' | 'lg' }) {
  const stripeHeight = size === 'sm' ? 'h-2' : size === 'md' ? 'h-3' : 'h-4'
  const stripeWidth = size === 'sm' ? 'w-1' : size === 'md' ? 'w-1.5' : 'w-2'
  
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: rank.stripeCount }).map((_, i) => (
        <div 
          key={i} 
          className={`${stripeWidth} ${stripeHeight} bg-current rounded-sm`} 
        />
      ))}
    </div>
  )
}

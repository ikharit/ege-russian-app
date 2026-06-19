import { ChatContext } from '../utils/aiChat';
import { getSubskillName } from '../utils/errorPatternAnalyzer';

interface ChatQuickActionsProps {
  context: ChatContext;
  onSend: (text: string) => void;
}

export function ChatQuickActions({ context, onSend }: ChatQuickActionsProps) {
  const { weakTopics, dueReviews, streak } = context;

  const actions = [
    {
      label: '📤 Показать прогресс',
      value: 'Покажи мой текущий прогресс',
    },
    {
      label: '🎯 Показать слабые места',
      value: 'Покажи мои слабые места и ошибки',
    },
    {
      label: '📝 Дать задание',
      value: weakTopics.length > 0
        ? `Дай мне задание на тему «${getSubskillName(weakTopics[0].errorType)}» (задание ${weakTopics[0].taskNumber})`
        : 'Дай мне задание для практики',
    },
    {
      label: '🔥 Мотивация',
      value: streak < 3
        ? 'Мотивируй меня! Я боюсь потерять стрик.'
        : 'Мотивируй меня продолжать учиться!',
    },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 px-4 scrollbar-hide">
      {actions.map((action, idx) => (
        <button
          key={idx}
          onClick={() => onSend(action.value)}
          className="shrink-0 px-3 py-2 rounded-full bg-duo-purple/10 text-duo-purple text-xs font-bold border border-duo-purple/20 hover:bg-duo-purple/20 transition-colors whitespace-nowrap"
        >
          {action.label}
        </button>
      ))}
      {dueReviews.length > 0 && (
        <button
          onClick={() => onSend('У меня есть просроченные повторения. Что мне делать?')}
          className="shrink-0 px-3 py-2 rounded-full bg-orange-100 text-orange-600 text-xs font-bold border border-orange-200 hover:bg-orange-200 transition-colors whitespace-nowrap"
        >
          🔁 Повторить ({dueReviews.length})
        </button>
      )}
    </div>
  );
}

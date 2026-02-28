import type { Subscription } from '../../types';

const PERIOD_LABELS: Record<string, string> = {
  weekly: 'еженедельно',
  monthly: 'ежемесячно',
  yearly: 'ежегодно',
};

const CATEGORY_EMOJI: Record<string, string> = {
  стриминг: '🎬',
  музыка: '🎵',
  ПО: '💻',
  облако: '☁️',
  игры: '🎮',
  прочее: '📦',
};

interface Props {
  sub: Subscription;
  isLast: boolean;
  onEdit: (sub: Subscription) => void;
  onDelete: (id: number) => void;
}

export default function SubscriptionItem({ sub, isLast, onEdit, onDelete }: Props) {
  const nextDate = sub.next_payment
    ? new Date(sub.next_payment).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
    : null;

  const emoji = CATEGORY_EMOJI[sub.category] ?? '📦';

  return (
    <>
      <div className="tg-list-item">
        <div className="list-item-icon">{emoji}</div>
        <div className="list-item-content" onClick={() => onEdit(sub)}>
          <div className="list-item-title">{sub.name}</div>
          <div className="list-item-sub">
            {PERIOD_LABELS[sub.period] ?? sub.period}
            {nextDate ? ` · ${nextDate}` : ''}
          </div>
        </div>
        <div className="list-item-amount">{sub.amount.toLocaleString('ru-RU')} ₽</div>
        <div className="list-item-actions">
          <button className="icon-btn" onClick={() => onDelete(sub.id)} title="Удалить">🗑️</button>
        </div>
      </div>
      {!isLast && <div className="list-divider" />}
    </>
  );
}

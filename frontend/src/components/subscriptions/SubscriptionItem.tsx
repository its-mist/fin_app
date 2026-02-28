import type { Subscription } from '../../types';

const PERIOD_LABELS: Record<string, string> = {
  weekly:  'еженедельно',
  monthly: 'ежемесячно',
  yearly:  'ежегодно',
};

const CATEGORY_COLORS: Record<string, string> = {
  стриминг: '#6366F1',
  музыка:   '#EC4899',
  ПО:       '#8B5CF6',
  облако:   '#3B82F6',
  игры:     '#10B981',
  прочее:   '#9CA3AF',
};

interface Props {
  sub: Subscription;
  isLast: boolean;
  onEdit: (sub: Subscription) => void;
  onDelete: (id: number) => void;
}

function DeleteIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

export default function SubscriptionItem({ sub, isLast, onEdit, onDelete }: Props) {
  const nextDate = sub.next_payment
    ? new Date(sub.next_payment).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
    : null;

  const color = CATEGORY_COLORS[sub.category] ?? '#9CA3AF';
  const initial = sub.name[0]?.toUpperCase() ?? '?';

  return (
    <>
      <div className="tg-list-item">
        <div className="list-item-avatar" style={{ background: color }}>
          {initial}
        </div>
        <div className="list-item-content" onClick={() => onEdit(sub)}>
          <div className="list-item-title">{sub.name}</div>
          <div className="list-item-sub">
            {PERIOD_LABELS[sub.period] ?? sub.period}
            {nextDate ? ` · ${nextDate}` : ''}
          </div>
        </div>
        <div className="list-item-amount">{sub.amount.toLocaleString('ru-RU')} ₽</div>
        <div className="list-item-actions">
          <button className="icon-btn" onClick={() => onDelete(sub.id)} title="Удалить">
            <DeleteIcon />
          </button>
        </div>
      </div>
      {!isLast && <div className="list-divider" />}
    </>
  );
}

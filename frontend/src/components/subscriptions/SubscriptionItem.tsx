import type { Subscription } from '../../types';

const PERIOD_LABELS: Record<string, string> = {
  weekly: 'еженедельно',
  monthly: 'ежемесячно',
  yearly: 'ежегодно',
};

interface Props {
  sub: Subscription;
  onEdit: (sub: Subscription) => void;
  onDelete: (id: number) => void;
}

export default function SubscriptionItem({ sub, onEdit, onDelete }: Props) {
  const nextDate = sub.next_payment
    ? new Date(sub.next_payment).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
    : null;

  return (
    <div className="card">
      <div className="card-content">
        <div className="card-title">{sub.name}</div>
        <div className="card-sub">
          {PERIOD_LABELS[sub.period] ?? sub.period}
          {sub.category ? ` · ${sub.category}` : ''}
          {nextDate ? ` · до ${nextDate}` : ''}
        </div>
      </div>
      <div className="card-amount">{sub.amount.toLocaleString('ru-RU')} ₽</div>
      <div className="card-actions">
        <button className="icon-btn" onClick={() => onEdit(sub)} title="Редактировать">✏️</button>
        <button className="icon-btn" onClick={() => onDelete(sub.id)} title="Удалить">🗑️</button>
      </div>
    </div>
  );
}

import type { Debt } from '../../types';

interface Props {
  debt: Debt;
  isLast: boolean;
  onEdit: (debt: Debt) => void;
  onDelete: (id: number) => void;
}

function isOverdue(dueDate: string | null): boolean {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date(new Date().toDateString());
}

function DeleteIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

export default function DebtItem({ debt, isLast, onEdit, onDelete }: Props) {
  const overdue  = isOverdue(debt.due_date);
  const dueLabel = debt.due_date
    ? new Date(debt.due_date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
    : null;

  const isIOwe  = debt.direction === 'i_owe';
  const color   = isIOwe ? '#EF4444' : '#22C55E';
  const sign    = isIOwe ? '−' : '+';
  const initial = debt.person[0]?.toUpperCase() ?? '?';

  return (
    <>
      <div className="tg-list-item">
        <div className="list-item-avatar" style={{ background: color }}>
          {initial}
        </div>
        <div className="list-item-content" onClick={() => onEdit(debt)}>
          <div className="list-item-title">
            {debt.person}
            {overdue && <span className="badge-overdue">просрочка</span>}
          </div>
          <div className="list-item-sub">
            {dueLabel ? `до ${dueLabel}` : 'без срока'}
            {debt.description ? ` · ${debt.description}` : ''}
          </div>
        </div>
        <div className="list-item-amount" style={{ color }}>
          {sign}{debt.amount.toLocaleString('ru-RU')} ₽
        </div>
        <div className="list-item-actions">
          <button className="icon-btn" onClick={() => onDelete(debt.id)} title="Удалить">
            <DeleteIcon />
          </button>
        </div>
      </div>
      {!isLast && <div className="list-divider" />}
    </>
  );
}

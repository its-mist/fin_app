import type { Debt } from '../../types';

interface Props {
  debt: Debt;
  onEdit: (debt: Debt) => void;
  onDelete: (id: number) => void;
}

function isOverdue(dueDate: string | null): boolean {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date(new Date().toDateString());
}

export default function DebtItem({ debt, onEdit, onDelete }: Props) {
  const overdue = isOverdue(debt.due_date);
  const dueLabel = debt.due_date
    ? new Date(debt.due_date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })
    : null;

  return (
    <div className="card">
      <div className="card-content">
        <div className="card-title">
          {debt.person}
          {overdue && <span className="badge-overdue">просрочка</span>}
        </div>
        <div className="card-sub">
          {dueLabel ? `до ${dueLabel}` : 'без срока'}
          {debt.description ? ` · ${debt.description}` : ''}
        </div>
      </div>
      <div
        className="card-amount"
        style={{ color: debt.direction === 'i_owe' ? '#ff3b30' : '#34c759' }}
      >
        {debt.direction === 'i_owe' ? '−' : '+'}
        {debt.amount.toLocaleString('ru-RU')} ₽
      </div>
      <div className="card-actions">
        <button className="icon-btn" onClick={() => onEdit(debt)} title="Редактировать">✏️</button>
        <button className="icon-btn" onClick={() => onDelete(debt.id)} title="Удалить">🗑️</button>
      </div>
    </div>
  );
}

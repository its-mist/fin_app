import { useState } from 'react';
import type { Debt, Direction } from '../../types';

interface Props {
  initial?: Debt;
  onSubmit: (data: Omit<Debt, 'id' | 'created_at'>) => Promise<void>;
  onClose: () => void;
}

const DIRECTIONS: { value: Direction; label: string }[] = [
  { value: 'they_owe', label: 'Мне должны' },
  { value: 'i_owe', label: 'Я должен' },
];

export default function DebtForm({ initial, onSubmit, onClose }: Props) {
  const [person, setPerson] = useState(initial?.person ?? '');
  const [amount, setAmount] = useState(initial?.amount.toString() ?? '');
  const [direction, setDirection] = useState<Direction>(initial?.direction ?? 'they_owe');
  const [dueDate, setDueDate] = useState(initial?.due_date ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [loading, setLoading] = useState(false);

  const valid = person.trim() && Number(amount) > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    setLoading(true);
    try {
      await onSubmit({
        person: person.trim(),
        amount: Number(amount),
        direction,
        due_date: dueDate || null,
        description: description.trim() || null,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sheet">
        <div className="sheet-handle" />
        <div className="sheet-title">{initial ? 'Редактировать' : 'Новый долг'}</div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Направление</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {DIRECTIONS.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => setDirection(d.value)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: 12,
                    fontSize: 14,
                    fontWeight: 600,
                    background: direction === d.value
                      ? (d.value === 'i_owe' ? 'rgba(255,59,48,0.15)' : 'rgba(52,199,89,0.15)')
                      : 'var(--tg-theme-secondary-bg-color)',
                    color: direction === d.value
                      ? (d.value === 'i_owe' ? '#ff3b30' : '#34c759')
                      : 'var(--tg-theme-hint-color)',
                    border: direction === d.value
                      ? `1.5px solid ${d.value === 'i_owe' ? '#ff3b30' : '#34c759'}`
                      : '1.5px solid transparent',
                    transition: 'all 0.15s',
                  }}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label>Имя человека</label>
            <input
              className="form-control"
              placeholder="Иван"
              value={person}
              onChange={(e) => setPerson(e.target.value)}
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>Сумма, ₽</label>
            <input
              className="form-control"
              type="number"
              placeholder="1000"
              min="0"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Срок (необязательно)</label>
            <input
              className="form-control"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Примечание (необязательно)</label>
            <input
              className="form-control"
              placeholder="За ужин, за поездку…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <button className="btn-primary" type="submit" disabled={!valid || loading}>
            {loading ? 'Сохраняем…' : initial ? 'Сохранить' : 'Добавить'}
          </button>
        </form>
      </div>
    </div>
  );
}

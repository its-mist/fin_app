import { useState } from 'react';
import type { Subscription, Period } from '../../types';

interface Props {
  initial?: Subscription;
  onSubmit: (data: Omit<Subscription, 'id' | 'created_at'>) => Promise<void>;
  onClose: () => void;
}

const PERIODS: { value: Period; label: string }[] = [
  { value: 'weekly', label: 'Еженедельно' },
  { value: 'monthly', label: 'Ежемесячно' },
  { value: 'yearly', label: 'Ежегодно' },
];

const CATEGORIES = ['стриминг', 'ПО', 'музыка', 'облако', 'игры', 'прочее'];

export default function SubscriptionForm({ initial, onSubmit, onClose }: Props) {
  const [name, setName] = useState(initial?.name ?? '');
  const [amount, setAmount] = useState(initial?.amount.toString() ?? '');
  const [period, setPeriod] = useState<Period>(initial?.period ?? 'monthly');
  const [category, setCategory] = useState(initial?.category ?? 'прочее');
  const [nextPayment, setNextPayment] = useState(initial?.next_payment ?? '');
  const [loading, setLoading] = useState(false);

  const valid = name.trim() && Number(amount) > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    setLoading(true);
    try {
      await onSubmit({
        name: name.trim(),
        amount: Number(amount),
        period,
        category,
        next_payment: nextPayment || null,
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
        <div className="sheet-title">{initial ? 'Редактировать' : 'Новая подписка'}</div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Название</label>
            <input
              className="form-control"
              placeholder="Netflix, Яндекс.Плюс…"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>Сумма, ₽</label>
            <input
              className="form-control"
              type="number"
              placeholder="299"
              min="0"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Период</label>
            <select
              className="form-control"
              value={period}
              onChange={(e) => setPeriod(e.target.value as Period)}
            >
              {PERIODS.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Категория</label>
            <select
              className="form-control"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Следующий платёж</label>
            <input
              className="form-control"
              type="date"
              value={nextPayment}
              onChange={(e) => setNextPayment(e.target.value)}
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

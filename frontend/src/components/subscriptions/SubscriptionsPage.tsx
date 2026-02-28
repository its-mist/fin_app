import { useEffect, useState } from 'react';
import type { Subscription } from '../../types';
import { getSubscriptions, createSubscription, updateSubscription, deleteSubscription } from '../../api';
import SubscriptionItem from './SubscriptionItem';
import SubscriptionForm from './SubscriptionForm';

function toMonthly(amount: number, period: string): number {
  if (period === 'weekly') return (amount * 52) / 12;
  if (period === 'yearly') return amount / 12;
  return amount;
}

export default function SubscriptionsPage() {
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Subscription | undefined>();

  const load = async () => {
    try {
      setSubs(await getSubscriptions());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (data: Omit<Subscription, 'id' | 'created_at'>) => {
    const created = await createSubscription(data);
    setSubs((prev) => [created, ...prev]);
  };

  const handleUpdate = async (data: Omit<Subscription, 'id' | 'created_at'>) => {
    if (!editing) return;
    const updated = await updateSubscription(editing.id, data);
    setSubs((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    setEditing(undefined);
  };

  const handleDelete = async (id: number) => {
    await deleteSubscription(id);
    setSubs((prev) => prev.filter((s) => s.id !== id));
  };

  const monthlyTotal = subs.reduce((acc, s) => acc + toMonthly(s.amount, s.period), 0);

  if (loading) return <div className="loading">Загружаем…</div>;

  return (
    <div className="page">
      {subs.length > 0 && (
        <div className="total-bar">
          <span className="total-bar-label">В месяц</span>
          <span className="total-bar-amount">
            {Math.round(monthlyTotal).toLocaleString('ru-RU')} ₽
          </span>
        </div>
      )}

      {subs.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">📋</div>
          <div className="empty-text">Нет подписок. Нажмите + чтобы добавить.</div>
        </div>
      ) : (
        <>
          <div className="section-header">Все подписки</div>
          {subs.map((s) => (
            <SubscriptionItem
              key={s.id}
              sub={s}
              onEdit={(sub) => { setEditing(sub); setShowForm(true); }}
              onDelete={handleDelete}
            />
          ))}
        </>
      )}

      <button className="fab" onClick={() => { setEditing(undefined); setShowForm(true); }}>
        +
      </button>

      {showForm && (
        <SubscriptionForm
          initial={editing}
          onSubmit={editing ? handleUpdate : handleCreate}
          onClose={() => { setShowForm(false); setEditing(undefined); }}
        />
      )}
    </div>
  );
}

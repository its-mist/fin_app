import { useEffect, useState, useCallback } from 'react';
import type { Subscription } from '../../types';
import { getSubscriptions, createSubscription, updateSubscription, deleteSubscription } from '../../api';
import SubscriptionItem from './SubscriptionItem';
import SubscriptionForm from './SubscriptionForm';
import { useTelegram } from '../../hooks/useTelegram';

function toMonthly(amount: number, period: string): number {
  if (period === 'weekly') return (amount * 52) / 12;
  if (period === 'yearly') return amount / 12;
  return amount;
}

function EmptyIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="3" />
      <path d="M2 10h20" />
      <path d="M6 15h4" />
    </svg>
  );
}

interface Props {
  onFormToggle: (open: boolean) => void;
}

export default function SubscriptionsPage({ onFormToggle }: Props) {
  const [subs,    setSubs]    = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Subscription | undefined>();
  const { MainButton, inTelegram } = useTelegram();

  const load = async () => {
    try { setSubs(await getSubscriptions()); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openForm = useCallback((sub?: Subscription) => {
    setEditing(sub); setShowForm(true); onFormToggle(true);
  }, [onFormToggle]);

  const closeForm = useCallback(() => {
    setShowForm(false); setEditing(undefined); onFormToggle(false);
  }, [onFormToggle]);

  useEffect(() => {
    if (!MainButton || showForm) return;
    MainButton.setText('Добавить подписку');
    MainButton.show();
    const cb = () => openForm(undefined);
    MainButton.onClick(cb);
    return () => { MainButton.offClick(cb); MainButton.hide(); };
  }, [MainButton, showForm, openForm]);

  const handleCreate = async (data: Omit<Subscription, 'id' | 'created_at'>) => {
    const created = await createSubscription(data);
    setSubs((prev) => [created, ...prev]);
  };

  const handleUpdate = async (data: Omit<Subscription, 'id' | 'created_at'>) => {
    if (!editing) return;
    const updated = await updateSubscription(editing.id, data);
    setSubs((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
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
        <div className="summary-bar">
          <span className="summary-bar-label">В месяц</span>
          <span className="summary-bar-amount">{Math.round(monthlyTotal).toLocaleString('ru-RU')} ₽</span>
        </div>
      )}

      {subs.length === 0 ? (
        <div className="empty">
          <div className="empty-icon"><EmptyIcon /></div>
          <div className="empty-text">Нет подписок</div>
          <div className="empty-hint">Нажмите + чтобы добавить</div>
        </div>
      ) : (
        <>
          <div className="section-title">Все подписки</div>
          <div className="tg-list">
            {subs.map((s, i) => (
              <SubscriptionItem
                key={s.id}
                sub={s}
                isLast={i === subs.length - 1}
                onEdit={(sub) => openForm(sub)}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </>
      )}

      {!inTelegram && (
        <button className="fab" onClick={() => openForm(undefined)}>+</button>
      )}

      {showForm && (
        <SubscriptionForm
          initial={editing}
          onSubmit={editing ? handleUpdate : handleCreate}
          onClose={closeForm}
        />
      )}
    </div>
  );
}

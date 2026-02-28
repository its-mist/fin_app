import { useEffect, useState, useCallback } from 'react';
import type { Debt } from '../../types';
import { getDebts, createDebt, updateDebt, deleteDebt } from '../../api';
import DebtItem from './DebtItem';
import DebtForm from './DebtForm';
import { useTelegram } from '../../hooks/useTelegram';

function EmptyIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17l-4-4 4-4" />
      <path d="M17 7l4 4-4 4" />
      <path d="M3 13h18" />
    </svg>
  );
}

interface Props {
  onFormToggle: (open: boolean) => void;
}

export default function DebtsPage({ onFormToggle }: Props) {
  const [debts,   setDebts]   = useState<Debt[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Debt | undefined>();
  const { MainButton, inTelegram } = useTelegram();

  const load = async () => {
    try { setDebts(await getDebts()); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openForm = useCallback((debt?: Debt) => {
    setEditing(debt); setShowForm(true); onFormToggle(true);
  }, [onFormToggle]);

  const closeForm = useCallback(() => {
    setShowForm(false); setEditing(undefined); onFormToggle(false);
  }, [onFormToggle]);

  useEffect(() => {
    if (!MainButton || showForm) return;
    MainButton.setText('Добавить долг');
    MainButton.show();
    const cb = () => openForm(undefined);
    MainButton.onClick(cb);
    return () => { MainButton.offClick(cb); MainButton.hide(); };
  }, [MainButton, showForm, openForm]);

  const handleCreate = async (data: Omit<Debt, 'id' | 'created_at'>) => {
    const created = await createDebt(data);
    setDebts((prev) => [created, ...prev]);
  };

  const handleUpdate = async (data: Omit<Debt, 'id' | 'created_at'>) => {
    if (!editing) return;
    const updated = await updateDebt(editing.id, data);
    setDebts((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
  };

  const handleDelete = async (id: number) => {
    await deleteDebt(id);
    setDebts((prev) => prev.filter((d) => d.id !== id));
  };

  const theyOwe = debts.filter((d) => d.direction === 'they_owe');
  const iOwe    = debts.filter((d) => d.direction === 'i_owe');
  const theyOweTotal = theyOwe.reduce((a, d) => a + d.amount, 0);
  const iOweTotal    = iOwe.reduce((a, d) => a + d.amount, 0);

  if (loading) return <div className="loading">Загружаем…</div>;

  return (
    <div className="page">
      {debts.length > 0 && (
        <div className="summary-row">
          <div className="summary-card summary-card-green">
            <div className="summary-card-label">Мне должны</div>
            <div className="summary-card-amount">{theyOweTotal.toLocaleString('ru-RU')} ₽</div>
          </div>
          <div className="summary-card summary-card-red">
            <div className="summary-card-label">Я должен</div>
            <div className="summary-card-amount">{iOweTotal.toLocaleString('ru-RU')} ₽</div>
          </div>
        </div>
      )}

      {debts.length === 0 ? (
        <div className="empty">
          <div className="empty-icon"><EmptyIcon /></div>
          <div className="empty-text">Нет долгов</div>
          <div className="empty-hint">Нажмите + чтобы добавить</div>
        </div>
      ) : (
        <>
          {theyOwe.length > 0 && (
            <>
              <div className="section-title">Мне должны</div>
              <div className="tg-list">
                {theyOwe.map((d, i) => (
                  <DebtItem key={d.id} debt={d} isLast={i === theyOwe.length - 1} onEdit={(debt) => openForm(debt)} onDelete={handleDelete} />
                ))}
              </div>
            </>
          )}
          {iOwe.length > 0 && (
            <>
              <div className="section-title">Я должен</div>
              <div className="tg-list">
                {iOwe.map((d, i) => (
                  <DebtItem key={d.id} debt={d} isLast={i === iOwe.length - 1} onEdit={(debt) => openForm(debt)} onDelete={handleDelete} />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {!inTelegram && (
        <button className="fab" onClick={() => openForm(undefined)}>+</button>
      )}

      {showForm && (
        <DebtForm
          initial={editing}
          onSubmit={editing ? handleUpdate : handleCreate}
          onClose={closeForm}
        />
      )}
    </div>
  );
}

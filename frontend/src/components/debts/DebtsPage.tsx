import { useEffect, useState } from 'react';
import type { Debt } from '../../types';
import { getDebts, createDebt, updateDebt, deleteDebt } from '../../api';
import DebtItem from './DebtItem';
import DebtForm from './DebtForm';

export default function DebtsPage() {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Debt | undefined>();

  const load = async () => {
    try {
      setDebts(await getDebts());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (data: Omit<Debt, 'id' | 'created_at'>) => {
    const created = await createDebt(data);
    setDebts((prev) => [created, ...prev]);
  };

  const handleUpdate = async (data: Omit<Debt, 'id' | 'created_at'>) => {
    if (!editing) return;
    const updated = await updateDebt(editing.id, data);
    setDebts((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
    setEditing(undefined);
  };

  const handleDelete = async (id: number) => {
    await deleteDebt(id);
    setDebts((prev) => prev.filter((d) => d.id !== id));
  };

  const theyOwe = debts.filter((d) => d.direction === 'they_owe');
  const iOwe = debts.filter((d) => d.direction === 'i_owe');

  const theyOweTotal = theyOwe.reduce((a, d) => a + d.amount, 0);
  const iOweTotal = iOwe.reduce((a, d) => a + d.amount, 0);

  if (loading) return <div className="loading">Загружаем…</div>;

  return (
    <div className="page">
      {debts.length > 0 && (
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <div style={{
            flex: 1, background: 'rgba(52,199,89,0.12)', borderRadius: 14, padding: '12px 16px',
          }}>
            <div style={{ fontSize: 12, color: '#34c759', fontWeight: 600, marginBottom: 4 }}>МНЕ ДОЛЖНЫ</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#34c759' }}>
              {theyOweTotal.toLocaleString('ru-RU')} ₽
            </div>
          </div>
          <div style={{
            flex: 1, background: 'rgba(255,59,48,0.10)', borderRadius: 14, padding: '12px 16px',
          }}>
            <div style={{ fontSize: 12, color: '#ff3b30', fontWeight: 600, marginBottom: 4 }}>Я ДОЛЖЕН</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#ff3b30' }}>
              {iOweTotal.toLocaleString('ru-RU')} ₽
            </div>
          </div>
        </div>
      )}

      {debts.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">🤝</div>
          <div className="empty-text">Нет долгов. Нажмите + чтобы добавить.</div>
        </div>
      ) : (
        <>
          {theyOwe.length > 0 && (
            <>
              <div className="section-header">Мне должны</div>
              {theyOwe.map((d) => (
                <DebtItem
                  key={d.id}
                  debt={d}
                  onEdit={(debt) => { setEditing(debt); setShowForm(true); }}
                  onDelete={handleDelete}
                />
              ))}
            </>
          )}
          {iOwe.length > 0 && (
            <>
              <div className="section-header">Я должен</div>
              {iOwe.map((d) => (
                <DebtItem
                  key={d.id}
                  debt={d}
                  onEdit={(debt) => { setEditing(debt); setShowForm(true); }}
                  onDelete={handleDelete}
                />
              ))}
            </>
          )}
        </>
      )}

      <button className="fab" onClick={() => { setEditing(undefined); setShowForm(true); }}>
        +
      </button>

      {showForm && (
        <DebtForm
          initial={editing}
          onSubmit={editing ? handleUpdate : handleCreate}
          onClose={() => { setShowForm(false); setEditing(undefined); }}
        />
      )}
    </div>
  );
}

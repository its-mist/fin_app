import { useState, useEffect, useRef } from 'react';
import type { Debt, Direction } from '../../types';
import { useTelegram } from '../../hooks/useTelegram';

interface Props {
  initial?: Debt;
  onSubmit: (data: Omit<Debt, 'id' | 'created_at'>) => Promise<void>;
  onClose: () => void;
}

const DIRECTIONS: { value: Direction; label: string }[] = [
  { value: 'they_owe', label: 'Мне должны' },
  { value: 'i_owe',    label: 'Я должен' },
];

function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

export default function DebtForm({ initial, onSubmit, onClose }: Props) {
  const [person,      setPerson]      = useState(initial?.person ?? '');
  const [amount,      setAmount]      = useState(initial?.amount.toString() ?? '');
  const [direction,   setDirection]   = useState<Direction>(initial?.direction ?? 'they_owe');
  const [dueDate,     setDueDate]     = useState(initial?.due_date ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [loading,     setLoading]     = useState(false);
  const { MainButton, BackButton, haptic, inTelegram } = useTelegram();

  const valid = person.trim() !== '' && Number(amount) > 0;
  const handlerRef = useRef<() => void>(() => {});

  const doSubmit = async () => {
    if (!valid || loading) return;
    setLoading(true);
    try {
      await onSubmit({ person: person.trim(), amount: Number(amount), direction, due_date: dueDate || null, description: description.trim() || null });
      haptic?.notificationOccurred('success');
      onClose();
    } catch {
      haptic?.notificationOccurred('error');
      setLoading(false);
    }
  };

  useEffect(() => { handlerRef.current = doSubmit; });

  useEffect(() => {
    if (!MainButton || !BackButton) return;
    const cb = () => handlerRef.current();
    MainButton.setText(initial ? 'Сохранить' : 'Добавить долг');
    MainButton.show();
    MainButton.onClick(cb);
    BackButton.show();
    BackButton.onClick(onClose);
    return () => {
      MainButton.offClick(cb); MainButton.hide();
      BackButton.offClick(onClose); BackButton.hide();
    };
  }, [MainButton, BackButton, onClose]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!MainButton) return;
    valid ? MainButton.enable() : MainButton.disable();
  }, [valid, MainButton]);

  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); await doSubmit(); };

  return (
    <div className="screen-form">
      <div className="screen-form-header">
        <button className="back-btn" onClick={onClose}><BackIcon /></button>
        <span className="screen-form-title">{initial ? 'Редактировать' : 'Новый долг'}</span>
      </div>
      <div className="screen-form-body">
        <form onSubmit={handleSubmit}>
          <div className="segment-control">
            {DIRECTIONS.map((d) => (
              <button
                key={d.value}
                type="button"
                className={`segment-btn${direction === d.value ? ' active' : ''} ${d.value === 'i_owe' ? 'red' : 'green'}`}
                onClick={() => setDirection(d.value)}
              >
                {d.label}
              </button>
            ))}
          </div>

          <div className="form-section">
            <div className="form-row">
              <label className="form-label">Имя человека</label>
              <input className="form-input" placeholder="Иван" value={person} onChange={(e) => setPerson(e.target.value)} autoFocus />
            </div>
            <div className="form-divider" />
            <div className="form-row">
              <label className="form-label">Сумма, ₽</label>
              <input className="form-input" type="number" placeholder="1000" min="0" step="any" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
          </div>

          <div className="form-section">
            <div className="form-row">
              <label className="form-label">Срок (необязательно)</label>
              <input className="form-input" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
            <div className="form-divider" />
            <div className="form-row">
              <label className="form-label">Примечание (необязательно)</label>
              <input className="form-input" placeholder="За ужин, за поездку…" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
          </div>

          {!inTelegram && (
            <button className="btn-submit" type="submit" disabled={!valid || loading}>
              {loading ? 'Сохраняем…' : initial ? 'Сохранить' : 'Добавить'}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

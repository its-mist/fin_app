import { useState, useEffect, useRef } from 'react';
import type { Subscription, Period } from '../../types';
import { useTelegram } from '../../hooks/useTelegram';

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

const CATEGORY_EMOJI: Record<string, string> = {
  стриминг: '🎬',
  музыка: '🎵',
  ПО: '💻',
  облако: '☁️',
  игры: '🎮',
  прочее: '📦',
};

export default function SubscriptionForm({ initial, onSubmit, onClose }: Props) {
  const [name, setName] = useState(initial?.name ?? '');
  const [amount, setAmount] = useState(initial?.amount.toString() ?? '');
  const [period, setPeriod] = useState<Period>(initial?.period ?? 'monthly');
  const [category, setCategory] = useState(initial?.category ?? 'прочее');
  const [nextPayment, setNextPayment] = useState(initial?.next_payment ?? '');
  const [loading, setLoading] = useState(false);
  const { MainButton, BackButton, haptic, inTelegram } = useTelegram();

  const valid = name.trim() !== '' && Number(amount) > 0;
  const handlerRef = useRef<() => void>(() => {});

  const doSubmit = async () => {
    if (!valid || loading) return;
    setLoading(true);
    try {
      await onSubmit({
        name: name.trim(),
        amount: Number(amount),
        period,
        category,
        next_payment: nextPayment || null,
      });
      haptic?.notificationOccurred('success');
      onClose();
    } catch {
      haptic?.notificationOccurred('error');
      setLoading(false);
    }
  };

  // Keep handlerRef always pointing to the latest doSubmit
  useEffect(() => { handlerRef.current = doSubmit; });

  // Register MainButton & BackButton once on mount
  useEffect(() => {
    if (!MainButton || !BackButton) return;
    const cb = () => handlerRef.current();
    MainButton.setText(initial ? 'Сохранить' : 'Добавить подписку');
    MainButton.show();
    MainButton.onClick(cb);
    BackButton.show();
    BackButton.onClick(onClose);
    return () => {
      MainButton.offClick(cb);
      MainButton.hide();
      BackButton.offClick(onClose);
      BackButton.hide();
    };
  }, [MainButton, BackButton, onClose]); // eslint-disable-line react-hooks/exhaustive-deps

  // Enable/disable based on validity
  useEffect(() => {
    if (!MainButton) return;
    if (valid) MainButton.enable();
    else MainButton.disable();
  }, [valid, MainButton]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await doSubmit();
  };

  return (
    <div className="screen-form">
      <div className="screen-form-header">
        <button className="back-btn" onClick={onClose}>‹</button>
        <span className="screen-form-title">{initial ? 'Редактировать' : 'Новая подписка'}</span>
      </div>
      <div className="screen-form-body">
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <div className="form-row">
              <label className="form-label">Название</label>
              <input
                className="form-input"
                placeholder="Netflix, Яндекс.Плюс…"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>
            <div className="form-divider" />
            <div className="form-row">
              <label className="form-label">Сумма, ₽</label>
              <input
                className="form-input"
                type="number"
                placeholder="299"
                min="0"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="form-section">
            <div className="form-row">
              <label className="form-label">Период</label>
              <select
                className="form-input"
                value={period}
                onChange={(e) => setPeriod(e.target.value as Period)}
              >
                {PERIODS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
            <div className="form-divider" />
            <div className="form-row">
              <label className="form-label">Категория</label>
              <select
                className="form-input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{CATEGORY_EMOJI[c]} {c}</option>
                ))}
              </select>
            </div>
            <div className="form-divider" />
            <div className="form-row">
              <label className="form-label">Следующий платёж</label>
              <input
                className="form-input"
                type="date"
                value={nextPayment}
                onChange={(e) => setNextPayment(e.target.value)}
              />
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

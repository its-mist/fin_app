import type { Subscription, Debt } from './types';

const BASE = '/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || res.statusText);
  }
  return res.json();
}

// Subscriptions
export const getSubscriptions = () => request<Subscription[]>('/subscriptions');
export const createSubscription = (data: Omit<Subscription, 'id' | 'created_at'>) =>
  request<Subscription>('/subscriptions', { method: 'POST', body: JSON.stringify(data) });
export const updateSubscription = (id: number, data: Partial<Omit<Subscription, 'id' | 'created_at'>>) =>
  request<Subscription>(`/subscriptions/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteSubscription = (id: number) =>
  request<{ ok: boolean }>(`/subscriptions/${id}`, { method: 'DELETE' });

// Debts
export const getDebts = () => request<Debt[]>('/debts');
export const createDebt = (data: Omit<Debt, 'id' | 'created_at'>) =>
  request<Debt>('/debts', { method: 'POST', body: JSON.stringify(data) });
export const updateDebt = (id: number, data: Partial<Omit<Debt, 'id' | 'created_at'>>) =>
  request<Debt>(`/debts/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteDebt = (id: number) =>
  request<{ ok: boolean }>(`/debts/${id}`, { method: 'DELETE' });

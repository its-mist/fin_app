export type Period = 'weekly' | 'monthly' | 'yearly';
export type Direction = 'i_owe' | 'they_owe';

export interface Subscription {
  id: number;
  name: string;
  amount: number;
  period: Period;
  category: string;
  next_payment: string | null;
  created_at: string;
}

export interface Debt {
  id: number;
  person: string;
  amount: number;
  direction: Direction;
  due_date: string | null;
  description: string | null;
  created_at: string;
}

export type Tab = 'subscriptions' | 'debts';

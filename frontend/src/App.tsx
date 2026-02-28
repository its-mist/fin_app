import { useState } from 'react';
import type { Tab } from './types';
import Navigation from './components/Navigation';
import SubscriptionsPage from './components/subscriptions/SubscriptionsPage';
import DebtsPage from './components/debts/DebtsPage';

export default function App() {
  const [tab, setTab] = useState<Tab>('subscriptions');

  return (
    <>
      {tab === 'subscriptions' && <SubscriptionsPage />}
      {tab === 'debts' && <DebtsPage />}
      <Navigation active={tab} onChange={setTab} />
    </>
  );
}

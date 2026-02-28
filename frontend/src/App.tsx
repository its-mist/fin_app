import { useState, useCallback } from 'react';
import type { Tab } from './types';
import Navigation from './components/Navigation';
import SubscriptionsPage from './components/subscriptions/SubscriptionsPage';
import DebtsPage from './components/debts/DebtsPage';

export default function App() {
  const [tab, setTab] = useState<Tab>('subscriptions');
  const [formOpen, setFormOpen] = useState(false);

  const handleFormToggle = useCallback((open: boolean) => setFormOpen(open), []);

  return (
    <>
      {tab === 'subscriptions' && <SubscriptionsPage onFormToggle={handleFormToggle} />}
      {tab === 'debts' && <DebtsPage onFormToggle={handleFormToggle} />}
      {!formOpen && <Navigation active={tab} onChange={setTab} />}
    </>
  );
}

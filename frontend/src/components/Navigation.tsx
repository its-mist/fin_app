import type { Tab } from '../types';

interface Props {
  active: Tab;
  onChange: (tab: Tab) => void;
}

function IconSubscriptions() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="3" />
      <path d="M2 10h20" />
      <path d="M6 15h4" />
    </svg>
  );
}

function IconDebts() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17l-4-4 4-4" />
      <path d="M17 7l4 4-4 4" />
      <path d="M3 13h18" />
    </svg>
  );
}

const tabs: { id: Tab; label: string; icon: () => JSX.Element }[] = [
  { id: 'subscriptions', label: 'Подписки', icon: IconSubscriptions },
  { id: 'debts',         label: 'Долги',    icon: IconDebts },
];

export default function Navigation({ active, onChange }: Props) {
  return (
    <nav className="nav">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          className={`nav-item${active === id ? ' active' : ''}`}
          onClick={() => onChange(id)}
        >
          <span className="nav-icon"><Icon /></span>
          <span className="nav-label">{label}</span>
        </button>
      ))}
    </nav>
  );
}

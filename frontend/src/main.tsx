import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const tg = (window as any).Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
  tg.setHeaderColor?.('bg_color');
  tg.setBackgroundColor?.('bg_color');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

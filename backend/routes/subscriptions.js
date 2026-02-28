const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM subscriptions ORDER BY created_at DESC').all();
  res.json(rows);
});

router.post('/', (req, res) => {
  const { name, amount, period, category, next_payment } = req.body;
  if (!name || amount == null || !period) {
    return res.status(400).json({ error: 'name, amount and period are required' });
  }
  const stmt = db.prepare(
    'INSERT INTO subscriptions (name, amount, period, category, next_payment) VALUES (?, ?, ?, ?, ?)'
  );
  const info = stmt.run([name, amount, period, category || 'прочее', next_payment || null]);
  const row = db.prepare('SELECT * FROM subscriptions WHERE id = ?').get([info.lastInsertRowid]);
  res.status(201).json(row);
});

router.put('/:id', (req, res) => {
  const { name, amount, period, category, next_payment } = req.body;
  const existing = db.prepare('SELECT * FROM subscriptions WHERE id = ?').get([req.params.id]);
  if (!existing) return res.status(404).json({ error: 'Not found' });

  db.prepare(
    'UPDATE subscriptions SET name=?, amount=?, period=?, category=?, next_payment=? WHERE id=?'
  ).run([
    name ?? existing.name,
    amount ?? existing.amount,
    period ?? existing.period,
    category ?? existing.category,
    next_payment !== undefined ? next_payment : existing.next_payment,
    req.params.id,
  ]);
  const row = db.prepare('SELECT * FROM subscriptions WHERE id = ?').get([req.params.id]);
  res.json(row);
});

router.delete('/:id', (req, res) => {
  const info = db.prepare('DELETE FROM subscriptions WHERE id = ?').run([req.params.id]);
  if (info.changes === 0) return res.status(404).json({ error: 'Not found' });
  res.json({ ok: true });
});

module.exports = router;

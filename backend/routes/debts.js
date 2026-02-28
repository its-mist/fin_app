const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM debts ORDER BY created_at DESC').all();
  res.json(rows);
});

router.post('/', (req, res) => {
  const { person, amount, direction, due_date, description } = req.body;
  if (!person || amount == null || !direction) {
    return res.status(400).json({ error: 'person, amount and direction are required' });
  }
  if (!['i_owe', 'they_owe'].includes(direction)) {
    return res.status(400).json({ error: "direction must be 'i_owe' or 'they_owe'" });
  }
  const stmt = db.prepare(
    'INSERT INTO debts (person, amount, direction, due_date, description) VALUES (?, ?, ?, ?, ?)'
  );
  const info = stmt.run([person, amount, direction, due_date || null, description || null]);
  const row = db.prepare('SELECT * FROM debts WHERE id = ?').get([info.lastInsertRowid]);
  res.status(201).json(row);
});

router.put('/:id', (req, res) => {
  const { person, amount, direction, due_date, description } = req.body;
  const existing = db.prepare('SELECT * FROM debts WHERE id = ?').get([req.params.id]);
  if (!existing) return res.status(404).json({ error: 'Not found' });

  db.prepare(
    'UPDATE debts SET person=?, amount=?, direction=?, due_date=?, description=? WHERE id=?'
  ).run([
    person ?? existing.person,
    amount ?? existing.amount,
    direction ?? existing.direction,
    due_date !== undefined ? due_date : existing.due_date,
    description !== undefined ? description : existing.description,
    req.params.id,
  ]);
  const row = db.prepare('SELECT * FROM debts WHERE id = ?').get([req.params.id]);
  res.json(row);
});

router.delete('/:id', (req, res) => {
  const info = db.prepare('DELETE FROM debts WHERE id = ?').run([req.params.id]);
  if (info.changes === 0) return res.status(404).json({ error: 'Not found' });
  res.json({ ok: true });
});

module.exports = router;

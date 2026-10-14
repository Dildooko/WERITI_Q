import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth, requireAdmin } from '../auth.js';
import { ah, parseId, validateProduct } from '../util.js';

const router = Router();

// GET /api/products — список товаров (открыт всем).
router.get('/', ah(async (req, res) => {
  const { rows } = await query('SELECT id, name, descr, price FROM products ORDER BY id');
  res.json({ products: rows });
}));

// GET /api/products/:id — один товар.
router.get('/:id', ah(async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ error: 'Некорректный номер товара.' });
  const { rows } = await query('SELECT id, name, descr, price FROM products WHERE id = $1', [id]);
  if (!rows[0]) return res.status(404).json({ error: 'Товар не найден.' });
  res.json({ product: rows[0] });
}));

// POST /api/products — добавить товар (только администратор).
router.post('/', requireAuth, requireAdmin, ah(async (req, res) => {
  const { value, error } = validateProduct(req.body);
  if (error) return res.status(400).json({ error });
  const { rows } = await query(
    'INSERT INTO products (name, descr, price) VALUES ($1, $2, $3) RETURNING id, name, descr, price',
    [value.name, value.descr, value.price]);
  res.status(201).json({ product: rows[0] });
}));

// PUT /api/products/:id — изменить товар (только администратор).
router.put('/:id', requireAuth, requireAdmin, ah(async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ error: 'Некорректный номер товара.' });
  const { value, error } = validateProduct(req.body);
  if (error) return res.status(400).json({ error });
  const { rows } = await query(
    'UPDATE products SET name = $1, descr = $2, price = $3 WHERE id = $4 RETURNING id, name, descr, price',
    [value.name, value.descr, value.price, id]);
  if (!rows[0]) return res.status(404).json({ error: 'Товар не найден.' });
  res.json({ product: rows[0] });
}));

// DELETE /api/products/:id — удалить товар (только администратор).
router.delete('/:id', requireAuth, requireAdmin, ah(async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ error: 'Некорректный номер товара.' });
  const { rowCount } = await query('DELETE FROM products WHERE id = $1', [id]);
  if (!rowCount) return res.status(404).json({ error: 'Товар не найден.' });
  res.json({ ok: true });
}));

export default router;

import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth } from '../auth.js';
import { ah, parseId, parseQty } from '../util.js';

const router = Router();
router.use(requireAuth); // вся корзина — только для вошедших пользователей

/** Текущая корзина пользователя вместе с названиями и ценами. */
async function getCart(userId) {
  const { rows } = await query(
    `SELECT c.product_id AS "productId", c.qty, p.name, p.price
       FROM cart_items c JOIN products p ON p.id = c.product_id
      WHERE c.user_id = $1
      ORDER BY p.id`, [userId]);
  return rows;
}

// GET /api/cart — прочитать корзину.
router.get('/', ah(async (req, res) => {
  res.json({ cart: await getCart(req.userId) });
}));

// POST /api/cart — добавить товар. Тело: { productId, qty? }. Если товар уже есть, количество увеличивается.
router.post('/', ah(async (req, res) => {
  const productId = parseId(req.body?.productId);
  const qty = req.body?.qty === undefined ? 1 : parseQty(req.body.qty);
  if (!productId || !qty) return res.status(400).json({ error: 'Некорректные данные товара.' });
  try {
    await query(
      `INSERT INTO cart_items (user_id, product_id, qty) VALUES ($1, $2, $3)
       ON CONFLICT (user_id, product_id)
       DO UPDATE SET qty = LEAST(cart_items.qty + EXCLUDED.qty, 99)`,
      [req.userId, productId, qty]);
  } catch (err) {
    if (err.code === '23503') return res.status(404).json({ error: 'Такого товара нет.' });
    throw err;
  }
  res.status(201).json({ cart: await getCart(req.userId) });
}));

// PATCH /api/cart/:productId — задать количество (1–99). Тело: { qty }.
router.patch('/:productId', ah(async (req, res) => {
  const productId = parseId(req.params.productId);
  const qty = parseQty(req.body?.qty);
  if (!productId || !qty) return res.status(400).json({ error: 'Количество должно быть от 1 до 99.' });
  const { rowCount } = await query(
    'UPDATE cart_items SET qty = $1 WHERE user_id = $2 AND product_id = $3',
    [qty, req.userId, productId]);
  if (!rowCount) return res.status(404).json({ error: 'Этого товара нет в корзине.' });
  res.json({ cart: await getCart(req.userId) });
}));

// DELETE /api/cart/:productId — убрать товар из корзины.
router.delete('/:productId', ah(async (req, res) => {
  const productId = parseId(req.params.productId);
  if (!productId) return res.status(400).json({ error: 'Некорректный номер товара.' });
  await query('DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2', [req.userId, productId]);
  res.json({ cart: await getCart(req.userId) });
}));

// DELETE /api/cart — очистить корзину.
router.delete('/', ah(async (req, res) => {
  await query('DELETE FROM cart_items WHERE user_id = $1', [req.userId]);
  res.json({ cart: [] });
}));

export default router;

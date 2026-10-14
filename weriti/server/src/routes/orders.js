import { Router } from 'express';
import { pool, query } from '../db.js';
import { requireAuth } from '../auth.js';
import { ah } from '../util.js';

const router = Router();
router.use(requireAuth);

// GET /api/orders — история заказов пользователя (сначала новые).
router.get('/', ah(async (req, res) => {
  const { rows } = await query(
    `SELECT o.id, o.total, o.created_at AS "createdAt",
            COALESCE(
              json_agg(json_build_object('name', i.name, 'price', i.price, 'qty', i.qty) ORDER BY i.id)
                FILTER (WHERE i.id IS NOT NULL),
              '[]') AS items
       FROM orders o LEFT JOIN order_items i ON i.order_id = o.id
      WHERE o.user_id = $1
      GROUP BY o.id
      ORDER BY o.id DESC`, [req.userId]);
  res.json({ orders: rows });
}));

// POST /api/orders — оформить заказ из корзины. Всё выполняется в одной транзакции:
// либо заказ создан и корзина очищена, либо ничего не изменилось.
router.post('/', ah(async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows: items } = await client.query(
      `SELECT c.product_id, c.qty, p.name, p.price
         FROM cart_items c JOIN products p ON p.id = c.product_id
        WHERE c.user_id = $1`, [req.userId]);
    if (!items.length) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Корзина пуста.' });
    }
    const total = Math.round(items.reduce((sum, i) => sum + i.price * i.qty, 0) * 100) / 100;
    const { rows: [order] } = await client.query(
      'INSERT INTO orders (user_id, total) VALUES ($1, $2) RETURNING id, total, created_at AS "createdAt"',
      [req.userId, total]);
    for (const i of items) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, name, price, qty) VALUES ($1, $2, $3, $4, $5)',
        [order.id, i.product_id, i.name, i.price, i.qty]);
    }
    await client.query('DELETE FROM cart_items WHERE user_id = $1', [req.userId]);
    await client.query('COMMIT');
    res.status(201).json({ order });
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    throw err;
  } finally {
    client.release();
  }
}));

export default router;

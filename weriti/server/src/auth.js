import jwt from 'jsonwebtoken';
import { query } from './db.js';

/** Выдаёт токен на 7 дней. В нём только id пользователя. */
export const signToken = user =>
  jwt.sign({ sub: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

/** Требует заголовок Authorization: Bearer <токен>. Кладёт id пользователя в req.userId. */
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) return res.status(401).json({ error: 'Нужно войти в аккаунт.' });
  try {
    req.userId = Number(jwt.verify(token, process.env.JWT_SECRET).sub);
    next();
  } catch {
    res.status(401).json({ error: 'Сессия истекла. Войдите снова.' });
  }
}

/** Пропускает только администраторов. Роль берётся из базы, а не из токена. */
export async function requireAdmin(req, res, next) {
  try {
    const { rows } = await query('SELECT role FROM users WHERE id = $1', [req.userId]);
    if (rows[0]?.role !== 'admin') return res.status(403).json({ error: 'Только для администратора.' });
    next();
  } catch (err) {
    next(err);
  }
}

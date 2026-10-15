import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../db.js';
import { signToken, requireAuth } from '../auth.js';
import { ah, normalizeUsername, validateCredentials, publicUser } from '../util.js';

const router = Router();


router.post('/register', ah(async (req, res) => {
  const username = normalizeUsername(req.body?.username);
  const password = String(req.body?.password ?? '');
  const problem = validateCredentials(username, password);
  if (problem) return res.status(400).json({ error: problem });

  if (req.body?.consent !== true) return res.status(400).json({ error: 'Нужно согласие на обработку персональных данных.' });

  const hash = await bcrypt.hash(password, 10);
  try {
    await query('INSERT INTO users (username, password_hash, consent_at) VALUES ($1, $2, NOW())', [username, hash]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Такой логин уже занят.' });
    throw err;
  }
  res.status(201).json({ message: 'Аккаунт создан.' });
}));

router.post('/login', ah(async (req, res) => {
  const username = normalizeUsername(req.body?.username);
  const password = String(req.body?.password ?? '');
  const { rows } = await query('SELECT * FROM users WHERE username = $1', [username]);
  const user = rows[0];
  const ok = user && (await bcrypt.compare(password, user.password_hash));
  if (!ok) return res.status(401).json({ error: 'Неверный логин или пароль.' });
  res.json({ token: signToken(user), user: publicUser(user) });
}));

router.get('/me', requireAuth, ah(async (req, res) => {
  const { rows } = await query('SELECT * FROM users WHERE id = $1', [req.userId]);
  if (!rows[0]) return res.status(401).json({ error: 'Аккаунт не найден. Войдите снова.' });
  res.json({ user: publicUser(rows[0]) });
}));

export default router;
import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth } from '../auth.js';
import { ah, publicUser } from '../util.js';

const router = Router();

// PATCH /api/profile — изменить фото профиля и/или настройку звука.
// Тело: { avatar?: "data:image/jpeg;base64,..." | null, soundEnabled?: boolean }
router.patch('/', requireAuth, ah(async (req, res) => {
  const { avatar, soundEnabled } = req.body ?? {};
  const sets = [];
  const values = [];

  if (avatar !== undefined) {
    const valid = avatar === null ||
      (typeof avatar === 'string' && avatar.startsWith('data:image/jpeg;base64,') && avatar.length < 200000);
    if (!valid) return res.status(400).json({ error: 'Некорректное фото.' });
    values.push(avatar);
    sets.push(`avatar = $${values.length}`);
  }
  if (soundEnabled !== undefined) {
    if (typeof soundEnabled !== 'boolean') return res.status(400).json({ error: 'Некорректная настройка звука.' });
    values.push(soundEnabled);
    sets.push(`sound_enabled = $${values.length}`);
  }
  if (!sets.length) return res.status(400).json({ error: 'Нечего обновлять.' });

  values.push(req.userId);
  const { rows } = await query(
    `UPDATE users SET ${sets.join(', ')} WHERE id = $${values.length} RETURNING *`, values);
  if (!rows[0]) return res.status(401).json({ error: 'Аккаунт не найден. Войдите снова.' });
  res.json({ user: publicUser(rows[0]) });
}));

export default router;

// Общие помощники: проверка входных данных и обёртка для async-обработчиков.

/** Ошибки из async-обработчиков попадают в общий обработчик ошибок Express. */
export const ah = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

/** Положительное целое (id из адреса) или null. */
export function parseId(value) {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 && n < 2147483647 ? n : null;
}

/** Количество в корзине: целое от 1 до 99 или null. */
export function parseQty(value) {
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 && n <= 99 ? n : null;
}

/** Логин без регистра и лишних пробелов; одинаковые символы с разных клавиатур приводятся к одному виду. */
export const normalizeUsername = v => String(v ?? '').normalize('NFKC').trim().toLowerCase();

/** Возвращает текст ошибки или null, если данные подходят. */
export function validateCredentials(username, password) {
  if (username.length < 3 || username.length > 32) return 'Логин должен быть от 3 до 32 символов.';
  if (password.length < 6) return 'Пароль должен быть не короче 6 символов.';
  // bcrypt учитывает только первые 72 байта пароля
  if (Buffer.byteLength(password, 'utf8') > 72) return 'Пароль слишком длинный (не более 72 байт, для кириллицы — 36 символов).';
  return null;
}

/** Проверка тела запроса для товара. Возвращает { value } или { error }. */
export function validateProduct(body) {
  const name = String(body?.name ?? '').trim();
  const descr = String(body?.descr ?? '').trim();
  const price = Number(body?.price);
  if (!name || name.length > 100) return { error: 'Название: от 1 до 100 символов.' };
  if (!descr || descr.length > 500) return { error: 'Описание: от 1 до 500 символов.' };
  if (!Number.isFinite(price) || price < 0 || price > 9999) return { error: 'Цена: число от 0 до 9999.' };
  return { value: { name, descr, price: Math.round(price * 100) / 100 } };
}

/** Какие поля пользователя можно отдавать клиенту (хеш пароля — никогда). */
export const publicUser = u => ({
  id: u.id,
  username: u.username,
  avatar: u.avatar,
  soundEnabled: u.sound_enabled,
  role: u.role,
});

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

// NUMERIC (цены, суммы) драйвер по умолчанию отдаёт строкой — превращаем в число.
pg.types.setTypeParser(1700, v => parseFloat(v));

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error('Не задан DATABASE_URL. Скопируйте server/.env.example в server/.env и впишите строку подключения.');
}

// Для локальной базы SSL не нужен, для облачной (Neon, Render и т.п.) — нужен.
const isLocal = /localhost|127\.0\.0\.1/.test(url);
export const pool = new pg.Pool({
  connectionString: url,
  ssl: isLocal ? false : { rejectUnauthorized: false },
});

export const query = (text, params) => pool.query(text, params);

/** Создаёт таблицы и, если каталог пуст, наполняет его начальными товарами. */
export async function initDb() {
  const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'sql');
  await pool.query(fs.readFileSync(path.join(dir, 'schema.sql'), 'utf8'));
  const { rows } = await pool.query('SELECT COUNT(*)::int AS n FROM products');
  if (rows[0].n === 0) {
    await pool.query(fs.readFileSync(path.join(dir, 'seed.sql'), 'utf8'));
  }
}

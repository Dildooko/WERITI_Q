import 'dotenv/config'; // должен быть первым: читает server/.env до остальных модулей
import express from 'express';
import cors from 'cors';
import { initDb, query } from './db.js';
import authRouter from './routes/auth.js';
import profileRouter from './routes/profile.js';
import productsRouter from './routes/products.js';
import cartRouter from './routes/cart.js';
import ordersRouter from './routes/orders.js';

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 16) {
  console.error('Задайте JWT_SECRET (не короче 16 символов) в server/.env');
  process.exit(1);
}

const app = express();
const origins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',').map(s => s.trim()).filter(Boolean);

app.use(cors({ origin: origins }));
app.use(express.json({ limit: '300kb' })); // фото профиля 160×160 весит десятки килобайт

app.get('/', (req, res) => res.json({ name: 'WERITI API', docs: 'см. README.md' }));
app.get('/api/health', async (req, res, next) => {
  try { await query('SELECT 1'); res.json({ ok: true }); } catch (err) { next(err); }
});

app.use('/api/auth', authRouter);
app.use('/api/profile', profileRouter);
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', ordersRouter);

app.use('/api', (req, res) => res.status(404).json({ error: 'Такого адреса нет.' }));

// Общий обработчик ошибок: клиенту — понятное сообщение, в журнал — подробности.
app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') return res.status(413).json({ error: 'Слишком большой запрос.' });
  if (err.status && err.status < 500) return res.status(err.status).json({ error: 'Некорректный запрос.' });
  console.error(err);
  res.status(500).json({ error: 'Ошибка сервера. Попробуйте позже.' });
});

const port = Number(process.env.PORT) || 3001;
await initDb();
app.listen(port, () => console.log(`WERITI API запущен: http://localhost:${port}`));

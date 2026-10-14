# WERITI — интернет-магазин зелёного винограда

Учебный проект (УП.08) в архитектуре «клиент — сервер»:

| Часть | Технологии |
|---|---|
| **Frontend** (`client/`) | React 18, Vite, компоненты и хуки |
| **Backend** (`server/`) | Node.js, Express, REST API |
| **База данных** | PostgreSQL, 5 связанных таблиц (`server/sql/schema.sql`) |
| **Аутентификация** | пароли хешируются `bcrypt`, вход через JWT-токен |
| **Деплой** | Neon (БД), Render (сервер и сайт) |

## Соответствие требованиям

| Требование | Где выполнено |
|---|---|
| Фронтенд на фреймворке | `client/` — React + Vite, компоненты в `client/src/components/` |
| Серверная часть | `server/src/` — Express |
| Серверная БД, минимум 3 связанные таблицы | PostgreSQL: `users`, `products`, `cart_items`, `orders`, `order_items` (внешние ключи, `ON DELETE`, `CHECK`) |
| Данные не в коде и не в localStorage | всё в PostgreSQL; в браузере хранится только JWT-токен |
| REST API с CRUD | см. таблицу «API» ниже |
| Хеширование паролей на сервере + JWT | `server/src/routes/auth.js`, `server/src/auth.js` |
| Публичная ссылка | раздел «Деплой» |

## Структура

```
weriti/
├── client/                  # фронтенд
│   └── src/
│       ├── App.jsx          # состояние приложения, работа с API
│       ├── api.js           # все запросы к серверу
│       ├── sound.js         # звуки и музыка (Web Audio API)
│       ├── effects.js       # звук нажатия и волна на кнопках
│       ├── components/      # AuthScreen, Header, Shop, ProductCard, Cart, ...
│       └── hooks/useToast.js
└── server/                  # бэкенд
    ├── sql/schema.sql       # структура БД
    ├── sql/seed.sql         # начальный каталог (6 сортов)
    └── src/
        ├── index.js         # запуск сервера, CORS, обработка ошибок
        ├── db.js            # подключение к PostgreSQL
        ├── auth.js          # проверка JWT, роль администратора
        ├── util.js          # проверка входных данных
        └── routes/          # auth, profile, products, cart, orders
```

## Запуск на своём компьютере

Нужны: Node.js 20+ и бесплатная база PostgreSQL. Самое простое — [Neon](https://neon.com): зарегистрируйтесь, создайте проект и скопируйте строку подключения (кнопка **Connect**). Установка PostgreSQL на компьютер не нужна.

### 1. Сервер

```bash
cd server
npm install
cp .env.example .env        # в Windows (cmd): copy .env.example .env
```

Откройте `server/.env` и заполните:

- `DATABASE_URL` — строка подключения из Neon;
- `JWT_SECRET` — любая длинная случайная строка (не короче 16 символов);
- `CLIENT_ORIGIN` — оставьте `http://localhost:5173`.

```bash
npm run dev
```

В консоли появится `WERITI API запущен: http://localhost:3001`. При первом запуске сервер сам создаёт таблицы и заполняет каталог.

### 2. Клиент (в новом окне терминала)

```bash
cd client
npm install
cp .env.example .env        # в Windows (cmd): copy .env.example .env
npm run dev
```

Откройте `http://localhost:5173`.

## API

Все адреса начинаются с `/api`. Запросы с пометкой «токен» требуют заголовок `Authorization: Bearer <токен>`.

| Метод и адрес | Что делает | Доступ |
|---|---|---|
| `POST /auth/register` | регистрация `{ username, password }` | все |
| `POST /auth/login` | вход, возвращает `{ token, user }` | все |
| `GET /auth/me` | текущий пользователь | токен |
| `PATCH /profile` | фото профиля и/или звук `{ avatar?, soundEnabled? }` | токен |
| `GET /products` | список товаров | все |
| `GET /products/:id` | один товар | все |
| `POST /products` | добавить товар `{ name, descr, price }` | администратор |
| `PUT /products/:id` | изменить товар | администратор |
| `DELETE /products/:id` | удалить товар | администратор |
| `GET /cart` | корзина | токен |
| `POST /cart` | добавить товар `{ productId, qty? }` | токен |
| `PATCH /cart/:productId` | задать количество `{ qty }` (1–99) | токен |
| `DELETE /cart/:productId` | убрать товар | токен |
| `DELETE /cart` | очистить корзину | токен |
| `POST /orders` | оформить заказ из корзины (в транзакции) | токен |
| `GET /orders` | история заказов | токен |
| `GET /health` | проверка работы сервера и БД | все |

### Как стать администратором

Администратор может менять каталог. Роль выдаётся вручную в SQL Editor на Neon:

```sql
UPDATE users SET role = 'admin' WHERE username = 'ваш_логин';
```

Пример добавления товара (токен берётся из ответа `POST /auth/login`):

```bash
curl -X POST http://localhost:3001/api/products \
  -H "Authorization: Bearer ТОКЕН" -H "Content-Type: application/json" \
  -d '{"name":"Сенсация","descr":"Крупные тёмные ягоды.","price":8.5}'
```

## Деплой (бесплатно)

Порядок важен: сначала база, потом сервер, потом сайт.

### 1. База данных — Neon

Если вы уже создали проект в Neon для локального запуска, используйте ту же строку `DATABASE_URL`.

### 2. Сервер — Render (Web Service)

1. Загрузите проект на GitHub (в корне репозитория папки `client` и `server`).
2. На [render.com](https://render.com): **New → Web Service**, выберите репозиторий.
3. Настройки: **Root Directory** `server`, **Build Command** `npm install`, **Start Command** `npm start`, тип **Free**.
4. В разделе **Environment** добавьте переменные `DATABASE_URL`, `JWT_SECRET` и `CLIENT_ORIGIN` (адрес сайта из шага 3, без `/` в конце; на этом шаге можно временно указать `http://localhost:5173` и обновить позже).
5. После деплоя откройте `https://ВАШ-СЕРВЕР.onrender.com/api/health`: должно быть `{"ok":true}`.

> Бесплатный сервис на Render засыпает после 15 минут без запросов, поэтому первое открытие сайта может занять около минуты. Это нормально для учебного проекта.

### 3. Сайт — Render (Static Site)

1. **New → Static Site**, тот же репозиторий.
2. **Root Directory** `client`, **Build Command** `npm install && npm run build`, **Publish Directory** `dist`.
3. В **Environment** добавьте `VITE_API_URL` = адрес сервера из шага 2 (например, `https://weriti-api.onrender.com`, без `/` в конце).
4. После деплоя скопируйте адрес сайта и вставьте его в `CLIENT_ORIGIN` на сервере (шаг 2.4). Сервер перезапустится сам.

Сайт можно разместить и на Vercel или Netlify: корневая папка `client`, команда сборки `npm run build`, папка `dist`, переменная `VITE_API_URL`.

## Если что-то не работает

| Симптом | Причина и решение |
|---|---|
| `Не задан DATABASE_URL` при запуске сервера | нет файла `server/.env` или в нём пустая строка |
| `Задайте JWT_SECRET` | `JWT_SECRET` короче 16 символов |
| На сайте «Нет связи с сервером» | сервер не запущен, неверный `VITE_API_URL` или сервер на Render ещё просыпается |
| В консоли браузера ошибка CORS | адрес сайта не совпадает с `CLIENT_ORIGIN` (проверьте `https`, отсутствие `/` в конце) |
| После смены `VITE_API_URL` ничего не изменилось | переменные Vite вшиваются при сборке: пересоберите клиент (на хостинге — Manual Deploy) |

## Что изменилось по сравнению с прежней версией

- Весь код интерфейса перенесён с «чистого» HTML и `innerHTML` на React-компоненты.
- Локальная база в браузере (`sql.js` + шифрование в `localStorage`) заменена серверной PostgreSQL. Теперь аккаунты, корзина и фото доступны с любого устройства.
- Пароли хешируются на сервере (bcrypt) вместо шифрования базы в браузере; вход — через JWT.
- Сохранены прежние дизайн (`styles.css`), звуки и музыка (`sound.js`), волна на кнопках, адаптивная вёрстка.
- «Оформить заказ» теперь создаёт запись в таблицах `orders` и `order_items`.

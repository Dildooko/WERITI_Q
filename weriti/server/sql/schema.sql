CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(32) NOT NULL UNIQUE,
  password_hash TEXT        NOT NULL,
  avatar        TEXT,
  sound_enabled BOOLEAN     NOT NULL DEFAULT TRUE,
  role          VARCHAR(10) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id    SERIAL PRIMARY KEY,
  name  VARCHAR(100)  NOT NULL,
  descr TEXT          NOT NULL,
  price NUMERIC(8, 2) NOT NULL CHECK (price >= 0)
);

CREATE TABLE IF NOT EXISTS cart_items (
  user_id    INTEGER NOT NULL REFERENCES users(id)    ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  qty        INTEGER NOT NULL CHECK (qty BETWEEN 1 AND 99),
  PRIMARY KEY (user_id, product_id)
);

CREATE TABLE IF NOT EXISTS orders (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total      NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id         SERIAL PRIMARY KEY,
  order_id   INTEGER       NOT NULL REFERENCES orders(id)   ON DELETE CASCADE,
  product_id INTEGER                REFERENCES products(id) ON DELETE SET NULL,
  name       VARCHAR(100)  NOT NULL,
  price      NUMERIC(8, 2) NOT NULL,
  qty        INTEGER       NOT NULL CHECK (qty > 0)
);

ALTER TABLE users ADD COLUMN IF NOT EXISTS consent_at TIMESTAMPTZ;
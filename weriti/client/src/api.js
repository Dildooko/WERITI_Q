// Все обращения к серверу (REST API) собраны здесь.
// В браузере хранится только JWT-токен; корзина, фото и настройки живут в базе на сервере.
const env = import.meta.env || {};
const BASE = String(env.VITE_API_URL || 'http://localhost:3001').replace(/\/$/, '');
const TOKEN_KEY = 'weriti-token';

let token = null;
try { token = localStorage.getItem(TOKEN_KEY); } catch { /* хранилище недоступно */ }

export const getToken = () => token;

export function setToken(value) {
  token = value;
  try {
    if (value) localStorage.setItem(TOKEN_KEY, value);
    else localStorage.removeItem(TOKEN_KEY);
  } catch { /* хранилище недоступно */ }
}

async function request(method, path, body) {
  let res;
  try {
    res = await fetch(`${BASE}/api${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new Error('Нет связи с сервером. Проверьте интернет и попробуйте ещё раз.');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || 'Что-то пошло не так.');
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  register: (username, password) => request('POST', '/auth/register', { username, password }),
  login: (username, password) => request('POST', '/auth/login', { username, password }),
  me: () => request('GET', '/auth/me'),
  updateProfile: patch => request('PATCH', '/profile', patch),

  products: () => request('GET', '/products'),

  cart: () => request('GET', '/cart'),
  addToCart: productId => request('POST', '/cart', { productId }),
  setQty: (productId, qty) => request('PATCH', `/cart/${productId}`, { qty }),
  removeFromCart: productId => request('DELETE', `/cart/${productId}`),

  checkout: () => request('POST', '/orders'),
};

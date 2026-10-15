import { useCallback, useEffect, useRef, useState } from 'react';
import { api, getToken, setToken } from './api.js';
import { Sound } from './sound.js';
import { installEffects } from './effects.js';
import { makeAvatar } from './utils.js';
import { useToast } from './hooks/useToast.js';
import { GrapeSprite } from './components/Grapes.jsx';
import AuthScreen from './components/AuthScreen.jsx';
import Shop from './components/Shop.jsx';
import PublicLegal from './components/PublicLegal.jsx';
import CookieBanner from './components/CookieBanner.jsx';
import { useRoute } from './hooks/useRoute.js';
import './extra.css';

export default function App() {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(Boolean(getToken())); // есть токен — сначала проверяем его на сервере
  const [authMsg, setAuthMsg] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [soundOn, setSoundOn] = useState(true);
  const { toast, showToast } = useToast();
  const queue = useRef(Promise.resolve()); // операции с корзиной выполняются по очереди

  const route = useRoute();
  useEffect(() => installEffects(), []);

  /** Загружает каталог и корзину с сервера и открывает магазин. */
  async function enterShop(u) {
    const [p, c] = await Promise.all([api.products(), api.cart()]);
    setProducts(p.products);
    setCart(c.cart);
    Sound.setEnabled(Sound.enabled && u.soundEnabled);
    setSoundOn(Sound.enabled);
    setUser(u);
    Sound.music(true); // после входа — спокойная музыка на фоне
  }

  const logout = useCallback(msg => {
    setToken(null);
    Sound.music(false);
    Sound.setEnabled(true);
    setSoundOn(true);
    setUser(null);
    setProducts([]);
    setCart([]);
    setAuthMsg(msg || null);
  }, []);

  /** Единое место обработки ошибок API: просроченный токен — выход, остальное — сообщение. */
  const fail = useCallback(err => {
    if (err.status === 401) {
      logout({ text: 'Сессия истекла. Войдите снова.', kind: 'err' });
      return;
    }
    showToast(err.message);
    Sound.error();
  }, [logout, showToast]);

  // при открытии сайта: если в браузере есть токен, проверяем его и сразу входим
  useEffect(() => {
    if (!getToken()) return undefined;
    let cancelled = false;
    (async () => {
      try {
        const { user: u } = await api.me();
        await enterShop(u);
      } catch (err) {
        if (err.status === 401) setToken(null);
        else setAuthMsg({ text: err.message, kind: 'err' });
      }
      if (!cancelled) setBooting(false);
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const enqueue = task => { queue.current = queue.current.then(task).catch(fail); };

  const addToCart = id => enqueue(async () => {
    setCart((await api.addToCart(id)).cart);
  });

  const decFromCart = (id, qty) => enqueue(async () => {
    const res = qty <= 1 ? await api.removeFromCart(id) : await api.setQty(id, qty - 1);
    setCart(res.cart);
  });

  async function checkout() {
    try {
      await queue.current; // дожидаемся незавершённых изменений корзины
      await api.checkout();
      setCart([]);
      showToast('Заказ принят. Спасибо!');
      Sound.success();
      return true;
    } catch (err) {
      fail(err);
      return false;
    }
  }

  async function changeAvatar(file) {
    try {
      const avatar = await makeAvatar(file);
      const { user: u } = await api.updateProfile({ avatar });
      setUser(u);
      showToast('Фото обновлено');
      Sound.success();
    } catch (err) {
      fail(err);
    }
  }

  function toggleSound() {
    const next = !soundOn;
    Sound.setEnabled(next);
    setSoundOn(next);
    if (user) api.updateProfile({ soundEnabled: next }).catch(() => {}); // личная настройка хранится на сервере
  }

  let screen;
  if (booting) {
    screen = <div className="boot">Подключаемся к серверу… Первый запуск может занять до минуты.</div>;
  } else if (!user && route.startsWith('/legal/')) {
    screen = <PublicLegal slug={route.slice(7)} />;
  } else if (!user) {
    screen = <AuthScreen soundOn={soundOn} onToggleSound={toggleSound} onLogin={enterShop} initialMsg={authMsg} />;
  } else {
    screen = (
      <Shop
        user={user}
        products={products}
        cart={cart}
        soundOn={soundOn}
        onToggleSound={toggleSound}
        onLogout={() => logout()}
        onAdd={addToCart}
        onDec={decFromCart}
        onCheckout={checkout}
        onAvatar={changeAvatar}
        route={route}
      />
    );
  }

  return (
    <>
      <GrapeSprite />
      {screen}
      <CookieBanner />
      <div className={'toast' + (toast.show ? ' show' : '')} role="status">{toast.text}</div>
    </>
  );
}

import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { fmt } from '../utils.js';
import { Grapes } from './Grapes.jsx';
import Avatar from './Avatar.jsx';
import ProductCard from './ProductCard.jsx';

/** Бесконечная лента слева: сорта и цены крутятся сами, при наведении останавливаются. */
export function Ribbon({ products }) {
  const items = [
    ...products.map(p => `${p.name}, ${fmt(p.price)} / кг`),
    'Свежий урожай',
    'Выбирайте сорт по вкусу',
  ];
  const list = [...items, ...items]; // копия нужна, чтобы лента замыкалась без шва
  return (
    <aside className="ribbon" aria-label="Лента сортов">
      <div className="ribbon-track">
        {list.map((t, i) => (
          <div className="rib-item" key={i} aria-hidden={i >= items.length ? 'true' : undefined}>
            <Grapes /><span>{t}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}

export function Home({ user, products, qtyOf, onAdd, onDec }) {
  return (
    <>
      <div className="hero">
        <div>
          <h1>Здравствуйте, {user.username}</h1>
          <p>Выберите сорт и добавьте его в корзину.</p>
        </div>
      </div>
      <div className="home">
        <Ribbon products={products} />
        <div className="grid">
          {products.map(p => <ProductCard key={p.id} product={p} qty={qtyOf(p.id)} onAdd={onAdd} onDec={onDec} />)}
        </div>
      </div>
    </>
  );
}

export function CartPage({ items, onAdd, onDec, onCheckout, busy }) {
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  return (
    <section className="page">
      <h1>Корзина</h1>
      {items.length === 0 ? (
        <p className="empty">В корзине пока пусто. <a href="#/">Выберите виноград в каталоге</a>.</p>
      ) : (
        <>
          <ul className="cartlist">
            {items.map(i => (
              <li key={i.productId}>
                <div><b>{i.name}</b><br /><small>{fmt(i.price)} / кг</small></div>
                <div className="step">
                  <button type="button" aria-label="Меньше" onClick={() => onDec(i.productId, i.qty)}>−</button>
                  <b>{i.qty} кг</b>
                  <button type="button" aria-label="Больше" onClick={() => onAdd(i.productId)}>+</button>
                </div>
              </li>
            ))}
          </ul>
          <div className="sum"><span>Итого</span><b>{fmt(total)}</b></div>
          <p className="fine">Оформляя заказ, вы принимаете условия <a href="#/legal/offer">публичной оферты</a>.</p>
          <button className="btn" type="button" data-nosound="true" disabled={busy} onClick={onCheckout}>Оформить заказ</button>
        </>
      )}
    </section>
  );
}

export function ProfilePage({ user, soundOn, onToggleSound, onPickPhoto, onLogout }) {
  const [orders, setOrders] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    let off = false;
    api.orders().then(r => { if (!off) setOrders(r.orders); }).catch(e => { if (!off) setErr(e.message); });
    return () => { off = true; };
  }, []);

  return (
    <section className="page">
      <h1>Профиль</h1>
      <div className="profile">
        <Avatar user={user} big onClick={onPickPhoto} />
        <dl className="req">
          <div><dt>Логин</dt><dd>{user.username}</dd></div>
          <div><dt>Роль</dt><dd>{user.role === 'admin' ? 'Администратор' : 'Покупатель'}</dd></div>
          <div><dt>Звук</dt><dd>{soundOn ? 'Включён' : 'Выключен'}</dd></div>
        </dl>
      </div>
      <div className="actions">
        <button className="btn ghost" type="button" onClick={onPickPhoto}>Сменить фото</button>
        <button className="btn ghost" type="button" onClick={onToggleSound}>{soundOn ? 'Выключить звук' : 'Включить звук'}</button>
        <button className="btn ghost" type="button" onClick={onLogout}>Выйти</button>
      </div>
      <h2 className="sec">История заказов</h2>
      {err && <p className="msg err">{err}</p>}
      {!err && orders === null && <p className="empty">Загружаем…</p>}
      {orders && orders.length === 0 && <p className="empty">Заказов пока нет. <a href="#/">Перейти в каталог</a>.</p>}
      {orders && orders.length > 0 && (
        <ul className="orders">
          {orders.map(o => (
            <li key={o.id}>
              <div className="o-head"><b>Заказ № {o.id}</b><span>{new Date(o.createdAt).toLocaleString('ru-RU')}</span><b>{fmt(o.total)}</b></div>
              <ul>{o.items.map((it, k) => <li key={k}>{it.name}, {it.qty} кг × {fmt(it.price)}</li>)}</ul>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

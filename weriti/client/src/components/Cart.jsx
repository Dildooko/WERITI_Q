import { useEffect, useRef } from 'react';
import { fmt } from '../utils.js';

/** Боковая панель корзины. Закрывается кнопкой, щелчком по фону и клавишей Esc. */
export default function Cart({ open, items, onClose, onAdd, onDec, onCheckout, busy }) {
  const closeRef = useRef(null);
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  // при открытии переводим фокус на «Закрыть»
  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  // Esc закрывает корзину
  useEffect(() => {
    if (!open) return undefined;
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <>
      <div className={'scrim' + (open ? ' open' : '')} onClick={onClose} />
      <aside className={'cart' + (open ? ' open' : '')} aria-label="Корзина">
        <div className="cart-top">
          <h2>Корзина</h2>
          <button className="iconbtn" type="button" ref={closeRef} onClick={onClose}>Закрыть</button>
        </div>
        {items.length === 0 && <p className="empty">В корзине пока пусто. Добавьте виноград из каталога.</p>}
        <ul>
          {items.map(i => (
            <li key={i.productId}>
              <div>
                <b>{i.name}</b>
                <br />
                <small>{fmt(i.price)} / кг</small>
              </div>
              <div className="step">
                <button type="button" aria-label="Меньше" onClick={() => onDec(i.productId, i.qty)}>−</button>
                <b>{i.qty} кг</b>
                <button type="button" aria-label="Больше" onClick={() => onAdd(i.productId)}>+</button>
              </div>
            </li>
          ))}
        </ul>
        <div className="cart-foot">
          <div className="sum"><span>Итого</span><b>{fmt(total)}</b></div>
          <button
            className="btn full"
            type="button"
            data-nosound="true"
            disabled={items.length === 0 || busy}
            onClick={onCheckout}
          >
            Оформить заказ
          </button>
        </div>
      </aside>
    </>
  );
}

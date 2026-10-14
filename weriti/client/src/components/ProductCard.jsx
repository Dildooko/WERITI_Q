import { Grapes } from './Grapes.jsx';
import { fmt } from '../utils.js';

/** Карточка сорта: кнопка «В корзину» или счётчик количества, если сорт уже в корзине. */
export default function ProductCard({ product, qty, onAdd, onDec }) {
  return (
    <article className="prod">
      <div className="pic"><Grapes /></div>
      <div className="pbody">
        <h2>{product.name}</h2>
        <p>{product.descr}</p>
        <div className="row">
          <span className="price">{fmt(product.price)} / кг</span>
          {qty === 0 ? (
            <button className="btn add" type="button" onClick={() => onAdd(product.id)}>В корзину</button>
          ) : (
            <span className="step">
              <button type="button" aria-label="Меньше" onClick={() => onDec(product.id, qty)}>−</button>
              <b>{qty} кг</b>
              <button type="button" aria-label="Больше" onClick={() => onAdd(product.id)}>+</button>
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

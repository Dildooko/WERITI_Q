import { useCallback, useRef, useState } from 'react';
import Header from './Header.jsx';
import Avatar from './Avatar.jsx';
import ProductCard from './ProductCard.jsx';
import Cart from './Cart.jsx';

/** Главный экран после входа: шапка, приветствие, каталог и корзина. */
export default function Shop({ user, products, cart, soundOn, onToggleSound, onLogout, onAdd, onDec, onCheckout, onAvatar }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef(null);
  const cartBtnRef = useRef(null);

  const qtyOf = id => cart.find(i => i.productId === id)?.qty ?? 0;
  const count = cart.reduce((sum, i) => sum + i.qty, 0);

  const closeCart = useCallback(() => {
    setCartOpen(false);
    cartBtnRef.current?.focus();
  }, []);

  const pickPhoto = () => fileRef.current?.click();
  const onFile = e => {
    const file = e.target.files[0];
    e.target.value = '';
    if (file) onAvatar(file);
  };

  async function checkout() {
    setBusy(true);
    const ok = await onCheckout();
    setBusy(false);
    if (ok) closeCart();
  }

  return (
    <>
      <Header
        user={user}
        count={count}
        soundOn={soundOn}
        onToggleSound={onToggleSound}
        onOpenCart={() => setCartOpen(true)}
        onAvatar={pickPhoto}
        onLogout={onLogout}
        cartBtnRef={cartBtnRef}
      />
      <main>
        <div className="hero">
          <Avatar user={user} big onClick={pickPhoto} />
          <div>
            <h1>Здравствуйте, {user.username}</h1>
            <p>Выберите сорт и добавьте его в корзину.</p>
          </div>
          <button className="btn ghost" type="button" onClick={pickPhoto}>Сменить фото</button>
        </div>
        <div className="grid">
          {products.map(p => (
            <ProductCard key={p.id} product={p} qty={qtyOf(p.id)} onAdd={onAdd} onDec={onDec} />
          ))}
        </div>
      </main>
      <Cart open={cartOpen} items={cart} onClose={closeCart} onAdd={onAdd} onDec={onDec} onCheckout={checkout} busy={busy} />
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
    </>
  );
}

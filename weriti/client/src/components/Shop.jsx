import { useRef, useState } from 'react';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import LegalPage from './Legal.jsx';
import { Home, CartPage, ProfilePage } from './Pages.jsx';

/** Экран после входа: шапка с кнопками перехода, страница по адресу (#/, #/cart, #/profile, #/legal/...) и подвал. */
export default function Shop({ user, products, cart, route, soundOn, onToggleSound, onLogout, onAdd, onDec, onCheckout, onAvatar }) {
  const [busy, setBusy] = useState(false);
  const fileRef = useRef(null);

  const qtyOf = id => cart.find(i => i.productId === id)?.qty ?? 0;
  const count = cart.reduce((sum, i) => sum + i.qty, 0);

  const pickPhoto = () => fileRef.current?.click();
  const onFile = e => {
    const file = e.target.files[0];
    e.target.value = '';
    if (file) onAvatar(file);
  };

  async function checkout() {
    setBusy(true);
    await onCheckout();
    setBusy(false);
  }

  let page;
  if (route.startsWith('/legal/')) page = <LegalPage slug={route.slice(7)} />;
  else if (route === '/profile') page = <ProfilePage user={user} soundOn={soundOn} onToggleSound={onToggleSound} onPickPhoto={pickPhoto} onLogout={onLogout} />;
  else if (route === '/cart') page = <CartPage items={cart} onAdd={onAdd} onDec={onDec} onCheckout={checkout} busy={busy} />;
  else page = <Home user={user} products={products} qtyOf={qtyOf} onAdd={onAdd} onDec={onDec} />;

  return (
    <>
      <Header user={user} count={count} route={route} soundOn={soundOn} onToggleSound={onToggleSound} onLogout={onLogout} />
      <main>{page}</main>
      <Footer />
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
    </>
  );
}

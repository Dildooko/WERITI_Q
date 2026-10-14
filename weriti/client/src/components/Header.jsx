import { Grapes } from './Grapes.jsx';
import SoundToggle from './SoundToggle.jsx';
import Avatar from './Avatar.jsx';

export default function Header({ user, count, soundOn, onToggleSound, onOpenCart, onAvatar, onLogout, cartBtnRef }) {
  return (
    <header className="hdr">
      <span className="logo">
        <Grapes />
        <span className="wm">WERITI</span>
      </span>
      <button className="iconbtn" type="button" ref={cartBtnRef} onClick={onOpenCart}>
        Корзина <span className="badge">{count}</span>
      </button>
      <SoundToggle enabled={soundOn} onToggle={onToggleSound} />
      <Avatar user={user} onClick={onAvatar} />
      <button className="iconbtn" type="button" onClick={onLogout}>Выйти</button>
    </header>
  );
}

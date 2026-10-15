import { Grapes } from './Grapes.jsx';
import SoundToggle from './SoundToggle.jsx';
import Avatar from './Avatar.jsx';
import { go } from '../hooks/useRoute.js';

export default function Header({ user, count, route, soundOn, onToggleSound, onLogout }) {
  const cur = path => (route === path ? 'page' : undefined);
  return (
    <header className="hdr">
      <a className="logo" href="#/">
        <Grapes />
        <span className="wm">WERITI</span>
      </a>
      <nav className="nav" aria-label="Основное меню">
        <a className="iconbtn navlink" href="#/" aria-current={cur('/')}>Главная</a>
        <a className="iconbtn navlink" href="#/cart" aria-current={cur('/cart')}>Корзина <span className="badge">{count}</span></a>
        <a className="iconbtn navlink" href="#/profile" aria-current={cur('/profile')}>Профиль</a>
      </nav>
      <SoundToggle enabled={soundOn} onToggle={onToggleSound} />
      <Avatar user={user} onClick={() => go('/profile')} />
      <button className="iconbtn" type="button" onClick={onLogout}>Выйти</button>
    </header>
  );
}

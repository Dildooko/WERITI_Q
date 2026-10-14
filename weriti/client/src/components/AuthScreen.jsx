import { useState } from 'react';
import { api, setToken } from '../api.js';
import { Sound } from '../sound.js';
import { Grapes } from './Grapes.jsx';
import SoundToggle from './SoundToggle.jsx';

/** Экран входа и регистрации. */
export default function AuthScreen({ soundOn, onToggleSound, onLogin, initialMsg }) {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(initialMsg || null);
  const reg = mode === 'register';

  function switchMode() {
    setMode(reg ? 'login' : 'register');
    setMsg(null);
  }

  async function submit(e) {
    e.preventDefault();
    Sound.unlock(); // разрешаем звук, пока есть касание пользователя
    setBusy(true);
    try {
      if (reg) {
        await api.register(username, password);
        setMode('login');
        setPassword('');
        setMsg({ text: 'Аккаунт создан. Теперь войдите.', kind: 'ok' });
      } else {
        const { token, user } = await api.login(username, password);
        setToken(token);
        await onLogin(user);
      }
      Sound.success();
    } catch (err) {
      setMsg({ text: err.message, kind: 'err' });
      Sound.error();
    }
    setBusy(false);
  }

  return (
    <section className="auth">
      <div className="brand">
        <SoundToggle enabled={soundOn} onToggle={onToggleSound} />
        <Grapes />
        <h1>WERITI</h1>
        <p>Свежий зелёный виноград. Войдите, чтобы выбрать сорт и собрать корзину.</p>
      </div>
      <div className="panel">
        <div className="card">
          <h2>{reg ? 'Регистрация' : 'Вход'}</h2>
          <p className="sub">{reg ? 'Придумайте логин и пароль (от 6 символов).' : 'Введите логин и пароль.'}</p>
          <form onSubmit={submit}>
            <label htmlFor="login">Логин</label>
            <input
              id="login"
              value={username}
              onChange={e => setUsername(e.target.value)}
              onInvalid={() => Sound.error()}
              autoComplete="username"
              required
              minLength={3}
              maxLength={32}
            />
            <label htmlFor="pass">Пароль</label>
            <input
              id="pass"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onInvalid={() => Sound.error()}
              autoComplete={reg ? 'new-password' : 'current-password'}
              required
              minLength={6}
            />
            <button className="btn full" type="submit" data-nosound="true" disabled={busy}>
              {busy ? (reg ? 'Создаём…' : 'Входим…') : reg ? 'Создать аккаунт' : 'Войти'}
            </button>
            <p className={'msg' + (msg ? ' ' + msg.kind : '')} role="status">{msg?.text}</p>
          </form>
          <p className="switch">
            <span>{reg ? 'Уже есть аккаунт?' : 'Нет аккаунта?'}</span>{' '}
            <button type="button" onClick={switchMode}>{reg ? 'Войти' : 'Зарегистрироваться'}</button>
          </p>
          <p className="note">Пароль хранится на сервере только в виде хеша (bcrypt).</p>
        </div>
      </div>
    </section>
  );
}

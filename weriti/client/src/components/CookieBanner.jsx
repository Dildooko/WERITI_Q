import { useState } from 'react';

const KEY = 'weriti-cookie';

/** Баннер о cookie: необходимые включены всегда, остальные категории выбирает пользователь (по умолчанию выключены). */
export default function CookieBanner() {
  const [open, setOpen] = useState(() => {
    try { return !localStorage.getItem(KEY); } catch { return true; }
  });
  const [more, setMore] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  if (!open) return null;

  const save = value => {
    try { localStorage.setItem(KEY, JSON.stringify(value)); } catch { /* хранилище недоступно */ }
    setOpen(false);
  };

  return (
    <div className="cookie" role="dialog" aria-label="Использование cookie">
      <p>
        Сайт использует cookie и локальное хранилище браузера. Необходимые нужны для входа и корзины, их нельзя отключить.{' '}
        <a href="#/legal/cookies">Подробнее в политике cookie</a>.
      </p>
      {more && (
        <div className="ck-list">
          <label className="chk"><input type="checkbox" checked disabled /> <span>Необходимые (вход, корзина, ваш выбор в этом баннере)</span></label>
          <label className="chk"><input type="checkbox" checked={analytics} onChange={e => setAnalytics(e.target.checked)} /> <span>Аналитические (сейчас не используются)</span></label>
        </div>
      )}
      <div className="ck-btns">
        <button className="btn ghost" type="button" onClick={() => save({ necessary: true, analytics: false })}>Только необходимые</button>
        <button className="btn ghost" type="button" onClick={() => (more ? save({ necessary: true, analytics }) : setMore(true))}>
          {more ? 'Сохранить выбор' : 'Настроить'}
        </button>
        <button className="btn" type="button" onClick={() => save({ necessary: true, analytics: true })}>Принять все</button>
      </div>
    </div>
  );
}

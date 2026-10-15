import { SITE } from '../siteConfig.js';
import { MailIcon, PhoneIcon, PinIcon, SocialIcon } from './Icons.jsx';

const DOCS = [
  ['requisites', 'Реквизиты'],
  ['privacy', 'Политика конфиденциальности'],
  ['consent', 'Согласие на обработку данных'],
  ['offer', 'Публичная оферта'],
  ['cookies', 'Политика cookie'],
  ['licenses', 'Лицензии'],
];

export default function Footer() {
  return (
    <footer className="ftr">
      <div className="ftr-in">
        <div>
          <b className="ftr-logo">WERITI</b>
          <p className="ftr-sub">Свежий зелёный виноград.</p>
          <ul className="contacts">
            <li><PinIcon /><span>{SITE.address}</span></li>
            <li><PhoneIcon /><a href={'tel:' + SITE.phone.replace(/[^+\d]/g, '')}>{SITE.phone}</a></li>
            <li><MailIcon /><a href={'mailto:' + SITE.email}>{SITE.email}</a></li>
          </ul>
        </div>
        <div>
          <h2 className="ftr-h">Мы в соцсетях</h2>
          <ul className="social">
            {SITE.social.map(s => (
              <li key={s.id}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.label} title={s.label}>
                  <SocialIcon id={s.id} />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <nav aria-label="Документы">
          <h2 className="ftr-h">Документы</h2>
          <ul className="docs">
            {DOCS.map(([slug, title]) => <li key={slug}><a href={'#/legal/' + slug}>{title}</a></li>)}
          </ul>
        </nav>
      </div>
      <p className="ftr-bottom">
        © {new Date().getFullYear()} {SITE.short}.
        {SITE.demo && ' Учебный проект: заказы не исполняются, оплата не принимается.'}
      </p>
    </footer>
  );
}

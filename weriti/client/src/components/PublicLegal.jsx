import { Grapes } from './Grapes.jsx';
import LegalPage from './Legal.jsx';
import Footer from './Footer.jsx';

/** Документы для тех, кто ещё не вошёл (например, ссылка из формы регистрации). */
export default function PublicLegal({ slug }) {
  return (
    <>
      <header className="hdr">
        <a className="logo" href="#/"><Grapes /><span className="wm">WERITI</span></a>
        <a className="iconbtn" href="#/">Войти</a>
      </header>
      <main><LegalPage slug={slug} /></main>
      <Footer />
    </>
  );
}

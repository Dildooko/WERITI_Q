import { LEGAL, ORDER } from '../legalTexts.js';

/** Страница документа: Реквизиты, Политика, Согласие, Оферта, Cookie, Лицензии. */
export default function LegalPage({ slug }) {
  const page = LEGAL[slug];
  return (
    <section className="page legal">
      <nav className="legal-nav" aria-label="Документы">
        {ORDER.map(k => (
          <a key={k} href={'#/legal/' + k} aria-current={k === slug ? 'page' : undefined}>{LEGAL[k].title}</a>
        ))}
      </nav>
      {!page ? (
        <article><h1>Страница не найдена</h1><p><a href="#/">Вернуться на главную</a></p></article>
      ) : (
        <article>
          <h1>{page.title}</h1>
          {page.blocks.map((b, i) => (
            <div key={i}>
              {b.h && <h2>{b.h}</h2>}
              {b.p && b.p.map((t, j) => <p key={j}>{t}</p>)}
              {b.list && <ul>{b.list.map((t, j) => <li key={j}>{t}</li>)}</ul>}
              {b.table && (
                <dl className="req">
                  {b.table.map(([k, v]) => (<div key={k}><dt>{k}</dt><dd>{v}</dd></div>))}
                </dl>
              )}
            </div>
          ))}
        </article>
      )}
    </section>
  );
}

/** Спрайт с гроздью винограда: подключается один раз, дальше рисуется через <Grapes />. */
export function GrapeSprite() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <radialGradient id="g" cx=".35" cy=".3" r=".8">
          <stop offset="0" stopColor="#f1f8cf" />
          <stop offset=".55" stopColor="#a8c95c" />
          <stop offset="1" stopColor="#5f8a2b" />
        </radialGradient>
        <symbol id="grapes" viewBox="0 0 64 64">
          <g fill="url(#g)">
            <circle cx="20" cy="18" r="9" />
            <circle cx="38" cy="18" r="9" />
            <circle cx="12" cy="33" r="9" />
            <circle cx="29" cy="33" r="9" />
            <circle cx="46" cy="33" r="9" />
            <circle cx="21" cy="48" r="9" />
            <circle cx="38" cy="48" r="9" />
            <circle cx="30" cy="59" r="5" />
          </g>
          <path d="M30 12c0-6 4-9 10-10" stroke="#4a6b22" strokeWidth="3" fill="none" strokeLinecap="round" />
        </symbol>
      </defs>
    </svg>
  );
}

export function Grapes() {
  return (
    <svg aria-hidden="true">
      <use href="#grapes" />
    </svg>
  );
}

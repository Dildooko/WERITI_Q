export default function SoundToggle({ enabled, onToggle }) {
  return (
    <button
      className={'iconbtn soundtoggle' + (enabled ? '' : ' off')}
      type="button"
      aria-pressed={enabled}
      aria-label="Звук"
      title={enabled ? 'Звук включён' : 'Звук выключен'}
      onClick={onToggle}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 9v6h4l5 4V5L8 9z" />
        <path className="w" d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" />
        <path className="x" d="M17 9l5 6M22 9l-5 6" />
      </svg>
    </button>
  );
}

const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };

export const MailIcon = () => (
  <svg viewBox="0 0 24 24" {...S} aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>
);
export const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" {...S} aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg>
);
export const PinIcon = () => (
  <svg viewBox="0 0 24 24" {...S} aria-hidden="true"><path d="M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>
);

const LETTERS = { vk: 'VK', tg: 'TG', yt: 'YT' };
export function SocialIcon({ id }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <rect x="2" y="2" width="28" height="28" rx="7" fill="none" stroke="currentColor" strokeWidth="2" />
      <text x="16" y="21" textAnchor="middle" fontSize="12" fontWeight="700" fill="currentColor" fontFamily="system-ui, sans-serif">{LETTERS[id] || '?'}</text>
    </svg>
  );
}

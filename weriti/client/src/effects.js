import { Sound } from './sound.js';

export function installEffects() {
  const unlock = () => Sound.unlock();
  const noop = () => {};

  const onClick = e => {
    const b = e.target.closest && e.target.closest('button');
    if (b && !b.disabled && !b.hasAttribute('data-nosound')) Sound.tap();
  };

  const onRipple = e => {
    const b = e.target.closest && e.target.closest('.btn, .iconbtn, .step button, .ava');
    if (!b || b.disabled || e.button || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = b.getBoundingClientRect();
    const d = Math.max(r.width, r.height) * 2;
    const s = document.createElement('span');
    s.className = 'ripple';
    s.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`;
    b.append(s);
    setTimeout(() => s.remove(), 700);
  };

  addEventListener('pointerdown', unlock, { passive: true });
  addEventListener('keydown', unlock);
  document.addEventListener('touchstart', noop, { passive: true });
  document.addEventListener('click', onClick);
  document.addEventListener('pointerdown', onRipple);

  return () => {
    removeEventListener('pointerdown', unlock);
    removeEventListener('keydown', unlock);
    document.removeEventListener('touchstart', noop);
    document.removeEventListener('click', onClick);
    document.removeEventListener('pointerdown', onRipple);
  };
}

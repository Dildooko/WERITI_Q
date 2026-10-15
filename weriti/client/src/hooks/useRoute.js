import { useEffect, useState } from 'react';

const read = () => location.hash.replace(/^#/, '') || '/';

/** Простая маршрутизация по адресу после #: #/profile, #/cart, #/legal/privacy. */
export function useRoute() {
  const [route, setRoute] = useState(read);
  useEffect(() => {
    const onChange = () => { setRoute(read()); window.scrollTo(0, 0); };
    addEventListener('hashchange', onChange);
    return () => removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

export const go = path => { location.hash = path; };

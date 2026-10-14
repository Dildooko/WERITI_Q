import { useCallback, useEffect, useRef, useState } from 'react';

/** Короткое всплывающее сообщение внизу экрана (исчезает через 2,5 секунды). */
export function useToast() {
  const [toast, setToast] = useState({ text: '', show: false });
  const timer = useRef(0);

  const showToast = useCallback(text => {
    clearTimeout(timer.current);
    setToast({ text, show: true });
    timer.current = setTimeout(() => setToast(t => ({ ...t, show: false })), 2500);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  return { toast, showToast };
}

/** Цена в формате «6,90 €». */
export const fmt = n => Number(n).toFixed(2).replace('.', ',') + ' €';

/** Обрезает фото до квадрата по центру и сжимает до 160×160 (JPEG, data URL). */
export function makeAvatar(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 160;
      const side = Math.min(img.width, img.height);
      canvas.getContext('2d').drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, 160, 160);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Не удалось открыть это изображение'));
    };
    img.src = url;
  });
}

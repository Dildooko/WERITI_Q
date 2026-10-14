/** Круглая кнопка с фото профиля (или первой буквой логина). */
export default function Avatar({ user, big = false, onClick }) {
  return (
    <button
      className={'ava' + (big ? ' big' : '')}
      type="button"
      title="Сменить фото"
      aria-label="Сменить фото профиля"
      onClick={onClick}
    >
      {user.avatar ? <img src={user.avatar} alt="" /> : user.username[0].toUpperCase()}
    </button>
  );
}

/** Shared keyboard state — dipakai game logic & PlayerController di Canvas */
export const keys = new Set<string>();

export function bindKeyboard() {
  function onKeyDown(e: KeyboardEvent) {
    keys.add(e.key.toLowerCase());
  }
  function onKeyUp(e: KeyboardEvent) {
    keys.delete(e.key.toLowerCase());
  }
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  return () => {
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
  };
}

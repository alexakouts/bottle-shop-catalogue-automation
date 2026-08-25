export function createDropboxCursorStore() {
  let cursor;

  async function get() {
    return cursor;
  }

  async function set(value) {
    cursor = value;
  }

  return {
    get,
    set,
  };
}

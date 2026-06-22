// El componente AZEcosistema fue escrito originalmente para un sandbox que
// expone window.storage.{get,set,delete}. Esta es la implementación real
// respaldada por localStorage para que funcione como app web / Capacitor.
if (typeof window !== "undefined" && !window.storage) {
  window.storage = {
    async get(key) {
      const value = localStorage.getItem(key);
      return value === null ? null : { value };
    },
    async set(key, value) {
      localStorage.setItem(key, value);
      return true;
    },
    async delete(key) {
      localStorage.removeItem(key);
      return true;
    }
  };
}

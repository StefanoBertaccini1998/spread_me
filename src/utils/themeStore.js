// una variabile “globale” al modulo
let current = document.documentElement.classList.contains("dark")
  ? "dark"
  : "light";

// subscribers → Set di callback
const subs = new Set();

function notify() {
  subs.forEach((cb) => cb());
}

export const themeStore = {
  get() {
    return current;
  },

  toggle() {
    current = current === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", current === "dark");
    localStorage.theme = current;
    notify();
  },

  subscribe(cb) {
    subs.add(cb);
    // callback per lo unsubscribe
    return () => subs.delete(cb);
  },
};

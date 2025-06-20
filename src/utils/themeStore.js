// Simple publish/subscribe store for the UI theme
// Determine initial theme from localStorage or system preference
let current =
  localStorage.theme === "dark" ||
  (!("theme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
    ? "dark"
    : "light";

// Ensure the root element reflects the chosen theme
document.documentElement.classList.toggle("dark", current === "dark");

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

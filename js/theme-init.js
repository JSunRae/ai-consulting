(function () {
  const THEME_STORAGE_KEY = "theme";
  const VALID_THEMES = new Set(["dark", "light"]);

  function normalizeTheme(theme) {
    return VALID_THEMES.has(theme) ? theme : null;
  }

  function getStoredTheme() {
    try {
      return normalizeTheme(window.localStorage.getItem(THEME_STORAGE_KEY));
    } catch {
      return null;
    }
  }

  function setStoredTheme(theme) {
    const normalizedTheme = normalizeTheme(theme);
    if (!normalizedTheme) return;

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, normalizedTheme);
    } catch {
      // Ignore storage errors and keep the in-memory theme applied.
    }
  }

  function applyTheme(theme) {
    const normalizedTheme = normalizeTheme(theme) ?? "dark";
    document.documentElement.setAttribute("data-theme", normalizedTheme);
    return normalizedTheme;
  }

  window.siteTheme = {
    storageKey: THEME_STORAGE_KEY,
    getStoredTheme,
    setStoredTheme,
    applyTheme,
    getInitialTheme() {
      return getStoredTheme() ?? "dark";
    },
  };

  applyTheme(window.siteTheme.getInitialTheme());
})();
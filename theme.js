(() => {
  'use strict';
  const key = 'furri-theme';
  const root = document.documentElement;
  const media = typeof window.matchMedia === 'function' ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  const valid = value => value === 'light' || value === 'dark';
  let preference = null;
  try { const saved = localStorage.getItem(key); if (valid(saved)) preference = saved; } catch {}
  function apply() {
    const theme = preference || (media?.matches ? 'dark' : 'light');
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#121212' : '#ffffff');
    const button = document.getElementById('theme-toggle');
    if (button) {
      const label = theme === 'dark' ? 'включить светлую тему' : 'включить тёмную тему';
      button.setAttribute('aria-label', label);
      button.setAttribute('aria-pressed', String(theme === 'dark'));
      button.title = label;
    }
  }
  function bind() {
    document.getElementById('theme-toggle')?.addEventListener('click', () => {
      preference = root.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(key, preference); } catch {}
      apply();
    });
    apply();
  }
  apply();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind, { once: true });
  else bind();
  media?.addEventListener('change', () => { if (!preference) apply(); });
  window.addEventListener('storage', event => {
    if (event.key !== key && event.key !== null) return;
    preference = valid(event.newValue) ? event.newValue : null;
    apply();
  });
})();

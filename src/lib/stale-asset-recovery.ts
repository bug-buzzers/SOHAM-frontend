/**
 * Inline script for the root layout's <head>.
 *
 * If the page's own scripts or styles (anything under /_next/static/) fail to
 * load, the HTML belongs to a deployment whose files are gone, for example a
 * tab left open across a deployment, or a page some cache kept too long. Then
 * remove the service worker and its caches and reload once, so the next load
 * comes straight from the server.
 *
 * It is a plain inline script (not next/script) on purpose: next/script only
 * runs after Next.js has started, and here Next.js may be the thing that
 * couldn't load. Written in ES5 because inline scripts aren't transpiled.
 * At most one reload every five minutes per tab, and never while offline.
 */
export const STALE_ASSET_RECOVERY_SCRIPT = `(function () {
  var KEY = 'soham-stale-asset-reload';
  var recovering = false;

  function recover() {
    if (recovering || !navigator.onLine) return;
    try {
      var last = Number(sessionStorage.getItem(KEY) || 0);
      if (Date.now() - last < 5 * 60 * 1000) return;
      sessionStorage.setItem(KEY, String(Date.now()));
    } catch (e) {
      return;
    }
    recovering = true;
    var jobs = [];
    if ('serviceWorker' in navigator) {
      jobs.push(navigator.serviceWorker.getRegistrations().then(function (registrations) {
        return Promise.all(registrations.map(function (registration) { return registration.unregister(); }));
      }));
    }
    if (window.caches) {
      jobs.push(caches.keys().then(function (names) {
        return Promise.all(names.map(function (name) { return caches.delete(name); }));
      }));
    }
    var reload = function () { location.reload(); };
    setTimeout(reload, 3000);
    Promise.all(jobs).then(reload, reload);
  }

  function isAppAsset(element) {
    if (!element || !element.tagName) return false;
    var url = '';
    if (element.tagName === 'SCRIPT') url = element.src;
    else if (element.tagName === 'LINK' && /(^|\\s)stylesheet(\\s|$)/i.test(element.rel)) url = element.href;
    return !!url && url.indexOf('/_next/static/') !== -1;
  }

  // Files that fail after this script has run, e.g. code loaded on demand
  window.addEventListener('error', function (event) {
    if (isAppAsset(event.target)) recover();
  }, true);

  // Files that failed before it ran: Next.js sets window.next when it starts,
  // and a stylesheet that failed to load has no .sheet.
  window.addEventListener('load', function () {
    var styles = document.querySelectorAll('link[rel~="stylesheet"][href*="/_next/static/"]');
    var styleFailed = false;
    for (var i = 0; i < styles.length; i++) {
      if (!styles[i].sheet) styleFailed = true;
    }
    if (!window.next || styleFailed) recover();
  });
})();`;

importScripts(
    "https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js"
  );
  
  const OFFLINE_HTML = "/offline.html";
  const FONT_TTF = "/inter-font.ttf";
  const OFL_TXT = "/OFL.txt";
  const PRECACHE = [OFFLINE_HTML, FONT_TTF, OFL_TXT];
  
  workbox.precaching.precacheAndRoute(PRECACHE);
  
  const htmlHandler = new workbox.strategies.NetworkOnly();
  
  const navigationRoute = new workbox.routing.NavigationRoute(({ event }) => {
    const request = event.request;
  
    return htmlHandler
      .handle({ event, request })
      .catch((err) => caches.match(OFFLINE_HTML, { ignoreSearch: true }));
  });
  
  workbox.routing.registerRoute(navigationRoute);
  
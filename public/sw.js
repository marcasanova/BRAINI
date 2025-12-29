// Service Worker mínimo - Solo para registro de PWA
// NO incluye funcionalidad offline (solo online)

const CACHE_NAME = 'braini-v1';
const VERSION = '1.0.0';

// Instalación - Solo registra, no cachea nada
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Instalando...');
  // Fuerza la activación inmediata
  self.skipWaiting();
});

// Activación - Limpia caches antiguos si existen
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activando...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Eliminando cache antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Toma control inmediato de todas las páginas
  return self.clients.claim();
});

// Fetch - NO cachea nada, siempre va a la red
self.addEventListener('fetch', (event) => {
  // No interceptamos ninguna petición
  // Todo se sirve directamente desde la red
  // Esto asegura que la app siempre funcione online
  return;
});


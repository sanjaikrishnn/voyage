import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {registerSW} from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';

// Automatically register service worker with auto-update
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('[PWA] New content available. Service worker updated.');
  },
  onOfflineReady() {
    console.log('[PWA] Voyager app is ready to work offline.');
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);


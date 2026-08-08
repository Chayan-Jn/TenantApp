import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.jsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1
    }
  }
})


const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <HelmetProvider>
            <App />
          </HelmetProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  </StrictMode>
)

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

// Capture PWA install prompt globally so React components can use it later.
// The event fires once, very early — before most components mount.
window.__pwaInstallPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault(); // Prevent the automatic mini-infobar
  window.__pwaInstallPrompt = e;
  // Dispatch a custom event so any mounted React hook can react immediately
  window.dispatchEvent(new Event('pwa-install-available'));
});
window.addEventListener('appinstalled', () => {
  window.__pwaInstallPrompt = null;
  window.dispatchEvent(new Event('pwa-install-available'));
});
import { useState, useEffect, useCallback } from 'react';

/**
 * Hook that reads the globally-captured PWA install prompt from main.jsx.
 * The beforeinstallprompt event fires once, very early (before most components mount),
 * so main.jsx captures it on window.__pwaInstallPrompt and dispatches a custom event.
 */
export function usePWAInstall() {
  const [isInstallable, setIsInstallable] = useState(() => !!window.__pwaInstallPrompt);

  useEffect(() => {
    const update = () => setIsInstallable(!!window.__pwaInstallPrompt);
    window.addEventListener('pwa-install-available', update);
    return () => window.removeEventListener('pwa-install-available', update);
  }, []);

  const promptInstall = useCallback(async () => {
    const prompt = window.__pwaInstallPrompt;
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') {
      window.__pwaInstallPrompt = null;
      setIsInstallable(false);
    }
  }, []);

  return { isInstallable, promptInstall };
}

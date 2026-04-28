import { useState, useEffect } from 'react';

export function usePWAInstall() {
  const [installPrompt, setInstallPrompt] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      // Prevent the mini-infobar from appearing automatically on Android
      e.preventDefault();
      // Stash the event so it can be triggered later by our custom button.
      setInstallPrompt(e);
    };

    const installHandler = () => {
      // Hide the prompt if the app was installed successfully
      setInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', installHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installHandler);
    };
  }, []);

  const promptInstall = async () => {
    if (!installPrompt) return;
    
    // Show the native install prompt
    installPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await installPrompt.userChoice;
    
    // We no longer need the prompt. Clear it up if accepted.
    if (outcome === 'accepted') {
      setInstallPrompt(null);
    }
  };

  return { isInstallable: !!installPrompt, promptInstall };
}

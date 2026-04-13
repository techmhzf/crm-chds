import { useState, useEffect } from 'react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('pwa-dismissed')) return;

    const isIOSDevice = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

    if (isIOSDevice && !isStandalone) {
      setIsIOS(true);
      setShow(true);
      return;
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setShow(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem('pwa-dismissed', 'true');
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#111] border-t border-white/10 px-5 py-4 flex items-center justify-between z-50">
      <p className="text-sm text-white flex-1 mr-4">
        {isIOS
          ? 'Tap the share button then "Add to Home Screen" to install CHDS CRM'
          : 'Install CHDS CRM on your device for quick access'}
      </p>
      <div className="flex items-center gap-3 shrink-0">
        {!isIOS && (
          <button
            onClick={handleInstall}
            className="bg-white text-black font-semibold hover:bg-gray-100 rounded-lg px-3 py-1.5 text-xs transition-all"
          >
            Install
          </button>
        )}
        <button onClick={handleDismiss} className="text-[#888] text-xs hover:text-white transition-colors">
          Not now
        </button>
      </div>
    </div>
  );
}

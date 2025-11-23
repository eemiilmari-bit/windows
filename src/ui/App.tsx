import { useEffect, useMemo, useState } from 'react';
import { engine } from '../engine';
import { LicenseStatus, SessionState, SettingsState, WindowInfo } from '../engine/types';
import Desktop from './components/Desktop';
import SetupWizard from './components/SetupWizard';
import Taskbar from './components/Taskbar';
import StartMenu from './components/StartMenu';
import WindowManager from './components/WindowManager';
import ToastCenter from './components/ToastCenter';

const wallpapers: Record<string, string> = {
  'gradient-1': 'linear-gradient(135deg, #0f172a, #1d4ed8)',
  'gradient-2': 'linear-gradient(135deg, #0f172a, #059669)',
  'gradient-3': 'linear-gradient(135deg, #1f2937, #8b5cf6)',
};

export default function App() {
  const [session, setSession] = useState<SessionState>(engine.getSessionState());
  const [license, setLicense] = useState<LicenseStatus>(engine.getLicenseStatus());
  const [settings, setSettings] = useState<SettingsState>(engine.getSettings());
  const [windows, setWindows] = useState<WindowInfo[]>(engine.getWindows());
  const [startOpen, setStartOpen] = useState(false);
  const notifications = engine.getNotifications();

  useEffect(() => {
    return engine.subscribe(() => {
      setSession(engine.getSessionState());
      setLicense(engine.getLicenseStatus());
      setSettings(engine.getSettings());
      setWindows(engine.getWindows());
    });
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', settings.accent);
    document.body.style.background = settings.theme === 'dark' ? '#0b1220' : '#e5e7eb';
    document.body.style.color = settings.theme === 'dark' ? '#e5e7eb' : '#111827';
  }, [settings]);

  const wallpaper = useMemo(() => wallpapers[settings.wallpaper] ?? wallpapers['gradient-1'], [settings.wallpaper]);

  return (
    <div>
      {session !== 'loggedIn' && (
        <SetupWizard session={session} license={license} onLicense={(key) => engine.activateWithKey(key)} onCreateUser={(u, p, c) => engine.createUserAccount(u, p, c)} />
      )}
      {session === 'loggedIn' && (
        <>
          <Desktop wallpaper={wallpaper} onOpen={(appId, path) => {
            const { windowId } = engine.launchApp(appId);
            if (path) engine.pushNotification({ title: 'Opening item', body: path });
            setStartOpen(false);
            engine.focusWindow(windowId);
          }} />
          <WindowManager windows={windows} onClose={(id) => engine.closeWindow(id)} onMinimize={(id) => engine.minimizeWindow(id)} onMaximize={(id) => engine.toggleMaximize(id)} onFocus={(id) => engine.focusWindow(id)} />
          <Taskbar startOpen={startOpen} onToggleStart={() => setStartOpen((v) => !v)} onLaunch={(appId) => engine.launchApp(appId)} />
          {startOpen && <StartMenu onLaunch={(id) => { engine.launchApp(id); setStartOpen(false); }} />}
          <ToastCenter notifications={notifications} />
        </>
      )}
    </div>
  );
}

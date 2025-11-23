import { engine } from '../../engine';
import { TaskbarState } from '../../engine/types';

interface Props {
  startOpen: boolean;
  onToggleStart: () => void;
  onLaunch: (appId: string) => void;
}

export default function Taskbar({ startOpen, onToggleStart, onLaunch }: Props) {
  const state: TaskbarState = engine.getTaskbarState();
  const apps = engine.getApps();
  return (
    <div className="taskbar">
      <div className="start" onClick={onToggleStart}>{startOpen ? '✖' : '◆'}</div>
      <div className="apps">
        {state.pinned.map((id) => {
          const app = apps.find((a) => a.id === id);
          if (!app) return null;
          const isRunning = state.running.some((pid) => engine.getProcesses().find((p) => p.pid === pid && p.appId === id));
          return (
            <div key={id} className="app" onClick={() => onLaunch(id)} title={app.name}>
              <span>{app.icon}</span>
              {isRunning && <div className="dot" />}
            </div>
          );
        })}
      </div>
      <div className="tray">
        <span>🔔 {engine.getNotifications().filter((n) => !n.read).length}</span>
        <span>🌐</span>
        <span>{state.clock}</span>
      </div>
    </div>
  );
}

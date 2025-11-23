import { engine } from '../../engine';
import { WindowInfo } from '../../engine/types';
import FileExplorer from '../apps/FileExplorer';
import SettingsApp from '../apps/SettingsApp';
import TaskManagerApp from '../apps/TaskManagerApp';
import NotepadApp from '../apps/NotepadApp';
import BrowserStub from '../apps/BrowserStub';
import AppStoreApp from '../apps/AppStoreApp';
import GameHub from '../apps/GameHub';

interface Props {
  windows: WindowInfo[];
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
}

export default function WindowManager({ windows, onClose, onFocus, onMaximize, onMinimize }: Props) {
  const renderContent = (w: WindowInfo) => {
    switch (w.appId) {
      case 'explorer':
        return <FileExplorer />;
      case 'settings':
        return <SettingsApp />;
      case 'task-manager':
        return <TaskManagerApp />;
      case 'notepad':
        return <NotepadApp windowId={w.windowId} />;
      case 'browser':
        return <BrowserStub />;
      case 'app-store':
        return <AppStoreApp />;
      case 'game-hub':
        return <GameHub />;
      default:
        return <div style={{ padding: 12 }}>Unknown app.</div>;
    }
  };

  return (
    <>
      {windows.map((w) => (
        <div
          key={w.windowId}
          className="window"
          style={{
            left: w.position.x,
            top: w.position.y,
            width: w.size.width,
            height: w.size.height,
            zIndex: w.zIndex,
            display: w.isMinimized ? 'none' : 'flex',
          }}
          onMouseDown={() => onFocus(w.windowId)}
        >
          <header>
            <div className="title">{w.title}</div>
            <div className="actions">
              <button onClick={() => onMinimize(w.windowId)}>-</button>
              <button onClick={() => onMaximize(w.windowId)}>▢</button>
              <button className="close" onClick={() => onClose(w.windowId)}>
                ×
              </button>
            </div>
          </header>
          <div style={{ flex: 1, overflow: 'auto', background: 'rgba(0,0,0,0.04)' }}>{renderContent(w)}</div>
        </div>
      ))}
    </>
  );
}

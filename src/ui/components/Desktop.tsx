import { engine } from '../../engine';
import { DesktopState } from '../../engine/types';

interface Props {
  wallpaper: string;
  onOpen: (appId: string, path?: string) => void;
}

export default function Desktop({ wallpaper, onOpen }: Props) {
  const state: DesktopState = engine.getDesktopState();
  return (
    <div className="desktop" style={{ background: wallpaper }}>
      <div className="desktop-icons">
        {state.icons.map((icon) => (
          <div key={icon.title + icon.path} className="desktop-icon" onDoubleClick={() => icon.appId && onOpen(icon.appId, icon.path)}>
            <div style={{ fontSize: 28 }}>{icon.icon}</div>
            <div>{icon.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

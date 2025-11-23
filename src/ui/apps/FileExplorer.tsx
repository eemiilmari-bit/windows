import { useState } from 'react';
import { engine } from '../../engine';
import { FileSystemEntry } from '../../engine/types';

export default function FileExplorer() {
  const user = engine.getCurrentUser();
  const base = user ? `C:/Users/${user.username}/Desktop` : 'C:/Users/Default/Desktop';
  const [path, setPath] = useState(base);
  const [name, setName] = useState('');

  const items: FileSystemEntry[] = engine.listDirectory(path);

  const open = (item: FileSystemEntry) => {
    if (item.type === 'folder') {
      setPath(item.path);
    } else {
      engine.launchApp('notepad');
      engine.pushNotification({ title: 'File opened', body: item.path });
    }
  };

  const createFolder = () => {
    if (!name) return;
    engine.createFolder(path, name);
    setName('');
  };

  return (
    <div style={{ padding: 12 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <strong>Path:</strong>
        <span>{path}</span>
      </div>
      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <input placeholder="New folder" value={name} onChange={(e) => setName(e.target.value)} />
        <button onClick={createFolder}>New Folder</button>
      </div>
      <div style={{ marginTop: 12, display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
        {items.map((item) => (
          <div
            key={item.path}
            className="desktop-icon"
            onDoubleClick={() => open(item)}
            style={{ alignItems: 'flex-start' }}
          >
            <div style={{ fontSize: 24 }}>{item.icon}</div>
            <div>{item.name}</div>
            <small style={{ color: '#94a3b8' }}>{item.type}</small>
          </div>
        ))}
        {items.length === 0 && <p>No items here yet.</p>}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { engine } from '../../engine';

interface Props {
  windowId: string;
}

export default function NotepadApp({ windowId }: Props) {
  const [content, setContent] = useState('Type your notes here...');
  const [path, setPath] = useState('C:/Users/Shared/note.txt');

  const save = () => {
    const parts = path.split('/');
    const filename = parts.pop();
    const dir = parts.join('/');
    if (!filename) return;
    try {
      engine.createFile(dir, filename, content);
      engine.pushNotification({ title: 'File saved', body: path });
    } catch (err) {
      engine.pushNotification({ title: 'Save failed', body: String(err) });
    }
  };

  return (
    <div style={{ padding: 12, display: 'grid', gap: 10, height: '100%' }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <input value={path} onChange={(e) => setPath(e.target.value)} />
        <button onClick={save}>Save</button>
      </div>
      <textarea style={{ flex: 1, minHeight: '360px' }} value={content} onChange={(e) => setContent(e.target.value)} />
      <div>Window ID: {windowId}</div>
    </div>
  );
}

import { useMemo, useState } from 'react';
import { engine } from '../../engine';

interface Props {
  onLaunch: (id: string) => void;
}

export default function StartMenu({ onLaunch }: Props) {
  const [query, setQuery] = useState('');
  const apps = engine.getApps();
  const filtered = useMemo(() => apps.filter((a) => a.name.toLowerCase().includes(query.toLowerCase())), [apps, query]);
  const user = engine.getCurrentUser();

  return (
    <div className="start-menu">
      <input placeholder="Search apps" value={query} onChange={(e) => setQuery(e.target.value)} />
      <div className="user" style={{ gridColumn: 'span 2' }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: user?.avatarColor ?? '#6366f1' }} />
        <div>
          <div style={{ fontWeight: 700 }}>{user?.username ?? 'Guest'}</div>
          <small style={{ color: '#9ca3af' }}>Active user</small>
        </div>
      </div>
      {filtered.map((app) => (
        <div key={app.id} className="desktop-icon" onClick={() => onLaunch(app.id)}>
          <div style={{ fontSize: 24 }}>{app.icon}</div>
          <div>{app.name}</div>
        </div>
      ))}
    </div>
  );
}

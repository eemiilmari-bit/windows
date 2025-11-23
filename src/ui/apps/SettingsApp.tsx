import { engine } from '../../engine';
import { SettingsState } from '../../engine/types';

export default function SettingsApp() {
  const settings: SettingsState = engine.getSettings();
  const license = engine.getLicenseStatus();
  const user = engine.getCurrentUser();

  const update = (partial: Partial<SettingsState>) => engine.updateSettings(partial);

  const maskedKey = license.state === 'ACTIVATED' ? license.key.slice(-4) : null;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', height: '100%' }}>
      <div style={{ borderRight: '1px solid rgba(255,255,255,0.06)', padding: 12, display: 'grid', gap: 8 }}>
        <div style={{ fontWeight: 700 }}>Sections</div>
        <div>System</div>
        <div>Personalization</div>
        <div>Accounts</div>
        <div>Activation</div>
        <div>Sound</div>
      </div>
      <div style={{ padding: 16, display: 'grid', gap: 18, overflow: 'auto' }}>
        <section>
          <h3>Appearance</h3>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => update({ theme: 'light' })}>Light</button>
            <button onClick={() => update({ theme: 'dark' })}>Dark</button>
          </div>
          <div style={{ marginTop: 10 }}>Accent color</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['#6366f1', '#22c55e', '#f97316', '#0ea5e9', '#e11d48'].map((c) => (
              <div key={c} onClick={() => update({ accent: c })} style={{ width: 28, height: 28, borderRadius: 8, background: c, cursor: 'pointer', border: settings.accent === c ? '3px solid white' : '2px solid transparent' }} />
            ))}
          </div>
          <div style={{ marginTop: 10 }}>Wallpaper</div>
          <div style={{ display: 'flex', gap: 10 }}>
            {['gradient-1', 'gradient-2', 'gradient-3'].map((w) => (
              <div key={w} onClick={() => update({ wallpaper: w })} style={{ width: 90, height: 56, borderRadius: 12, background: w === 'gradient-1' ? 'linear-gradient(135deg,#0f172a,#1d4ed8)' : w === 'gradient-2' ? 'linear-gradient(135deg,#0f172a,#059669)' : 'linear-gradient(135deg,#1f2937,#8b5cf6)', border: settings.wallpaper === w ? '3px solid white' : '2px solid transparent', cursor: 'pointer' }} />
            ))}
          </div>
        </section>
        <section>
          <h3>Activation</h3>
          <p>Status: {license.state}</p>
          {maskedKey && <p>Last key: ••••-{maskedKey}</p>}
          {license.state !== 'ACTIVATED' && <button onClick={() => engine.activateWithKey(prompt('Enter key') || '')}>Change key</button>}
        </section>
        <section>
          <h3>Accounts</h3>
          <p>Current user: {user?.username}</p>
          <div style={{ display: 'flex', gap: 8 }}>
            {engine.listUsers().map((u) => (
              <button key={u.id} onClick={() => engine.switchUser(u.id)} style={{ background: u.avatarColor }}>
                {u.username}
              </button>
            ))}
            <button onClick={() => engine.logout()}>Log out</button>
          </div>
        </section>
        <section>
          <h3>Sound</h3>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" checked={settings.soundEnabled} onChange={(e) => update({ soundEnabled: e.target.checked })} />
            Enable sounds
          </label>
        </section>
      </div>
    </div>
  );
}

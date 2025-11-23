export default function AppStoreApp() {
  const apps = [
    { name: 'Sketch Desk', status: 'Coming soon' },
    { name: 'Music Pad', status: 'Coming soon' },
    { name: 'Terminal Lite', status: 'Available' },
  ];
  return (
    <div style={{ padding: 16, display: 'grid', gap: 12 }}>
      <h2>Sim Store</h2>
      <p>A friendly showcase for future simulator apps.</p>
      <div style={{ display: 'grid', gap: 10 }}>
        {apps.map((app) => (
          <div key={app.name} style={{ padding: 12, borderRadius: 12, background: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 700 }}>{app.name}</div>
              <small style={{ color: '#cbd5e1' }}>{app.status}</small>
            </div>
            <button disabled>{app.status === 'Available' ? 'Install' : 'Notify me'}</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BrowserStub() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Offline Browser</h2>
      <p>You are offline in this simulator. This browser is a stub for realism.</p>
      <div style={{ marginTop: 10, padding: 12, background: 'rgba(255,255,255,0.06)', borderRadius: 12 }}>
        <strong>Tips:</strong>
        <ul>
          <li>Use the start menu to launch local apps.</li>
          <li>Personalize your desktop from Settings.</li>
        </ul>
      </div>
    </div>
  );
}

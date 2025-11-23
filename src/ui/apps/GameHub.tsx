export default function GameHub() {
  const games = [
    { name: 'Solitaireish', status: 'Playable soon' },
    { name: 'Pixel Runner', status: 'Prototype' },
    { name: 'Puzzle Box', status: 'Coming soon' },
  ];
  return (
    <div style={{ padding: 14, display: 'grid', gap: 10 }}>
      <h2>Arcade Hub</h2>
      <p>Lightweight game placeholders to make the simulator playful.</p>
      <div style={{ display: 'grid', gap: 10 }}>
        {games.map((game) => (
          <div key={game.name} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 12, display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 700 }}>{game.name}</div>
              <small style={{ color: '#cbd5e1' }}>{game.status}</small>
            </div>
            <button disabled>Play</button>
          </div>
        ))}
      </div>
    </div>
  );
}

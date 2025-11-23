import { engine } from '../../engine';
import { ProcessInfo } from '../../engine/types';

export default function TaskManagerApp() {
  const processes: ProcessInfo[] = engine.getProcesses();
  return (
    <div style={{ padding: 12, display: 'grid', gap: 10 }}>
      <h3>Processes</h3>
      <div style={{ display: 'grid', gap: 8 }}>
        {processes.map((p) => (
          <div key={p.pid} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', padding: '8px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: 10 }}>
            <span>{p.name}</span>
            <span>{p.cpuUsage.toFixed(1)}% CPU</span>
            <span>{p.memoryUsage.toFixed(0)} MB</span>
            <span>{p.status}</span>
            <button onClick={() => engine.endProcess(p.pid)}>End task</button>
          </div>
        ))}
        {processes.length === 0 && <p>No running apps.</p>}
      </div>
    </div>
  );
}

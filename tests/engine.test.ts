import { describe, expect, it } from 'vitest';
import { OSEngine } from '../src/engine';

describe('OSEngine', () => {
  it('activates license keys and prevents reuse', () => {
    const eng = new OSEngine();
    eng.activateWithKey('SIM-WIN-AAAA-1111-TEST-01');
    expect(eng.getLicenseStatus().state).toBe('ACTIVATED');
    eng.logout();
    const second = eng.activateWithKey('SIM-WIN-AAAA-1111-TEST-01');
    expect(second.state).toBe('ACTIVATION_FAILED');
  });

  it('creates users and switches sessions', () => {
    const eng = new OSEngine();
    eng.activateWithKey('SIM-WIN-BBBB-2222-TEST-02');
    eng.createUserAccount('alice', undefined, '#6366f1');
    expect(eng.getCurrentUser()?.username).toBe('alice');
    eng.createUserAccount('bob', undefined, '#22c55e');
    expect(eng.listUsers().length).toBe(2);
  });

  it('launches and terminates processes', () => {
    const eng = new OSEngine();
    eng.activateWithKey('SIM-WIN-CCCC-3333-TEST-03');
    eng.createUserAccount('carol', undefined, '#6366f1');
    const { pid } = eng.launchApp('notepad');
    expect(eng.getProcesses().length).toBe(1);
    eng.endProcess(pid);
    expect(eng.getProcesses().length).toBe(0);
  });

  it('persists settings per user', () => {
    const eng = new OSEngine();
    eng.activateWithKey('SIM-WIN-DDDD-4444-TEST-04');
    eng.createUserAccount('dave', undefined, '#10b981');
    eng.updateSettings({ theme: 'dark' });
    expect(eng.getSettings().theme).toBe('dark');
  });
});

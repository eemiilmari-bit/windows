import { useMemo, useState } from 'react';
import { LicenseStatus, SessionState } from '../../engine/types';

interface Props {
  session: SessionState;
  license: LicenseStatus;
  onLicense: (key: string) => void;
  onCreateUser: (username: string, password: string | undefined, color: string) => void;
}

const colors = ['#6366f1', '#22c55e', '#f59e0b', '#10b981', '#06b6d4', '#f472b6'];

export default function SetupWizard({ session, license, onLicense, onCreateUser }: Props) {
  const [step, setStep] = useState(0);
  const [key, setKey] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [color, setColor] = useState(colors[0]);
  const [region, setRegion] = useState('United States');

  const steps = useMemo(
    () => [
      'Preparing your simulator',
      'Choose language & region',
      'Enter license key',
      'Create your account',
      'All set!'
    ],
    []
  );

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));

  return (
    <div className="setup">
      <div className="setup-card">
        <div className="progress">
          {steps.map((_, idx) => (
            <div key={idx} className={`dot ${idx <= step ? 'active' : ''}`} />
          ))}
        </div>
        <h2>{steps[step]}</h2>
        {step === 0 && (
          <p>Welcome! This sandbox boots in a few seconds.</p>
        )}
        {step === 1 && (
          <div style={{ display: 'grid', gap: 12 }}>
            <label>
              Language
              <select value="English (US)" readOnly>
                <option>English (US)</option>
              </select>
            </label>
            <label>
              Region
              <input value={region} onChange={(e) => setRegion(e.target.value)} />
            </label>
          </div>
        )}
        {step === 2 && (
          <div style={{ display: 'grid', gap: 10 }}>
            <label>License key</label>
            <input value={key} onChange={(e) => setKey(e.target.value)} placeholder="SIM-WIN-XXXX-1111-TEST-01" />
            {license.state === 'ACTIVATION_FAILED' && <div style={{ color: '#f87171' }}>{license.reason}</div>}
            <button onClick={() => onLicense(key)}>Validate key</button>
          </div>
        )}
        {step === 3 && (
          <div style={{ display: 'grid', gap: 10 }}>
            <label>Username</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="SimUser" />
            <label>Password (optional)</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
            <label>Avatar color</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {colors.map((c) => (
                <div key={c} onClick={() => setColor(c)} style={{ width: 32, height: 32, borderRadius: 10, background: c, border: c === color ? '3px solid white' : '2px solid transparent', cursor: 'pointer' }} />
              ))}
            </div>
            <button disabled={!username} onClick={() => onCreateUser(username, password || undefined, color)}>Create account</button>
          </div>
        )}
        {step === 4 && <p>Launching your desktop experience...</p>}
        <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
          {step < steps.length - 1 && <button onClick={next}>Next</button>}
          {step === 2 && license.state === 'ACTIVATED' && <button onClick={next}>Continue</button>}
          {step === 0 && session === 'setup' && <button onClick={() => setStep(1)}>Start setup</button>}
          {step === 1 && <button onClick={() => setStep(2)}>Go to activation</button>}
          {step === 2 && license.state === 'ACTIVATION_FAILED' && <button onClick={() => setKey('')}>Clear</button>}
          {step === 3 && license.state === 'ACTIVATED' && <button onClick={() => setStep(4)}>Finalize</button>}
        </div>
      </div>
    </div>
  );
}

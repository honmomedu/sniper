import { useState } from 'react';
import { Lock } from 'lucide-react';

function Login({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === '2026') {
      onLogin('user');
    } else if (password === '88889999') {
      onLogin('admin');
    } else {
      setError('លេខសម្ងាត់មិនត្រឹមត្រូវទេ!');
    }
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--primary)' }}>
        <Lock size={48} />
      </div>
      <h2 style={{ marginBottom: '0.5rem' }}>សូមបញ្ចូលលេខសម្ងាត់</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Login to Spin the Wheel</p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="password"
            className="input-field"
            placeholder="លេខសម្ងាត់ (Password)"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            autoFocus
          />
        </div>
        {error && <p style={{ color: 'var(--danger)', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</p>}
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
          ចូល (Enter)
        </button>
      </form>
    </div>
  );
}

export default Login;

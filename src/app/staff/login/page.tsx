'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StaffLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.role === 'staff') {
            router.push('/staff/dashboard');
        } else if (data.role === 'owner') {
            router.push('/owner/dashboard');
        } else {
            router.push('/');
        }
      } else {
        setError(data.error || 'Login failed');
        setLoading(false);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="container-narrow mt-8 px-4" style={{ backgroundColor: '#fff', minHeight: '100vh', margin: 0, width: '100vw', maxWidth: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card w-full" style={{ maxWidth: '400px', boxShadow: 'var(--shadow-md)', border: 'none' }}>
        <h2 className="text-2xl font-bold mb-2 text-center" style={{ color: 'var(--accent-primary)' }}>Fixr</h2>
        <p className="text-center mb-6 text-muted">Staff / Owner Login</p>

        {error && <div className="mb-4 text-sm font-bold text-center" style={{ color: 'var(--danger)' }}>{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-6">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

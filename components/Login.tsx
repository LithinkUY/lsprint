import React, { useState } from 'react';

const Login: React.FC<{ setIsAuthenticated: (value: boolean) => void }> = ({ setIsAuthenticated }) => {
  const [credentials, setCredentials] = useState({ user: '', pass: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (credentials.user === 'admin' && credentials.pass === '123456') {
      localStorage.setItem('adminToken', 'logged-in');
      setIsAuthenticated(true);
    } else {
      alert('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '2rem', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            value={credentials.user}
            onChange={(e) => setCredentials({ ...credentials, user: e.target.value })}
            placeholder="Usuario"
            required
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="password"
            value={credentials.pass}
            onChange={(e) => setCredentials({ ...credentials, pass: e.target.value })}
            placeholder="Contraseña"
            required
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>
        <button
          type="submit"
          style={{ width: '100%', padding: '0.5rem', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Entrar
        </button>
      </form>
    </div>
  );
};

export default Login;
import React, { useState } from 'react';

interface LoginProps {
  onLoginSuccess: () => void;
  onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123123') {
      onLoginSuccess();
      setError('');
    } else {
      setError('Usuario o contraseña incorrectos.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-[100] flex items-center justify-center">
      <div className="relative p-8 bg-white rounded-lg shadow-xl w-full max-w-sm">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600">
            GB<span className="text-gray-700">PRINT</span>
          </h1>
          <p className="text-gray-500">Panel de Administración</p>
        </div>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Usuario
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
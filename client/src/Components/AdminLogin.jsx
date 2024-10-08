import React, { useState } from 'react';

const AdminLogin = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const adminCredentials = {
    email: 'admin@example.com',
    password: 'admin123',
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === adminCredentials.email && password === adminCredentials.password) {
      onLoginSuccess();
      setErrorMessage('');
    } else {
      setErrorMessage('Invalid email or password');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-xs">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
          {errorMessage && <p className="text-red-500 text-xs italic">{errorMessage}</p>}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;

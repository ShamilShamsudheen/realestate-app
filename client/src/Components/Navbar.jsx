import React from 'react';

const Navbar = ({ isLoggedIn, handleLogout, handleLogin }) => {
  return (
    <nav className="bg-gray-200 p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left side - Admin Dashboard text */}
        <div className="text-gray-800 text-xl font-bold">Admin Dashboard</div>

        {/* Right side - Login/Logout Button */}
        <div>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

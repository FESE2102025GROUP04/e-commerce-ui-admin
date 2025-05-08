import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-gray-900 text-white p-3 flex justify-between items-center shadow-md">
      {/* Left section: Logo and title */}
      <div className="flex items-center">
        <div className="mr-2 text-xl font-bold">
          E-commerce Admin Panel
        </div>
      </div>
      
      {/* Right section: User info*/}
      <div className="flex items-center">
        {/* User profile */}
        <div className="flex items-center ml-2">
          <div className="bg-gray-200 rounded-full h-8 w-8 flex items-center justify-center text-gray-900 font-bold">
            A
          </div>
          <div className="ml-2">
            <span className="text-sm">Admin</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
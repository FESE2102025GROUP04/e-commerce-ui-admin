import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  Layers,
  PlusCircle
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path
      ? 'bg-emerald-600 text-white'
      : 'text-gray-300 hover:bg-gray-700 hover:text-white';

  const NavItem = ({ to, icon: Icon, label }) => (
    <li>
      <Link
        to={to}
        className={`flex items-center gap-3 px-4 py-2 rounded-md transition-all duration-200 ${isActive(to)}`}
      >
        <Icon className="h-5 w-5" />
        <span className="text-sm font-medium">{label}</span>
      </Link>
    </li>
  );

  return (
    <aside className="bg-gray-900 text-white w-64 min-h-screen shadow-lg flex flex-col">
      <div className="px-4 py-6">
        <h2 className="text-2xl font-extrabold text-white mb-8 text-center tracking-wide">
          Admin Panel
        </h2>

        {/* Overview */}
        <div className="mb-6">
          <h3 className="text-xs uppercase text-gray-400 mb-2 px-4">Overview</h3>
          <ul className="space-y-1">
            <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
          </ul>
        </div>

        {/* Product Management */}
        <div className="mb-6">
          <h3 className="text-xs uppercase text-gray-400 mb-2 px-4">Product Management</h3>
          <ul className="space-y-1">
            <NavItem to="/dashboard/products" icon={Package} label="List Products" />
            <NavItem to="/dashboard/products/create" icon={PlusCircle} label="Create Product" />
          </ul>
        </div>
        

        {/* Category Management */}
        <div className="mb-6">
          <h3 className="text-xs uppercase text-gray-400 mb-2 px-4">Category Management</h3>
          <ul className="space-y-1">
            <NavItem to="/dashboard/categories" icon={Layers} label="List Categories" />
            <NavItem to="/dashboard/categories/create" icon={PlusCircle} label="Create Category" />
          </ul>
        </div>


        {/* User Management */}
        <div className="mb-6">
          <h3 className="text-xs uppercase text-gray-400 mb-2 px-4">User Management</h3>
          <ul className="space-y-1">
            <NavItem to="/dashboard/admin-users" icon={Users} label="Admin Users" />
            <NavItem to="/dashboard/consumer-users" icon={Users} label="Consumer Users" />
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

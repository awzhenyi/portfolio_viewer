import { NavLink } from 'react-router';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2.5">
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <NavLink 
            to="/"
            className={({ isActive }) => 
              `px-3 py-2 rounded-md ${isActive ? 'bg-gray-100' : 'hover:bg-gray-50'}`
            }
          >
            Home
          </NavLink>
          <NavLink 
            to="/dashboard"
            className={({ isActive }) => 
              `px-3 py-2 rounded-md ${isActive ? 'bg-gray-100' : 'hover:bg-gray-50'}`
            }
          >
            Dashboard
          </NavLink>
        </div>
      </div>
    </nav>
  );
} 
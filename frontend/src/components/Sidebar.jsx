import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, UserCircle, Tag, MessageSquare, Bot, Users, Star, LogOut } from 'lucide-react';

const navItems = [
  { name: 'Analytics', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
  { name: 'Customers', path: '/dashboard/customers', icon: <Users size={20} /> },
  { name: 'Reviews', path: '/dashboard/reviews', icon: <Star size={20} /> },
  { name: 'Face Auth', path: '/dashboard/face-auth', icon: <UserCircle size={20} /> },
  { name: 'Products', path: '/dashboard/products', icon: <Tag size={20} /> },
  { name: 'Sentiment', path: '/dashboard/sentiment', icon: <MessageSquare size={20} /> },
  { name: 'Chatbot', path: '/dashboard/chatbot', icon: <Bot size={20} /> },
];

const Sidebar = () => {
const navigate = useNavigate();

const handleLogout = () => {
  // Remove stored login data
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  // Redirect to login page
  navigate("/", { replace: true });
};
  return (
    <div className="w-64 glass-panel h-[calc(100vh-32px)] m-4 flex flex-col justify-between sticky top-4">
      <div>
        <div className="p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            SmartRetail AI
          </h2>
        </div>
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/dashboard'}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-primary/20 text-primary border border-primary/30 shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t border-white/10">
        <button
  onClick={handleLogout}
  className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-400/10 w-full transition-all"
>
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

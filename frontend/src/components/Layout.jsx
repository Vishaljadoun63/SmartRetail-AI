import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Bell, Search } from 'lucide-react';

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-background relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent/10 blur-[120px] pointer-events-none"></div>

      <Sidebar />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden z-10 relative">
        {/* Navbar */}
        <header className="h-20 glass-panel m-4 flex items-center justify-between px-6 z-20">
          <div className="relative w-64">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
             <input type="text" placeholder="Search anything..." className="input-field pl-10 bg-black/20" />
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-300">
              <Bell size={20} />
            </button>
            <div className="flex items-center space-x-3 border-l border-white/10 pl-4">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-sm font-bold">
                AD
              </div>
              <div className="text-sm">
                <p className="font-medium">Admin User</p>
                <p className="text-xs text-gray-400">Store Manager</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 px-4 pb-4 min-h-0 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

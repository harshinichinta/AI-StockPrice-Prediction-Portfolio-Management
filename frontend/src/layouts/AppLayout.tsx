import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/common/Sidebar';
import { Navbar } from '../components/common/Navbar';
import { BackgroundGlow } from '../components/common/BackgroundGlow';

export const AppLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex relative overflow-x-hidden font-sans">
      <BackgroundGlow />
      
      {/* Collapsible Glass Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content Viewport */}
      <div className={`flex-1 flex flex-col transition-all duration-300 relative z-10 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <Navbar onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
        
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>

        <footer className="py-6 px-8 border-t border-slate-800/80 text-center text-xs text-slate-400 font-mono">
          <p>StockMind AI © 2026 • B.Tech Major Project • Powered strictly by LSTM Deep Learning</p>
        </footer>
      </div>
    </div>
  );
};

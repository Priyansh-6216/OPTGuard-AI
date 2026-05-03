import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, LayoutDashboard, Calendar, FileText, Briefcase, MessageSquare, Settings } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/timeline', icon: Calendar, label: 'Timeline' },
    { path: '/documents', icon: FileText, label: 'Documents' },
    { path: '/employers', icon: Briefcase, label: 'Employers' },
    { path: '/ai-assistant', icon: MessageSquare, label: 'AI Assistant' },
  ];

  return (
    <nav className="fixed left-0 top-0 h-screen w-64 glass border-r border-black/5 p-8 flex flex-col z-50">
      <div className="flex items-center gap-4 mb-12 px-2">
        <div className="p-2.5 bg-primary rounded-xl shadow-lg shadow-black/10 animate-float">
          <Shield className="w-7 h-7 text-white" />
        </div>
        <span className="text-xl font-black tracking-tighter text-text-main">OPTGuard AI</span>
      </div>

      <div className="flex-1 space-y-3">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-500 group ${
                isActive 
                  ? 'bg-black text-white shadow-xl shadow-black/10' 
                  : 'text-text-muted hover:bg-black/5 hover:text-text-main'
              }`}
            >
              <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-white' : 'text-text-muted group-hover:text-primary'}`} />
              <span className={`font-bold tracking-tight ${isActive ? 'text-white' : ''}`}>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="pt-8 border-t border-black/5 space-y-6">
        <Link
          to="/settings"
          className="flex items-center gap-4 px-5 py-4 rounded-2xl text-text-muted hover:bg-black/5 hover:text-text-main transition-all font-bold tracking-tight"
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </Link>
        
        <div className="p-5 rounded-[2rem] glass-light border border-black/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent mb-2 relative z-10">Titanium Plan</p>
          <p className="text-sm text-text-main font-bold mb-4 relative z-10 leading-tight">Advanced Auditing Active</p>
          <button className="w-full py-3 px-4 bg-white/50 hover:bg-white text-text-main text-xs font-black uppercase tracking-widest rounded-xl transition-all relative z-10 border border-black/5 shadow-sm">
            Manage
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

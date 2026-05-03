import React from 'react';
import { User, Bell, Shield, CreditCard, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sections = [
    {
      title: 'Account',
      icon: User,
      items: [
        { label: 'Profile Information', desc: user?.email },
        { label: 'Password', desc: 'Last changed 2 months ago' },
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        { label: 'Email Alerts', desc: 'Enabled' },
        { label: 'SMS Reminders', desc: 'Pro feature', premium: true },
      ]
    },
    {
      title: 'Security',
      icon: Shield,
      items: [
        { label: 'Two-Factor Authentication', desc: 'Disabled' },
        { label: 'Login History', desc: 'View recent activity' },
      ]
    }
  ];

  return (
    <div className="max-w-4xl space-y-10 animate-in fade-in duration-700">
      <header>
        <h1 className="text-4xl font-bold gradient-text">Settings</h1>
        <p className="text-secondary mt-2">Manage your account preferences and security.</p>
      </header>

      <div className="space-y-8">
        {sections.map((section, i) => (
          <div key={i} className="space-y-4">
            <div className="flex items-center gap-3 px-2">
              <section.icon className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">{section.title}</h2>
            </div>
            <div className="glass rounded-[2rem] overflow-hidden">
              {section.items.map((item, j) => (
                <button 
                  key={j}
                  className="w-full flex items-center justify-between p-6 hover:bg-white/[0.03] transition-all border-b border-white/5 last:border-0 group text-left"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-white">{item.label}</p>
                      {item.premium && (
                        <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                          Pro
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-secondary mt-0.5">{item.desc}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-secondary group-hover:text-white group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="pt-10">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-bold transition-all w-full md:w-auto"
          >
            <LogOut className="w-5 h-5" />
            Sign Out of OPTGuard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;

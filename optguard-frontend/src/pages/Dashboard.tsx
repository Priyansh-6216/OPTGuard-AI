import React, { useEffect, useState } from 'react';
import { TrendingUp, AlertCircle, Calendar, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { format, differenceInDays } from 'date-fns';

interface Deadline {
  id: number;
  title: string;
  deadlineType: string;
  deadlineDate: string;
  status: string;
  riskLevel: string;
  description: string;
}

interface Profile {
  fullName: string;
  aiExplanation: string;
}

const Dashboard = () => {
  const { token } = useAuth();
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deadlinesRes, profileRes] = await Promise.all([
          axios.get('http://localhost:8080/api/deadlines', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:8080/api/profile', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setDeadlines(deadlinesRes.data);
        setProfile(profileRes.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-black/5 border-t-primary rounded-full animate-spin" />
      <p className="text-text-muted font-black tracking-widest uppercase text-[10px]">Initializing Intelligence Hub...</p>
    </div>
  );

  const nextDeadline = deadlines.find(d => d.status === 'PENDING');
  
  const stats = [
    { 
      label: 'Next Milestone', 
      value: nextDeadline ? format(new Date(nextDeadline.deadlineDate), 'MMM d, yyyy') : 'Optimal', 
      icon: Calendar, 
      color: 'text-accent',
      bg: 'bg-accent/5'
    },
    { 
      label: 'Open Tasks', 
      value: `${deadlines.filter(d => d.status === 'PENDING').length} Pending`, 
      icon: AlertCircle, 
      color: 'text-warning',
      bg: 'bg-warning/5'
    },
    { 
      label: 'Security Status', 
      value: profile ? 'Verified' : 'Incomplete', 
      icon: CheckCircle2, 
      color: 'text-success',
      bg: 'bg-success/5'
    },
    { 
      label: 'Compliance Risk', 
      value: nextDeadline?.riskLevel || 'Nominal', 
      icon: TrendingUp, 
      color: nextDeadline?.riskLevel === 'RED' ? 'text-danger' : 'text-accent',
      bg: nextDeadline?.riskLevel === 'RED' ? 'bg-danger/5' : 'bg-accent/5'
    },
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-black tracking-tighter text-text-main">
            Status: <span className="gradient-text">Operational</span>
          </h1>
          <p className="text-text-muted text-xl font-medium">Welcome back, {profile?.fullName?.split(' ')[0] || 'Student'}.</p>
        </div>
        <div className="glass px-6 py-3 rounded-2xl flex items-center gap-3 border-black/5 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs font-black uppercase tracking-widest text-success">Active Compliance Guard</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat) => (
          <div key={stat.label} className="p-8 rounded-[2.5rem] glass hover:bg-black/[0.01] transition-all duration-500 group relative overflow-hidden">
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-500`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <p className="text-[10px] text-text-muted font-black uppercase tracking-[0.2em] relative z-10">{stat.label}</p>
            <p className="text-3xl font-black mt-2 tracking-tight text-text-main relative z-10">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-10 rounded-[3rem] glass relative overflow-hidden group border-black/5">
          <div className="flex items-center justify-between mb-10 relative z-10">
            <h3 className="text-3xl font-black tracking-tight text-text-main">Compliance Log</h3>
            <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-accent transition-colors">Audit Full History</button>
          </div>
          <div className="space-y-4 relative z-10">
            {deadlines.length > 0 ? (
              deadlines.slice(0, 5).map((deadline) => (
                <div key={deadline.id} className="flex items-center justify-between p-6 rounded-[2rem] glass-light border border-black/5 hover:border-primary/10 hover:bg-black/[0.01] transition-all group/item">
                  <div className="flex items-center gap-6">
                    <div className={`w-3 h-3 rounded-full ${
                      deadline.riskLevel === 'RED' ? 'bg-danger' :
                      deadline.riskLevel === 'YELLOW' ? 'bg-warning' :
                      'bg-success'
                    } shadow-[0_0_10px_currentColor]`} />
                    <div>
                      <p className="text-lg font-bold text-text-main tracking-tight group-hover/item:text-primary transition-colors">{deadline.title}</p>
                      <p className="text-sm text-text-muted font-medium">{format(new Date(deadline.deadlineDate), 'MMMM d, yyyy')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                      deadline.riskLevel === 'RED' ? 'border-danger/20 text-danger bg-danger/5' :
                      deadline.riskLevel === 'YELLOW' ? 'border-warning/20 text-warning bg-warning/5' :
                      'border-success/20 text-success bg-success/5'
                    }`}>
                      {deadline.riskLevel}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 space-y-4">
                <div className="p-4 bg-black/5 rounded-full w-fit mx-auto">
                  <AlertCircle className="w-8 h-8 text-text-muted" />
                </div>
                <p className="text-text-muted font-medium italic">Synchronize profile to initialize logs.</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-10 rounded-[3rem] glass bg-gradient-to-br from-accent/[0.03] via-transparent to-transparent border-black/5 flex flex-col justify-between group">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-black/5 rounded-2xl text-primary group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black tracking-tight text-text-main">AI Insights</h3>
            </div>
            <div className="p-6 rounded-[2rem] glass-light border border-black/5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
              <p className="text-lg leading-relaxed text-text-main font-medium italic">
                "{profile?.aiExplanation || "Initialize your academic profile to receive precision-guided compliance insights."}"
              </p>
            </div>
          </div>
          <button className="btn-primary w-full mt-10 py-5 text-sm uppercase tracking-[0.2em] shadow-xl shadow-black/10">
            Consult AI Advisor
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { Calendar, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

interface Deadline {
  id: number;
  title: string;
  deadlineDate: string;
  status: string;
  riskLevel: string;
  description: string;
  deadlineType: string;
}

const Timeline = () => {
  const { token } = useAuth();
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeadlines = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/deadlines', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDeadlines(response.data);
      } catch (error) {
        console.error('Failed to fetch deadlines', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDeadlines();
  }, [token]);

  if (loading) return <div className="text-secondary text-center py-20">Loading timeline...</div>;

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header className="max-w-3xl">
        <h1 className="text-4xl font-bold mb-4 gradient-text">Your OPT Journey</h1>
        <p className="text-secondary text-lg">
          A visual roadmap of your immigration compliance milestones. Track your filing windows and reporting requirements.
        </p>
      </header>

      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-white/10 to-transparent" />

        <div className="space-y-12">
          {deadlines.map((deadline, index) => {
            const isCompleted = deadline.status === 'COMPLETED';
            const isOverdue = new Date(deadline.deadlineDate) < new Date() && !isCompleted;
            
            return (
              <div key={deadline.id} className="relative pl-24 group">
                {/* Timeline Node */}
                <div className={`absolute left-0 top-0 w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 z-10 ${
                  isCompleted ? 'bg-green-500/20 text-green-400 border border-green-500/20' :
                  isOverdue ? 'bg-red-500/20 text-red-400 border border-red-500/20' :
                  'bg-white/5 text-primary border border-white/10 group-hover:border-primary/50'
                }`}>
                  {isCompleted ? <CheckCircle2 className="w-8 h-8" /> : 
                   isOverdue ? <AlertCircle className="w-8 h-8" /> : 
                   <Clock className="w-8 h-8" />}
                </div>

                {/* Content Card */}
                <div className="glass p-8 rounded-[2rem] hover:bg-white/[0.05] transition-all duration-500 relative overflow-hidden">
                  {/* Status Indicator */}
                  <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full blur-3xl opacity-20 ${
                    deadline.riskLevel === 'RED' ? 'bg-red-500' :
                    deadline.riskLevel === 'YELLOW' ? 'bg-yellow-500' :
                    'bg-primary'
                  }`} />

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-white/5 border border-white/5 mb-2 inline-block ${
                        deadline.deadlineType === 'FILING' ? 'text-blue-400' :
                        deadline.deadlineType === 'VALIDATION' ? 'text-purple-400' :
                        'text-orange-400'
                      }`}>
                        {deadline.deadlineType}
                      </span>
                      <h3 className="text-2xl font-bold text-white">{deadline.title}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-white">{format(new Date(deadline.deadlineDate), 'MMMM d, yyyy')}</p>
                      <p className="text-sm text-secondary">
                        {isOverdue ? 'Action Required Immediately' : 'Scheduled Deadline'}
                      </p>
                    </div>
                  </div>

                  <p className="text-secondary leading-relaxed max-w-2xl">
                    {deadline.description}
                  </p>

                  <div className="mt-6 pt-6 border-t border-white/5 flex gap-4">
                    <button className="px-6 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium transition-all">
                      View Checklist
                    </button>
                    {!isCompleted && (
                      <button className="px-6 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary text-sm font-medium transition-all">
                        Mark as Done
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Timeline;

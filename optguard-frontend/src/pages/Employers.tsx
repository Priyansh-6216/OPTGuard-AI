import React, { useEffect, useState } from 'react';
import { Briefcase, Plus, Calendar, MapPin, ExternalLink, Trash2, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

interface Employer {
  id: number;
  employerName: string;
  jobTitle: string;
  startDate: string;
  endDate: string | null;
  everifyNumber: string;
  isCurrent: boolean;
}

const Employers = () => {
  const { token } = useAuth();
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [stats, setStats] = useState({ used: 0, remaining: 90 });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newEmployer, setNewEmployer] = useState({
    employerName: '',
    jobTitle: '',
    startDate: '',
    endDate: '',
    everifyNumber: '',
    isCurrent: true
  });

  const fetchData = async () => {
    try {
      const [empRes, statsRes] = await Promise.all([
        axios.get('http://localhost:8080/api/employers', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:8080/api/employers/unemployment', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setEmployers(empRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Failed to fetch employer data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleAddEmployer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/employers', newEmployer, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowModal(false);
      setNewEmployer({
        employerName: '',
        jobTitle: '',
        startDate: '',
        endDate: '',
        everifyNumber: '',
        isCurrent: true
      });
      fetchData();
    } catch (error) {
      console.error('Failed to add employer', error);
    }
  };

  const handleDeleteEmployer = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      // Assuming a delete endpoint exists or adding it now
      await axios.delete(`http://localhost:8080/api/employers/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      console.error('Failed to delete employer', error);
    }
  };

  if (loading) return <div className="text-secondary text-center py-20">Loading employment history...</div>;

  const usedPercentage = (stats.used / 90) * 100;

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold mb-4 gradient-text">Work Experience</h1>
          <p className="text-secondary text-lg">
            Keep your employment records accurate for OPT/STEM OPT reporting compliance.
          </p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-lg shadow-primary/20"
        >
          <Plus className="w-5 h-5" /> Add Employer
        </button>
      </header>

      {/* Unemployment Tracker */}
      <div className="glass p-8 rounded-[2rem] bg-gradient-to-br from-white/[0.02] to-transparent">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold mb-1">Unemployment Counter</h3>
            <p className="text-secondary text-sm">Days used since EAD start date</p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold text-white">{stats.used}</span>
            <span className="text-secondary text-xl font-medium"> / 90 Days</span>
          </div>
        </div>

        <div className="h-4 bg-white/5 rounded-full overflow-hidden mb-4 p-1 border border-white/5">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ${
              usedPercentage > 80 ? 'bg-red-500' :
              usedPercentage > 50 ? 'bg-yellow-500' :
              'bg-primary'
            }`}
            style={{ width: `${Math.min(usedPercentage, 100)}%` }}
          />
        </div>

        <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5">
          <AlertCircle className={`w-5 h-5 ${usedPercentage > 80 ? 'text-red-400' : 'text-blue-400'}`} />
          <p className="text-sm text-secondary">
            {stats.remaining > 15 
              ? `You have ${stats.remaining} days of unemployment left. Stay safe!` 
              : `Warning: Only ${stats.remaining} days remaining. Report new employment immediately.`}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-bold px-2">Employment History</h3>
        <div className="grid grid-cols-1 gap-4">
          {employers.length > 0 ? (
            employers.map((emp) => (
              <div key={emp.id} className="glass p-6 rounded-3xl hover:bg-white/[0.05] transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6 border border-white/5">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Briefcase className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="text-xl font-bold text-white">{emp.employerName}</h4>
                      {emp.isCurrent && (
                        <span className="px-2 py-0.5 rounded-md bg-green-500/10 text-green-400 text-[10px] font-bold uppercase tracking-widest border border-green-500/20">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-secondary font-medium">{emp.jobTitle}</p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-secondary">
                      <Calendar className="w-4 h-4" />
                      <span>{format(new Date(emp.startDate), 'MMM d, yyyy')} — {emp.endDate ? format(new Date(emp.endDate), 'MMM d, yyyy') : 'Present'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-secondary">
                      <MapPin className="w-4 h-4" />
                      <span>E-Verify: {emp.everifyNumber || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <button className="flex-1 md:flex-none p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
                      <ExternalLink className="w-5 h-5 text-secondary" />
                    </button>
                    <button 
                      onClick={() => handleDeleteEmployer(emp.id)}
                      className="flex-1 md:flex-none p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center glass rounded-3xl border border-dashed border-white/10">
              <Briefcase className="w-12 h-12 text-secondary/30 mx-auto mb-4" />
              <p className="text-secondary italic">No employment records found. Add your current employer to track unemployment days.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Employer Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-background/80 backdrop-blur-sm">
          <div className="glass w-full max-w-lg p-8 rounded-[2rem] animate-in zoom-in duration-300">
            <h3 className="text-2xl font-bold mb-6">Add New Employer</h3>
            <form onSubmit={handleAddEmployer} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-secondary">Employer Name</label>
                <input
                  type="text"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={newEmployer.employerName}
                  onChange={(e) => setNewEmployer({ ...newEmployer, employerName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-secondary">Job Title</label>
                <input
                  type="text"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={newEmployer.jobTitle}
                  onChange={(e) => setNewEmployer({ ...newEmployer, jobTitle: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary">Start Date</label>
                  <input
                    type="date"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={newEmployer.startDate}
                    onChange={(e) => setNewEmployer({ ...newEmployer, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary">End Date (Optional)</label>
                  <input
                    type="date"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={newEmployer.endDate}
                    onChange={(e) => setNewEmployer({ ...newEmployer, endDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-secondary">E-Verify Number (Optional)</label>
                <input
                  type="text"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={newEmployer.everifyNumber}
                  onChange={(e) => setNewEmployer({ ...newEmployer, everifyNumber: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-3 py-2">
                <input
                  type="checkbox"
                  id="isCurrent"
                  className="w-5 h-5 rounded border-white/10 bg-white/5 text-primary focus:ring-primary"
                  checked={newEmployer.isCurrent}
                  onChange={(e) => setNewEmployer({ ...newEmployer, isCurrent: e.target.checked })}
                />
                <label htmlFor="isCurrent" className="text-sm font-medium text-secondary">Currently working here</label>
              </div>
              <div className="flex gap-4 mt-8">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-xl hover:bg-white/5 text-secondary transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-blue-600 transition-all shadow-lg shadow-primary/20"
                >
                  Save Employer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employers;

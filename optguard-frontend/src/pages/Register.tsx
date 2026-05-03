import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, UserPlus, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/api/auth/register', { email, password });
      login(response.data.token, response.data.email, response.data.role);
      navigate('/onboarding');
    } catch (error) {
      console.error('Registration failed', error);
      alert('Registration failed. Email might already be in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mesh-gradient flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-lg">
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="p-3 bg-primary rounded-[1.25rem] shadow-2xl shadow-black/10 animate-float">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-text-main">OPTGuard AI</h1>
        </div>

        <div className="glass p-12 rounded-[3.5rem] space-y-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
          
          <div className="text-center space-y-3">
            <h2 className="text-4xl font-black tracking-tight text-text-main">Join the Elite</h2>
            <p className="text-text-muted text-lg font-medium">Protect your status with the gold standard.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <label className="text-xs font-black text-text-muted uppercase tracking-[0.2em] ml-2">Email Identity</label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/5 border border-black/5 rounded-2xl px-14 py-5 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-lg placeholder:text-black/20"
                  placeholder="name@university.edu"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-text-muted uppercase tracking-[0.2em] ml-2">Security Key</label>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/5 border border-black/5 rounded-2xl px-14 py-5 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-lg placeholder:text-black/20"
                  placeholder="Minimum 8 characters"
                  required
                  minLength={8}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-6 text-xl flex items-center justify-center gap-3 group disabled:opacity-50"
            >
              {loading ? 'Initializing...' : 'Create Account'}
              <UserPlus className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
          </form>

          <div className="text-center pt-4">
            <p className="text-text-muted font-medium">
              Already verified?{' '}
              <Link to="/login" className="text-accent font-black hover:text-primary transition-colors underline-offset-4 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

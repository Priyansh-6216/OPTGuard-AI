import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, CheckCircle2, Zap, BarChart3, Globe, MessageSquare, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Landing = () => {
  return (
    <div className="min-h-screen mesh-gradient text-text-main selection:bg-accent/30 overflow-x-hidden font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-black/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary rounded-xl shadow-lg shadow-black/10">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-text-main">
              OPTGuard AI
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-text-muted">
            <a href="#features" className="hover:text-primary hover:scale-105 transition-all">Features</a>
            <a href="#compliance" className="hover:text-primary hover:scale-105 transition-all">Compliance</a>
            <a href="#ai" className="hover:text-primary hover:scale-105 transition-all">AI Assistant</a>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-sm font-bold text-text-muted hover:text-primary transition-colors">Sign In</Link>
            <Link to="/register" className="btn-primary flex items-center gap-2">
              Get Started
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-6">
        <div className="max-w-6xl mx-auto text-center space-y-12 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass border border-black/5 mb-6"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-accent">Precision Compliance Engine</span>
          </motion.div>
          
          <div className="space-y-6">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.9] text-text-main"
            >
              PROTECT YOUR <br />
              <span className="gradient-text">OPT STATUS</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl md:text-2xl text-text-muted max-w-3xl mx-auto leading-relaxed font-medium"
            >
              The elite AI companion for international students. <br className="hidden md:block" />
              Automated reporting, deadline tracking, and status protection.
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col md:flex-row items-center justify-center gap-6"
          >
            <Link to="/register" className="btn-primary text-lg scale-110">
              Start Free Trial
            </Link>
            <a href="#features" className="px-10 py-4 glass-light rounded-2xl font-bold border border-black/5 hover:bg-black/5 transition-all text-lg">
              View Demo
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1, ease: "circOut" }}
            className="pt-24 relative"
          >
            <div className="absolute inset-0 bg-accent/5 blur-[150px] -z-10 rounded-full" />
            <div className="glass p-3 rounded-[3.5rem] shadow-2xl animate-float">
              <div className="bg-white rounded-[3rem] overflow-hidden border border-black/5">
                <img 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426" 
                  alt="Dashboard Preview" 
                  className="w-full opacity-95 hover:opacity-100 transition-opacity duration-700"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-40 px-6 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24 space-y-4">
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-text-main">Elite Compliance</h2>
            <p className="text-text-muted text-xl max-w-2xl mx-auto font-medium">
              Every feature engineered to defend your legal standing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Smart Deadline Engine', desc: 'Precision calculation of 90-day filing windows and EAD timelines.', icon: BarChart3, color: 'from-emerald-500/10 to-teal-500/10' },
              { title: 'AI Legal Assistant', desc: 'Expert guidance on complex OPT/STEM extension regulations.', icon: MessageSquare, color: 'from-amber-500/10 to-orange-500/10' },
              { title: 'Unemployment Audit', desc: 'Visual monitoring of your status clock with proactive alerts.', icon: Zap, color: 'from-red-500/10 to-rose-500/10' },
              { title: 'Document Vault', desc: 'Encrypted repository for I-20s, EADs, and I-983 plans.', icon: CheckCircle2, color: 'from-emerald-500/10 to-green-500/10' },
              { title: 'Global Validation', desc: 'Automated 6, 12, 18, and 24-month reporting workflows.', icon: Globe, color: 'from-slate-500/10 to-gray-500/10' },
              { title: 'Auto-Notify', desc: 'Direct alerts for upcoming compliance milestones and windows.', icon: Shield, color: 'from-black/5 to-black/10' },
            ].map((f, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -10 }}
                className="glass p-10 rounded-[2.5rem] hover:bg-black/[0.02] transition-all group relative overflow-hidden"
              >
                <div className="p-5 bg-black/5 rounded-2xl w-fit mb-8 group-hover:bg-primary group-hover:text-white transition-all">
                  <f.icon className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-2xl font-bold mb-4 tracking-tight text-text-main">{f.title}</h3>
                <p className="text-text-muted leading-relaxed font-medium">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-32 px-6 border-t border-black/5 glass">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold text-text-main">OPTGuard AI</span>
            </div>
            <p className="text-text-muted max-w-xs font-medium">
              The gold standard in compliance for the international community.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-12">
            <div className="flex flex-col gap-4">
              <span className="font-bold uppercase tracking-widest text-xs text-text-muted">Product</span>
              <a href="#" className="text-sm font-bold hover:text-primary transition-colors">Features</a>
              <a href="#" className="text-sm font-bold hover:text-primary transition-colors">Pricing</a>
            </div>
            <div className="flex flex-col gap-4">
              <span className="font-bold uppercase tracking-widest text-xs text-text-muted">Legal</span>
              <a href="#" className="text-sm font-bold hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="text-sm font-bold hover:text-primary transition-colors">Terms</a>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-4">
            <div className="p-4 glass rounded-2xl">
              <span className="text-xs font-bold text-text-muted">© 2026 OPTGuard AI. Educational guidance only.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

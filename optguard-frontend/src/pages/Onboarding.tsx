import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, ChevronRight, ChevronLeft, Calendar, 
  GraduationCap, School, FileCheck, Info, 
  CheckCircle2, Clock, Globe, Briefcase
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const { token } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    universityName: '',
    degreeLevel: '',
    sevisId: '',
    programStartDate: '',
    programEndDate: '',
    optType: 'Post-completion OPT',
    optI20IssueDate: '',
    requestedOptStartDate: '',
    eadStartDate: '',
    eadEndDate: '',
    stemOptStartDate: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:8080/api/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Onboarding failed', error);
    }
  };

  const steps = [
    { id: 1, title: 'Profile Setup', icon: GraduationCap },
    { id: 2, title: 'Compliance Timeline', icon: Clock },
    { id: 3, title: 'Final Review', icon: FileCheck },
  ];

  return (
    <div className="min-h-screen mesh-gradient text-text-main flex flex-col md:flex-row overflow-hidden font-sans">
      {/* Left Sidebar - Journey Roadmap */}
      <div className="w-full md:w-[450px] glass border-r border-black/5 p-16 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-accent/5 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2" />
        
        <div className="space-y-16 relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-primary rounded-2xl shadow-2xl shadow-black/10 animate-float">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-text-main">OPTGuard AI</h1>
          </div>

          <div className="space-y-8">
            <h2 className="text-5xl font-black leading-[1.1] tracking-tight text-text-main">
              SECURE YOUR <br />
              <span className="gradient-text">COMPLIANCE</span>
            </h2>
            <p className="text-text-muted text-xl font-medium leading-relaxed">
              Precision engineering for your F1 status. We'll build your compliance engine in seconds.
            </p>
          </div>

          <div className="space-y-10 pt-8">
            {steps.map((s) => (
              <div key={s.id} className="flex items-center gap-6 group">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border-2 ${
                  step === s.id ? 'bg-primary border-primary shadow-xl shadow-black/10' : 
                  step > s.id ? 'bg-success border-success' : 'border-black/10 glass text-text-muted'
                }`}>
                  {step > s.id ? <CheckCircle2 className="w-6 h-6 text-white" /> : <s.icon className={`w-6 h-6 ${step === s.id ? 'text-white' : ''}`} />}
                </div>
                <div className="flex flex-col">
                  <span className={`text-xs font-black uppercase tracking-[0.2em] ${step === s.id ? 'text-accent' : 'text-text-muted'}`}>
                    Phase 0{s.id}
                  </span>
                  <span className={`text-lg font-bold ${step === s.id ? 'text-text-main' : 'text-text-muted'}`}>
                    {s.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 rounded-[2rem] glass-light border border-black/5 flex items-start gap-5 relative z-10">
          <div className="p-2 bg-accent/10 rounded-lg">
            <Info className="w-5 h-5 text-accent shrink-0" />
          </div>
          <p className="text-xs text-text-muted font-medium leading-relaxed">
            Encryption Standard: AES-256. Your immigration data is protected by elite security protocols.
          </p>
        </div>
      </div>

      {/* Main Form Area */}
      <div className="flex-1 overflow-y-auto p-8 md:p-24 relative">
        <div className="max-w-4xl mx-auto w-full relative z-10">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.5, ease: "circOut" }}
                className="space-y-12"
              >
                <div className="space-y-4">
                  <h3 className="text-5xl font-black tracking-tight text-text-main">Academic Foundation</h3>
                  <p className="text-text-muted text-xl font-medium">Verify your credentials to initialize tracking.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {[
                    { label: 'Full Legal Name', name: 'fullName', icon: Globe, placeholder: 'As it appears on Passport' },
                    { label: 'University Name', name: 'universityName', icon: School, placeholder: 'e.g. Stanford University' },
                    { label: 'SEVIS Identification', name: 'sevisId', icon: Info, placeholder: 'N0012345678' },
                  ].map((field) => (
                    <div key={field.name} className="space-y-4">
                      <label className="text-xs font-black text-text-muted uppercase tracking-[0.2em] flex items-center gap-2">
                        <field.icon className="w-4 h-4 text-primary" /> {field.label}
                      </label>
                      <input
                        type="text"
                        name={field.name}
                        value={formData[field.name as keyof typeof formData]}
                        onChange={handleChange}
                        className="w-full bg-black/5 border border-black/5 rounded-2xl px-6 py-5 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-lg font-medium placeholder:text-black/20"
                        placeholder={field.placeholder}
                      />
                    </div>
                  ))}

                  <div className="space-y-4">
                    <label className="text-xs font-black text-text-muted uppercase tracking-[0.2em] flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-primary" /> Degree Level
                    </label>
                    <select
                      name="degreeLevel"
                      value={formData.degreeLevel}
                      onChange={handleChange}
                      className="w-full bg-black/5 border border-black/5 rounded-2xl px-6 py-5 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-lg font-medium appearance-none"
                    >
                      <option value="">Select Credential</option>
                      <option value="Bachelor's">Bachelor's Degree</option>
                      <option value="Master's">Master's Degree</option>
                      <option value="PhD">Doctoral (PhD)</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.5, ease: "circOut" }}
                className="space-y-16"
              >
                <div className="space-y-4">
                  <h3 className="text-5xl font-black tracking-tight text-text-main">Compliance Timeline</h3>
                  <p className="text-text-muted text-xl font-medium">Input critical dates to synchronize your audit clocks.</p>
                </div>

                <div className="grid grid-cols-1 gap-12">
                  <div className="glass p-10 rounded-[3rem] space-y-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-3xl rounded-full" />
                    <div className="flex items-center gap-5">
                      <div className="p-3 bg-black/5 rounded-2xl text-primary">
                        <School className="w-7 h-7" />
                      </div>
                      <h4 className="text-2xl font-bold tracking-tight text-text-main">Program Duration</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <label className="text-xs font-black text-text-muted uppercase tracking-widest">I-20 Start Date</label>
                        <input
                          type="date"
                          name="programStartDate"
                          value={formData.programStartDate}
                          onChange={handleChange}
                          className="w-full bg-black/5 border border-black/5 rounded-2xl px-6 py-5 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-xs font-black text-text-muted uppercase tracking-widest">Program Completion</label>
                        <input
                          type="date"
                          name="programEndDate"
                          value={formData.programEndDate}
                          onChange={handleChange}
                          className="w-full bg-black/5 border border-black/5 rounded-2xl px-6 py-5 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="glass p-10 rounded-[3rem] space-y-10 border-primary/10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-5">
                        <div className="p-3 bg-black/5 rounded-2xl text-accent">
                          <Shield className="w-7 h-7" />
                        </div>
                        <h4 className="text-2xl font-bold tracking-tight text-text-main">Authorization Profile</h4>
                      </div>
                      <select
                        name="optType"
                        value={formData.optType}
                        onChange={handleChange}
                        className="bg-primary rounded-xl px-6 py-3 text-white font-black text-xs uppercase tracking-widest focus:outline-none hover:bg-black transition-colors"
                      >
                        <option value="Post-completion OPT">Initial OPT</option>
                        <option value="STEM OPT">STEM Extension</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                      {[
                        { label: 'I-20 Issue Date', name: 'optI20IssueDate' },
                        { label: 'Requested Start', name: 'requestedOptStartDate' },
                        { label: 'EAD Start Date', name: 'eadStartDate' },
                      ].map((field) => (
                        <div key={field.name} className="space-y-4">
                          <label className="text-xs font-black text-text-muted uppercase tracking-widest">{field.label}</label>
                          <input
                            type="date"
                            name={field.name}
                            value={formData[field.name as keyof typeof formData]}
                            onChange={handleChange}
                            className="w-full bg-black/5 border border-black/5 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                      <div className="space-y-4">
                        <label className="text-xs font-black text-text-muted uppercase tracking-widest">EAD Expiration</label>
                        <input
                          type="date"
                          name="eadEndDate"
                          value={formData.eadEndDate}
                          onChange={handleChange}
                          className="w-full bg-black/5 border border-black/5 rounded-2xl px-6 py-5 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        />
                      </div>
                      {formData.optType === 'STEM OPT' && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="space-y-4"
                        >
                          <label className="text-xs font-black text-accent uppercase tracking-widest">STEM Extension Start</label>
                          <input
                            type="date"
                            name="stemOptStartDate"
                            value={formData.stemOptStartDate}
                            onChange={handleChange}
                            className="w-full bg-accent/5 border border-accent/20 rounded-2xl px-6 py-5 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all font-medium"
                          />
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-16 text-center"
              >
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-success/10 blur-3xl rounded-full" />
                  <div className="w-32 h-32 bg-success/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 border border-success/20 relative z-10 animate-float">
                    <FileCheck className="w-16 h-16 text-success" />
                  </div>
                </div>
                
                <div className="space-y-6">
                  <h3 className="text-6xl font-black tracking-tight text-text-main">READY TO DEPLOY</h3>
                  <p className="text-text-muted text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                    Initializing your 24/7 status protection engine.
                  </p>
                </div>

                <div className="glass p-12 rounded-[3.5rem] max-w-xl mx-auto text-left space-y-6 relative overflow-hidden shadow-xl">
                  <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
                  {[
                    { label: 'Candidate', value: formData.fullName },
                    { label: 'Academic Level', value: formData.degreeLevel },
                    { label: 'Program End', value: formData.programEndDate },
                    { label: 'Auth Profile', value: formData.optType, highlight: true },
                  ].map((row, i) => (
                    <div key={i} className="flex justify-between items-center py-4 border-b border-black/5 last:border-0">
                      <span className="text-xs font-black uppercase tracking-[0.2em] text-text-muted">{row.label}</span>
                      <span className={`text-lg font-bold ${row.highlight ? 'text-primary' : 'text-text-main'}`}>{row.value || '---'}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="mt-24 flex items-center justify-between border-t border-black/10 pt-16">
            {step > 1 && (
              <button
                onClick={prevStep}
                className="flex items-center gap-4 px-10 py-5 rounded-[1.5rem] glass hover:bg-black/5 transition-all font-black text-xs uppercase tracking-[0.2em] text-text-muted"
              >
                <ChevronLeft className="w-5 h-5" />
                Return
              </button>
            )}
            <div className="flex-1" />
            {step < 3 ? (
              <button
                onClick={nextStep}
                className="btn-primary text-lg flex items-center gap-4 px-14 py-6"
              >
                CONTINUE
                <ChevronRight className="w-6 h-6" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="relative overflow-hidden px-16 py-7 bg-primary text-white rounded-[2rem] font-black text-xl hover:bg-black transition-all shadow-2xl shadow-black/20 hover:scale-105 flex items-center gap-4"
              >
                INITIALIZE WORKSPACE
                <CheckCircle2 className="w-7 h-7" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;

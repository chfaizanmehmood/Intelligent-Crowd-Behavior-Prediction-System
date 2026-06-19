import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (username: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('admin@icbps.local');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter your credentials.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(username.trim());
    }, 850);
  };

  return (
    <div className="min-h-screen flex bg-[#0f1623] text-white">

      {/* ── Left Panel ── */}
      <div className="hidden md:flex flex-col justify-between w-1/2 px-12 py-10 bg-[#0f1623]">
        
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span className="text-white font-bold text-lg tracking-wide">ICBPS</span>
          <span className="ml-2 text-[10px] font-semibold tracking-widest uppercase bg-blue-900/60 text-blue-300 border border-blue-700/50 px-2 py-0.5 rounded">
            Secure Monitoring Portal
          </span>
        </div>

        {/* Main heading */}
        <div className="space-y-5">
          <h1 className="text-4xl font-bold text-white leading-tight">
            Intelligent Crowd<br />Behavior Prediction
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
            Real-time crowd density analysis, behavioral pattern recognition,
            and automated safety alerts powered by advanced AI models.
          </p>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-[#1a2235] border border-slate-700/50 rounded-xl p-4">
              <div className="text-3xl font-bold text-blue-400">12,847</div>
              <div className="text-slate-400 text-xs mt-1">Videos Analyzed</div>
            </div>
            <div className="bg-[#1a2235] border border-slate-700/50 rounded-xl p-4">
              <div className="text-3xl font-bold text-blue-400">3,291</div>
              <div className="text-slate-400 text-xs mt-1">Alerts Generated</div>
            </div>
            <div className="bg-[#1a2235] border border-slate-700/50 rounded-xl p-4">
              <div className="text-3xl font-bold text-blue-400">94.2%</div>
              <div className="text-slate-400 text-xs mt-1">Avg Accuracy</div>
            </div>
            <div className="bg-[#1a2235] border border-slate-700/50 rounded-xl p-4">
              <div className="text-3xl font-bold text-blue-400">99.8%</div>
              <div className="text-slate-400 text-xs mt-1">Uptime</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-slate-600 text-xs">
          © 2026 ICBPS Academic Prototype · v2.4.1
        </div>
      </div>

      {/* ── Right Panel (Sign In Form) ── */}
      <div className="flex flex-col justify-center w-full md:w-1/2 px-10 md:px-16 bg-[#111827]">
        <div className="max-w-sm w-full mx-auto space-y-8">

          <div>
            <h2 className="text-3xl font-semibold text-white">Sign in</h2>
            <p className="text-slate-400 text-sm mt-1">Enter your credentials to access the system</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Username */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                Username / Email
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#1c2537] border border-slate-600/60 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#1c2537] border border-slate-600/60 rounded-lg px-4 py-3 pr-11 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-400 text-xs bg-red-900/20 border border-red-800/40 px-3 py-2 rounded-lg">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold text-sm py-3 rounded-lg transition-colors cursor-pointer"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-slate-600 text-[11px]">
            Unauthorized access is prohibited · All activity is monitored
          </p>
        </div>
      </div>

    </div>
  );
};

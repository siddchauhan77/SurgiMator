
import React from 'react';
import { Activity, AlertCircle, Moon, Sun, ShieldCheck, Key, Zap } from 'lucide-react';

interface HeaderProps {
  isProMode: boolean;
  onToggleProMode: (enabled: boolean) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onGoHome: () => void;
  hasOwnKey: boolean;
  usageCount: number;
  maxUsage: number;
  onAddKey: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
    isProMode, onToggleProMode, theme, onToggleTheme, onGoHome, hasOwnKey, usageCount, maxUsage, onAddKey 
}) => {
  
  const handleToggle = () => {
    onToggleProMode(!isProMode);
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300 shadow-sm backdrop-blur-sm bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo / Home Button */}
          <button 
            onClick={onGoHome}
            className="flex items-center gap-3 group focus:outline-none"
            title="Return to Home Page"
          >
            <div className="bg-teal-600 dark:bg-teal-500 p-2 rounded-lg shadow-sm group-hover:bg-teal-700 transition-colors">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-xl font-bold text-slate-800 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors tracking-tight">
                SurgiMator
              </h1>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold tracking-widest uppercase">Medical Visualization AI</p>
            </div>
          </button>
          
          <div className="flex items-center gap-3 sm:gap-6">
            
            {/* Secure Session Indicator (Visible on Larger Screens) */}
            <div className="hidden lg:flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-800" title="Session data is local and encrypted in transit">
                <ShieldCheck size={14} />
                <span className="text-[10px] font-bold uppercase tracking-wide">HIPAA Secure Mode</span>
            </div>

            {/* Theme Toggle */}
            <button 
              onClick={onToggleTheme}
              className="p-2 text-slate-400 hover:text-teal-600 dark:text-slate-400 dark:hover:text-white transition-colors"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Usage Stats (If free) */}
            {!hasOwnKey && (
                <div className="hidden sm:flex items-center gap-1 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">
                    <Zap size={12} className={usageCount >= maxUsage ? "text-red-500" : "text-amber-500"} />
                    {usageCount}/{maxUsage} Uses
                </div>
            )}

            {/* Pro Controls */}
            {hasOwnKey ? (
                /* Pro Key Toggle Switch */
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 transition-colors">
                    <span className={`text-xs font-semibold transition-colors hidden sm:block ${isProMode ? 'text-teal-700 dark:text-teal-400' : 'text-slate-400 dark:text-slate-400'}`}>
                        {isProMode ? 'Pro Features' : 'Standard'}
                    </span>
                    <button
                        onClick={handleToggle}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 ${
                        isProMode ? 'bg-teal-600' : 'bg-slate-300 dark:bg-slate-600'
                        }`}
                        title={isProMode ? "Pro Key Active (Veo & Pro Models)" : "Using Standard Models. Toggle to enable Veo."}
                    >
                        <span className="sr-only">Toggle Pro Mode</span>
                        <span
                        className={`${
                            isProMode ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm`}
                        />
                    </button>
                </div>
            ) : (
                /* Add Key Button */
                <button
                    onClick={onAddKey}
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-full shadow hover:bg-slate-700 dark:hover:bg-slate-200 transition-colors"
                    title="Connect your Google Cloud API Key to unlock unlimited generations and Veo video."
                >
                    <Key size={12} />
                    Set API Key
                </button>
            )}

            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden md:flex text-slate-400 hover:text-teal-600 dark:text-slate-500 dark:hover:text-teal-400 transition-colors"
              title="Billing Info"
            >
              <AlertCircle size={20} />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

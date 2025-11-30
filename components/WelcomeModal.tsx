
import React from 'react';
import { Key, Video, Zap, Check, X } from 'lucide-react';

interface WelcomeModalProps {
  onConnectKey: () => void;
  onContinueFree: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ onConnectKey, onContinueFree }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-700 overflow-hidden transform transition-all scale-100 flex flex-col md:flex-row">
        
        {/* Left: Free Tier */}
        <div className="flex-1 p-6 md:p-8 bg-slate-50 dark:bg-slate-900/50 flex flex-col border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
                <div className="p-1.5 bg-slate-200 dark:bg-slate-800 rounded">
                    <Zap size={16} />
                </div>
                Free Tier
            </h3>
            <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <Check size={16} className="text-teal-500 mt-0.5 shrink-0" />
                    <span>Storyboards (Flash Lite)</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <Check size={16} className="text-teal-500 mt-0.5 shrink-0" />
                    <span>Audio Narration</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <Check size={16} className="text-teal-500 mt-0.5 shrink-0" />
                    <span>5 Free Generations</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-400 dark:text-slate-600">
                    <X size={16} className="mt-0.5 shrink-0" />
                    <span>Veo Video Animation</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-400 dark:text-slate-600">
                    <X size={16} className="mt-0.5 shrink-0" />
                    <span>High-Res (Pro) Images</span>
                </li>
            </ul>
            <button 
                onClick={onContinueFree}
                className="w-full py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold rounded-lg text-sm transition-colors"
            >
                Continue with Free
            </button>
        </div>

        {/* Right: Pro Tier */}
        <div className="flex-1 p-6 md:p-8 bg-white dark:bg-slate-900 flex flex-col relative overflow-hidden">
             {/* Glow Effect */}
             <div className="absolute top-0 right-0 p-24 bg-teal-500/5 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none"></div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2 relative z-10">
                <div className="p-1.5 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded">
                    <Key size={16} />
                </div>
                Pro Features
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 relative z-10">
                Requires your own Google Cloud API Key (Billing Enabled).
            </p>
            <ul className="space-y-3 mb-8 flex-1 relative z-10">
                <li className="flex items-start gap-2 text-sm text-slate-800 dark:text-slate-200 font-medium">
                    <Check size={16} className="text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
                    <span>Unlimited Usage</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-800 dark:text-slate-200 font-medium">
                    <Check size={16} className="text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
                    <span className="flex items-center gap-2">
                        Veo 1080p Video <Video size={12} className="text-blue-500"/>
                    </span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-800 dark:text-slate-200 font-medium">
                    <Check size={16} className="text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
                    <span>Pro Image Models (16:9)</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-800 dark:text-slate-200 font-medium">
                    <Check size={16} className="text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
                    <span>Priority Processing</span>
                </li>
            </ul>
            <button 
                onClick={onConnectKey}
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg text-sm shadow-lg shadow-teal-900/10 transition-all transform hover:-translate-y-0.5 relative z-10"
            >
                Connect API Key
            </button>
        </div>

      </div>
    </div>
  );
};

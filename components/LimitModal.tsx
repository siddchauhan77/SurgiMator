
import React from 'react';
import { Lock, Zap, ArrowRight } from 'lucide-react';

interface LimitModalProps {
  onConnectKey: () => void;
  onClose: () => void; // Allow closing to view current results but block actions
}

export const LimitModal: React.FC<LimitModalProps> = ({ onConnectKey, onClose }) => {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-md w-full border border-slate-200 dark:border-slate-700 p-6 text-center">
        
        <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-500">
            <Lock size={32} />
        </div>

        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Free Limit Reached</h2>
        
        <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
            You've used all <strong>5 free generations</strong>. <br/>
            To continue generating unlimited storyboards and videos, please connect your own Gemini API key.
        </p>

        <div className="space-y-3">
            <button 
                onClick={onConnectKey}
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
                <Zap size={16} fill="currentColor" />
                Add API Key & Unlock
            </button>
            
            <button 
                onClick={onClose}
                className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
            >
                Close (View Only)
            </button>
        </div>
      </div>
    </div>
  );
};

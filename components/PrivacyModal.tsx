
import React from 'react';
import { ShieldAlert, CheckCircle2, Lock } from 'lucide-react';

interface PrivacyModalProps {
  onAccept: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ onAccept }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-lg w-full border border-gray-200 dark:border-slate-700 overflow-hidden transform transition-all scale-100">
        
        {/* Header */}
        <div className="bg-teal-700 p-6 flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-full">
            <ShieldAlert className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Compliance Notice</h2>
            <p className="text-teal-100 text-xs uppercase tracking-wider font-semibold">HIPAA & Data Privacy</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-gray-600 dark:text-slate-300 text-sm leading-relaxed">
            SurgiMator uses Artificial Intelligence to analyze text. To maintain compliance with 
            <strong> HIPAA (Health Insurance Portability and Accountability Act)</strong> and data privacy standards:
          </p>

          <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded-r-lg">
            <h3 className="flex items-center gap-2 text-amber-800 dark:text-amber-400 font-bold text-sm mb-1">
              <Lock size={14} />
              Strictly Prohibited
            </h3>
            <p className="text-amber-700 dark:text-amber-300 text-xs">
              Do <strong>NOT</strong> input Protected Health Information (PHI) such as patient names, 
              dates of birth, medical record numbers, or specific facility locations.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-xs text-gray-500 dark:text-slate-400">
                I verify that the text I am analyzing is for <strong>educational or schematic purposes only</strong>.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-xs text-gray-500 dark:text-slate-400">
                I understand that AI-generated outputs should be verified by a medical professional before use.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 bg-white dark:bg-slate-900">
          <button
            onClick={onAccept}
            className="w-full py-3 bg-slate-800 dark:bg-teal-600 hover:bg-slate-700 dark:hover:bg-teal-500 text-white rounded-lg font-bold text-sm transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
          >
            I Acknowledge & Agree
          </button>
        </div>
      </div>
    </div>
  );
};

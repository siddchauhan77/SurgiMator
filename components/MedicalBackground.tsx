import React from 'react';
import { Activity, Scissors, Stethoscope, Microscope, Syringe, HeartPulse } from 'lucide-react';

export const MedicalBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
       {/* Soft Gradient Blobs */}
       <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-teal-200/20 dark:bg-teal-900/10 rounded-full blur-[120px] opacity-40 mix-blend-multiply dark:mix-blend-screen"></div>
       <div className="absolute bottom-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-blue-200/20 dark:bg-blue-900/10 rounded-full blur-[120px] opacity-40 mix-blend-multiply dark:mix-blend-screen"></div>
       
       {/* Scattered Medical Icons */}
       <div className="absolute top-[15%] left-[5%] opacity-[0.03] dark:opacity-[0.05] text-teal-900 dark:text-teal-100 transform -rotate-12 transition-transform duration-[20s] ease-in-out hover:scale-105">
          <Activity size={300} strokeWidth={1} />
       </div>
       <div className="absolute bottom-[15%] right-[5%] opacity-[0.03] dark:opacity-[0.05] text-blue-900 dark:text-blue-100 transform rotate-45">
          <Scissors size={250} strokeWidth={1} />
       </div>
       <div className="absolute top-[40%] right-[15%] opacity-[0.02] dark:opacity-[0.04] text-indigo-900 dark:text-indigo-100 transform rotate-12">
          <Stethoscope size={200} strokeWidth={1} />
       </div>
       <div className="absolute bottom-[30%] left-[20%] opacity-[0.02] dark:opacity-[0.04] text-slate-900 dark:text-slate-100 transform -rotate-6">
          <Microscope size={180} strokeWidth={1} />
       </div>
       <div className="absolute top-[10%] left-[40%] opacity-[0.02] dark:opacity-[0.04] text-emerald-900 dark:text-emerald-100 transform rotate-12">
          <Syringe size={150} strokeWidth={1} />
       </div>
        <div className="absolute top-[60%] left-[50%] opacity-[0.015] dark:opacity-[0.03] text-rose-900 dark:text-rose-100 transform -rotate-45">
          <HeartPulse size={400} strokeWidth={0.5} />
       </div>
    </div>
  );
};

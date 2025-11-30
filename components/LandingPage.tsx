
import React from 'react';
import { Sparkles, Zap, Video, FileText, CheckCircle2, ArrowRight, PlayCircle, BrainCircuit, Volume2 } from 'lucide-react';
import { MedicalBackground } from './MedicalBackground';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-teal-500 selection:text-white relative overflow-hidden">
      <MedicalBackground />
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-teal-600 p-1.5 rounded-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">SurgiMator</span>
              <span className="px-1.5 py-0.5 rounded bg-teal-50 dark:bg-teal-900/30 text-[10px] font-bold text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">PRIVATE BETA</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-900/30 border border-teal-100 dark:border-teal-800 text-teal-700 dark:text-teal-400 text-xs font-bold uppercase tracking-wide animate-in fade-in slide-in-from-bottom-4 duration-500 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
            Powered by Gemini 2.5, 3.0 & Veo
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700">
            Surgical Text to <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">Visual Storyboards.</span>
          </h1>
          
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 bg-white/50 dark:bg-slate-900/50 p-4 rounded-xl backdrop-blur-sm">
            Instantly generate schematic illustrations, audio narration, and AI video previews from standard procedure manuals. Designed for surgical education.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            {/* The ONLY Clickable Button to Enter App */}
            <button 
              onClick={onStart}
              className="w-full sm:w-auto px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold text-lg shadow-xl shadow-teal-900/10 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              Launch Beta Tool <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          
          <div className="pt-8 flex items-center justify-center gap-6 text-sm text-slate-500 dark:text-slate-500 animate-in fade-in duration-1000 delay-300">
            <span className="flex items-center gap-1 bg-white/50 dark:bg-slate-900/50 px-3 py-1 rounded-full backdrop-blur-sm"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Client-side Privacy</span>
            <span className="flex items-center gap-1 bg-white/50 dark:bg-slate-900/50 px-3 py-1 rounded-full backdrop-blur-sm"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Educational Use Only</span>
          </div>
        </div>
      </section>

      {/* Feature Grid (Medical Card Style) */}
      <section className="py-24 px-6 relative z-10" id="features">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-800 dark:text-white mb-4">Visualize procedures <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-500">step-by-step.</span></h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">Our AI agents analyze text to generate multi-modal assets.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="md:col-span-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur border border-slate-200 dark:border-slate-700 rounded-xl p-8 hover:shadow-xl hover:shadow-teal-900/5 transition-all duration-300 group">
              <div className="h-12 w-12 bg-teal-50 dark:bg-teal-900/30 rounded-lg flex items-center justify-center mb-6 text-teal-600 dark:text-teal-400">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Automated Storyboarding</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Paste any procedure text. <strong>Gemini 2.5 Flash</strong> identifies key steps and prompts. Schematic illustrations are generated using <strong>Gemini 3.0 Pro</strong> (Pro mode) or <strong>Gemini 2.5 Flash Image</strong>.
              </p>
              <div className="w-full h-48 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden relative shadow-inner">
                 <div className="absolute inset-0 flex items-center justify-center text-slate-400 dark:text-slate-600 font-mono text-sm uppercase tracking-widest">
                    Generating Schematic...
                 </div>
                 <div className="absolute top-4 left-4 right-4 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500 w-2/3"></div>
                 </div>
                 <div className="absolute bottom-4 right-4 flex gap-2">
                    <div className="h-8 w-20 bg-slate-200 dark:bg-slate-800 rounded"></div>
                    <div className="h-8 w-20 bg-teal-100 dark:bg-teal-900/20 rounded"></div>
                 </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-900/90 dark:bg-slate-800/90 backdrop-blur text-white rounded-xl p-8 border border-slate-800 dark:border-slate-700 shadow-xl flex flex-col justify-between group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-32 bg-blue-600/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
              <div>
                <div className="h-12 w-12 bg-white/10 rounded-lg flex items-center justify-center mb-6 backdrop-blur-sm">
                  <Video className="w-6 h-6 text-blue-300" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Veo AI Video</h3>
                <p className="text-slate-300 text-sm">
                  Animate your storyboards. Uses Google's <strong>Veo 3.1</strong> model to generate short HD video previews (1080p/720p) from your schematic images.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur border border-slate-200 dark:border-slate-700 rounded-xl p-8 hover:border-teal-500 dark:hover:border-teal-500 transition-colors duration-300 group">
              <div className="h-12 w-12 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Smart Step Analysis</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Powered by **Gemini 2.5 Flash**. The agent breaks down dense text into logical steps and suggests the optimal flow for visual learning.
              </p>
            </div>

            {/* Card 4 - Audio Narration */}
            <div className="md:col-span-2 bg-gradient-to-br from-teal-700 to-blue-800 rounded-xl p-8 text-white shadow-xl shadow-teal-900/20 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden backdrop-blur-md">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
               <div className="flex-1 relative z-10">
                  <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center mb-4 backdrop-blur-sm">
                    <Volume2 className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Audio Narration included</h3>
                  <p className="text-teal-100 mb-0 text-sm">
                     Uses **Gemini 2.5 Flash TTS** to generate professional voiceovers for every step of the procedure automatically, perfect for accessibility and auditory learners.
                  </p>
               </div>
               <div className="w-full md:w-1/3 bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20 relative z-10">
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-white/20 rounded-full">
                        <PlayCircle size={20} />
                     </div>
                     <div className="space-y-2 w-full">
                        <div className="h-1.5 w-full bg-white/20 rounded-full"></div>
                        <div className="h-1.5 w-2/3 bg-white/20 rounded-full"></div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 py-12 px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-teal-700 dark:bg-white p-1 rounded">
              <Zap className="h-4 w-4 text-white dark:text-teal-700" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white">SurgiMator <span className="text-[10px] uppercase font-normal ml-1 opacity-50">Private Beta</span></span>
          </div>
          <div className="text-slate-500 dark:text-slate-500 text-sm">
            © {new Date().getFullYear()} SurgiMator AI. Built with Gemini 2.5, 3.0 & Veo.
          </div>
          <div className="flex gap-6 text-sm text-slate-600 dark:text-slate-400">
             <a href="#" className="hover:text-teal-700 dark:hover:text-white transition-colors">Privacy</a>
             <a href="#" className="hover:text-teal-700 dark:hover:text-white transition-colors">Terms</a>
             <a href="#" className="hover:text-teal-700 dark:hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

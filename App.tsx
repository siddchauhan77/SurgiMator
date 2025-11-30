
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { StepCard } from './components/StepCard';
import { LandingPage } from './components/LandingPage';
import { PrivacyModal } from './components/PrivacyModal';
import { WelcomeModal } from './components/WelcomeModal';
import { LimitModal } from './components/LimitModal';
import { MedicalBackground } from './components/MedicalBackground';
import { analyzeManual, generateStepImage, generateStepVideo, generateStepAudio, estimateStepCount, researchProcedure } from './services/geminiService';
import { SurgicalStep, GenerationType, AIStudioClient } from './types';
import { Wand2, Loader2, Sparkles, BookOpen, Info, Calculator, Film, StopCircle, ExternalLink, Trash2, ShieldCheck, Search, Quote } from 'lucide-react';

const SAMPLE_MANUAL_APPENDIX = `Procedure: Laparoscopic Appendectomy
1. Creation of Pneumoperitoneum: Make a small incision at the umbilicus. Insert a Veress needle to insufflate the abdomen with CO2 gas to create working space.
2. Port Placement: Insert a 10mm trocar at the umbilicus for the camera. Insert two 5mm trocars in the left lower quadrant and suprapubic region for instruments.
3. Identification of Appendix: Use a grasper to locate the cecum and trace the taenia coli to find the appendix.
4. Mesoappendix Dissection: Create a window in the mesoappendix near the base. Use an energy device to coagulate and divide the mesoappendix and appendicular artery.
5. Appendectomy: Secure the base of the appendix with endoloops or a stapler. Divide the appendix between the ligatures/staples.
6. Extraction: Place the resected appendix into a retrieval bag. Remove the bag through the umbilical port. Close incisions.`;

const SAMPLE_MANUAL_KNEE = `Procedure: Knee Arthroscopy
1. Portal Entry: Make two small incisions on either side of the patellar tendon. Insert the arthroscope through the lateral portal.
2. Diagnostic Sweep: Irrigate the joint with saline. Systematically inspect the suprapatellar pouch, patellofemoral joint, medial gutter, and medial compartment.
3. Meniscus Evaluation: Use a probe inserted through the medial portal to test the stability and texture of the medial meniscus.
4. Cruciate Ligament Inspection: Direct the camera into the intercondylar notch to visualize the Anterior Cruciate Ligament (ACL) and Posterior Cruciate Ligament (PCL).
5. Lateral Compartment View: Move the knee into a figure-of-four position. Inspect the lateral meniscus and lateral femoral condyle.
6. Closure: Drain excess fluid from the joint. Close the portals with nylon sutures or steri-strips.`;

const SAMPLE_MANUAL_CATARACT = `Procedure: Cataract Surgery (Phacoemulsification)
1. Corneal Incision: Create a clear corneal incision using a keratome blade to enter the anterior chamber.
2. Capsulorhexis: Use forceps to create a continuous curvilinear capsulorhexis (circular opening) in the anterior lens capsule.
3. Hydrodissection: Inject balanced salt solution under the capsule edge to separate the lens from the capsular bag.
4. Phacoemulsification: Insert the phaco probe to fragment the cataract lens nucleus with ultrasound energy and aspirate the pieces.
5. IOL Implantation: Inject the folded intraocular lens (IOL) into the empty capsular bag and ensure it centers correctly.
6. Hydration and Closure: Hydrate the corneal incision edges with saline to induce stromal swelling and seal the wound without sutures.`;

const SAMPLE_MANUAL_CHOLECYSTECTOMY = `Procedure: Laparoscopic Cholecystectomy
1. Exposure: Retract the gallbladder fundus cephalad towards the right shoulder to expose Calot's triangle.
2. Dissection of Calot's Triangle: Carefully dissect the peritoneum to identify the cystic duct and cystic artery. clear fat and fibrous tissue.
3. Critical View of Safety: Conclusively identify that only two structures (cystic duct and artery) enter the gallbladder.
4. Clipping and Division: Apply titanium clips to the cystic artery and cystic duct proximally and distally, then divide them with scissors.
5. Gallbladder Detachment: Use electrocautery (hook or spatula) to dissect the gallbladder from the liver bed.
6. Retrieval and Closure: Place the gallbladder in a retrieval bag and extract through the umbilical port. Desufflate abdomen and suture incisions.`;

const MAX_FREE_GENERATIONS = 5;

export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  
  const [manualText, setManualText] = useState(SAMPLE_MANUAL_APPENDIX);
  const [procedureName, setProcedureName] = useState<string>('');
  const [steps, setSteps] = useState<SurgicalStep[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [isProMode, setIsProMode] = useState(false);
  const [hasOwnKey, setHasOwnKey] = useState(false);
  const [usageCount, setUsageCount] = useState(0);

  // Default to 'light' mode
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  
  // Step Estimation State
  const [stepCount, setStepCount] = useState<number | ''>('');
  const [isEstimatingSteps, setIsEstimatingSteps] = useState(false);
  
  // Research Assistant State
  const [researchQuery, setResearchQuery] = useState('');
  const [isResearching, setIsResearching] = useState(false);
  const [researchSources, setResearchSources] = useState<Array<{title: string, uri: string}>>([]);
  
  // Generation Session ID
  const [generationSessionId, setGenerationSessionId] = useState<number>(0);
  
  // Bulk Generation State
  const [isGeneratingAllVideos, setIsGeneratingAllVideos] = useState(false);

  // Initialize Theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  // Initialize Usage Count
  useEffect(() => {
    const saved = localStorage.getItem('surgimator_usage');
    if (saved) setUsageCount(parseInt(saved));
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const incrementUsage = () => {
      if (hasOwnKey) return; // Unlimited for own key
      const newCount = usageCount + 1;
      setUsageCount(newCount);
      localStorage.setItem('surgimator_usage', newCount.toString());
  };

  const checkUsageLimit = () => {
      if (!hasOwnKey && usageCount >= MAX_FREE_GENERATIONS) {
          setShowLimitModal(true);
          return false;
      }
      return true;
  };

  const handleStartApp = () => {
    setShowLanding(false);
    setShowPrivacyModal(true);
  };
  
  const handleGoHome = () => {
    setShowLanding(true);
  };
  
  const handlePrivacyAccept = async () => {
    setShowPrivacyModal(false);
    // Check if they already have a key selected
    const aiStudio = (window as any).aistudio as AIStudioClient;
    if (aiStudio) {
        const hasKey = await aiStudio.hasSelectedApiKey();
        if (hasKey) {
            setHasOwnKey(true);
            setIsProMode(true);
        } else {
            // Show welcome modal to ask for key
            setShowWelcomeModal(true);
        }
    } else {
        setShowWelcomeModal(true);
    }
  };

  const handleConnectKey = async () => {
      const aiStudio = (window as any).aistudio as AIStudioClient;
      if (aiStudio) {
          try {
              await aiStudio.openSelectKey();
              const hasKey = await aiStudio.hasSelectedApiKey();
              if (hasKey) {
                  setHasOwnKey(true);
                  setIsProMode(true);
                  setShowWelcomeModal(false);
                  setShowLimitModal(false);
              }
          } catch (e) {
              console.error("Failed to select key", e);
          }
      }
  };

  // Check for API Key on mount (in case of reload)
  useEffect(() => {
    const checkKey = async () => {
      const aiStudio = (window as any).aistudio as AIStudioClient;
      if (aiStudio) {
        const hasKey = await aiStudio.hasSelectedApiKey();
        setHasOwnKey(hasKey);
        // If they have a key, default to Pro Mode
        if (hasKey) setIsProMode(true);
      }
    };
    checkKey();
  }, []);

  const handleToggleProMode = async (enable: boolean) => {
    if (enable) {
      if (hasOwnKey) {
          setIsProMode(true);
      } else {
          // If trying to enable Pro but no key, ask for key
          handleConnectKey();
      }
    } else {
      setIsProMode(false);
    }
  };

  const handleEstimateSteps = async () => {
    if (!manualText.trim()) return;
    setIsEstimatingSteps(true);
    try {
        const suggestedCount = await estimateStepCount(manualText);
        setStepCount(suggestedCount);
    } catch (e) {
        console.error("Step estimation failed", e);
    } finally {
        setIsEstimatingSteps(false);
    }
  };
  
  const handleResearch = async () => {
      if (!researchQuery.trim()) return;
      setIsResearching(true);
      setResearchSources([]);
      try {
          const { text, sources } = await researchProcedure(researchQuery);
          setManualText(text);
          setResearchSources(sources);
          setStepCount(''); // Reset step count as text changed
      } catch (e: any) {
          console.error("Research failed", e);
          setError(e.message || "Failed to research procedure.");
      } finally {
          setIsResearching(false);
      }
  };

  const handleClearSession = () => {
    if (window.confirm("Are you sure? This will wipe all text and generated media from the screen.")) {
      setManualText('');
      setSteps([]);
      setProcedureName('');
      setStepCount('');
      setError(null);
      setResearchSources([]);
      setResearchQuery('');
    }
  };

  const loadSample = (sample: string) => {
      setManualText(sample);
      setStepCount(''); 
      setResearchSources([]);
  };

  const handleAnalyze = async () => {
    if (!manualText.trim()) return;
    if (!checkUsageLimit()) return;
    
    // Increment usage for the analysis action
    incrementUsage();

    const currentSessionId = Date.now();
    setGenerationSessionId(currentSessionId);
    
    setIsAnalyzing(true);
    setError(null);
    setSteps([]);
    setProcedureName('');
    setIsGeneratingAllVideos(false);

    try {
      const result = await analyzeManual(manualText, typeof stepCount === 'number' ? stepCount : undefined);
      setProcedureName(result.procedureName);
      
      const initialSteps: SurgicalStep[] = result.steps.map((step, index) => ({
        id: index,
        title: step.title,
        description: step.description,
        visualPrompt: step.visualPrompt,
        isGeneratingImage: false,
        isGeneratingVideo: false,
        isGeneratingAudio: false,
      }));
      
      setSteps(initialSteps);

      generateAllSequentially(initialSteps, currentSessionId);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to analyze manual. Ensure you have an active internet connection.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateAllSequentially = async (stepsToProcess: SurgicalStep[], sessionId: number) => {
    for (const step of stepsToProcess) {
      if (sessionId !== generationSessionId && generationSessionId !== 0) { 
         break;
      }
      // Pass skipUsage=true for auto-generated images
      await handleGenerate(step.id, GenerationType.IMAGE, step, sessionId, true);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  const handleGenerateAllVideos = async () => {
    if (isGeneratingAllVideos) return;
    if (!checkUsageLimit()) return;
    
    // Bulk video generation counts as 1 action
    incrementUsage();

    setIsGeneratingAllVideos(true);
    const currentSessionId = generationSessionId;

    try {
      const stepIds = steps.map(s => s.id);

      for (const id of stepIds) {
        if (currentSessionId !== generationSessionId) break;

        const currentStep = steps.find(s => s.id === id); 
        
        if (currentStep && !currentStep.videoUrl && !currentStep.isGeneratingVideo) {
           await handleGenerate(id, GenerationType.VIDEO, undefined, currentSessionId, true); // skip usage internal
           await new Promise(r => setTimeout(r, 1000));
        }
      }
    } finally {
      setIsGeneratingAllVideos(false);
    }
  };

  const handleGenerate = async (id: number, type: GenerationType, stepOverride?: SurgicalStep, sessionId?: number, skipUsage: boolean = false) => {
    if (sessionId && sessionId !== generationSessionId && generationSessionId !== 0 && sessionId < generationSessionId) {
        return;
    }

    if (!skipUsage && !checkUsageLimit()) return;
    if (!skipUsage) incrementUsage();

    let step = stepOverride;
    if (!step) {
        step = steps.find(s => s.id === id);
    }
    
    if (!step) return;

    setSteps(prev => prev.map(s => {
        if (s.id !== id) return s;
        return {
            ...s,
            isGeneratingImage: type === GenerationType.IMAGE ? true : s.isGeneratingImage,
            isGeneratingVideo: type === GenerationType.VIDEO ? true : s.isGeneratingVideo,
            isGeneratingAudio: type === GenerationType.AUDIO ? true : s.isGeneratingAudio,
            imageError: type === GenerationType.IMAGE ? undefined : s.imageError,
            videoError: type === GenerationType.VIDEO ? undefined : s.videoError,
            audioError: type === GenerationType.AUDIO ? undefined : s.audioError,
        };
    }));

    try {
        let resultUrl = '';
        if (type === GenerationType.IMAGE) {
            resultUrl = await generateStepImage(step.visualPrompt, isProMode);
        } else if (type === GenerationType.VIDEO) {
            resultUrl = await generateStepVideo(step.visualPrompt, step.imageUrl, isProMode);
        } else if (type === GenerationType.AUDIO) {
            resultUrl = await generateStepAudio(step.description);
        }

        setSteps(prev => prev.map(s => {
            if (s.id !== id) return s;
            return {
                ...s,
                imageUrl: type === GenerationType.IMAGE ? resultUrl : s.imageUrl,
                videoUrl: type === GenerationType.VIDEO ? resultUrl : s.videoUrl,
                audioUrl: type === GenerationType.AUDIO ? resultUrl : s.audioUrl,
                isGeneratingImage: type === GenerationType.IMAGE ? false : s.isGeneratingImage,
                isGeneratingVideo: type === GenerationType.VIDEO ? false : s.isGeneratingVideo,
                isGeneratingAudio: type === GenerationType.AUDIO ? false : s.isGeneratingAudio,
                videoQuality: type === GenerationType.VIDEO ? (isProMode ? 'pro' : 'standard') : s.videoQuality
            };
        }));
    } catch (err: any) {
        console.error(err);
        setSteps(prev => prev.map(s => {
            if (s.id !== id) return s;
            return {
                ...s,
                isGeneratingImage: type === GenerationType.IMAGE ? false : s.isGeneratingImage,
                isGeneratingVideo: type === GenerationType.VIDEO ? false : s.isGeneratingVideo,
                isGeneratingAudio: type === GenerationType.AUDIO ? false : s.isGeneratingAudio,
                imageError: type === GenerationType.IMAGE ? err.message : s.imageError,
                videoError: type === GenerationType.VIDEO ? err.message : s.videoError,
                audioError: type === GenerationType.AUDIO ? err.message : s.audioError,
            };
        }));
    }
  };

  if (showLanding) {
    return <LandingPage onStart={handleStartApp} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 transition-colors duration-300 font-sans pb-20 sm:pb-8 relative">
      <MedicalBackground />
      {showPrivacyModal && <PrivacyModal onAccept={handlePrivacyAccept} />}
      {showWelcomeModal && <WelcomeModal onConnectKey={handleConnectKey} onContinueFree={() => setShowWelcomeModal(false)} />}
      {showLimitModal && <LimitModal onConnectKey={handleConnectKey} onClose={() => setShowLimitModal(false)} />}
      
      <Header 
        isProMode={isProMode} 
        onToggleProMode={handleToggleProMode} 
        theme={theme}
        onToggleTheme={toggleTheme}
        onGoHome={handleGoHome}
        hasOwnKey={hasOwnKey}
        usageCount={usageCount}
        maxUsage={MAX_FREE_GENERATIONS}
        onAddKey={handleConnectKey}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 sm:space-y-12 relative z-10">
        
        {/* Input Section */}
        <section className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4 sm:mb-6">
            <div className="max-w-2xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mb-2">Procedure Analysis</h2>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
                  Input surgical technique text below.
                </p>
                <span className="inline-flex items-center gap-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-emerald-200 dark:border-emerald-800">
                  <ShieldCheck size={10} /> Secure Session
                </span>
              </div>
            </div>
            
            <button 
              onClick={handleClearSession}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 bg-white/80 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-lg shadow-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors backdrop-blur-sm"
              title="Clear all data from screen immediately"
            >
              <Trash2 size={14} />
              Reset Form
            </button>
          </div>

          {/* AI Research Assistant (Experimental) */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-900/30 rounded-xl p-4 border border-blue-100 dark:border-slate-800 shadow-sm">
             <div className="flex flex-col gap-3">
                 <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
                    <Sparkles size={16} />
                    <span className="text-xs font-bold uppercase tracking-wide">AI Research Assistant (Beta)</span>
                 </div>
                 <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            value={researchQuery}
                            onChange={(e) => setResearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleResearch()}
                            placeholder="Ask AI to find a procedure (e.g., 'Standard Open Appendectomy Steps')"
                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                    <button 
                        onClick={handleResearch}
                        disabled={isResearching || !researchQuery}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
                    >
                        {isResearching ? <Loader2 size={16} className="animate-spin"/> : <Search size={16} />}
                        Search & Draft
                    </button>
                 </div>
                 {researchSources.length > 0 && (
                     <div className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap gap-2 mt-1">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Sources:</span>
                        {researchSources.map((source, idx) => (
                            <a key={idx} href={source.uri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline bg-blue-50 dark:bg-blue-900/20 px-1.5 py-0.5 rounded border border-blue-100 dark:border-blue-900/30">
                                {source.title} <ExternalLink size={8} />
                            </a>
                        ))}
                     </div>
                 )}
             </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 rounded-xl p-1 shadow-sm border border-slate-200 dark:border-slate-800 transition-colors duration-300 backdrop-blur-md">
              <textarea
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
                className="w-full h-40 sm:h-48 bg-transparent text-slate-700 dark:text-slate-300 p-4 sm:p-6 rounded-lg border-none focus:ring-0 resize-none font-mono text-xs sm:text-sm leading-relaxed transition-colors outline-none placeholder:text-slate-300 dark:placeholder:text-slate-600 selection:bg-teal-100 dark:selection:bg-teal-900/50"
                placeholder="Paste surgical steps here... DO NOT INCLUDE PHI (Patient Names, DOB, MRN). This tool is for educational use only."
              />
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6 bg-white/90 dark:bg-slate-900/90 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-md">
              
              {/* Left Group: Samples */}
              <div className="w-full lg:w-auto flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 text-slate-400 dark:text-slate-500 text-xs px-2 py-1.5 whitespace-nowrap font-medium uppercase tracking-wide">
                    <Info size={14} />
                    Load Sample:
                </div>
                <div className="flex flex-wrap gap-2 w-full">
                    <button
                        onClick={() => loadSample(SAMPLE_MANUAL_APPENDIX)}
                        className="flex-1 sm:flex-none justify-center px-3 py-2 bg-slate-50 hover:bg-teal-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:border-teal-200 dark:hover:border-slate-600 transition-colors flex items-center gap-2"
                        title="Load Laparoscopic Appendectomy"
                    >
                        <BookOpen size={14} className="text-teal-600 dark:text-teal-500" />
                        Appendix
                    </button>
                    <button
                        onClick={() => loadSample(SAMPLE_MANUAL_KNEE)}
                        className="flex-1 sm:flex-none justify-center px-3 py-2 bg-slate-50 hover:bg-teal-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:border-teal-200 dark:hover:border-slate-600 transition-colors flex items-center gap-2"
                        title="Load Knee Arthroscopy"
                    >
                        <BookOpen size={14} className="text-teal-600 dark:text-teal-500" />
                        Knee
                    </button>
                    <button
                        onClick={() => loadSample(SAMPLE_MANUAL_CATARACT)}
                        className="flex-1 sm:flex-none justify-center px-3 py-2 bg-slate-50 hover:bg-teal-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:border-teal-200 dark:hover:border-slate-600 transition-colors flex items-center gap-2"
                        title="Load Cataract Surgery"
                    >
                        <BookOpen size={14} className="text-teal-600 dark:text-teal-500" />
                        Cataract
                    </button>
                    <button
                        onClick={() => loadSample(SAMPLE_MANUAL_CHOLECYSTECTOMY)}
                        className="flex-1 sm:flex-none justify-center px-3 py-2 bg-slate-50 hover:bg-teal-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:border-teal-200 dark:hover:border-slate-600 transition-colors flex items-center gap-2"
                        title="Load Cholecystectomy (Gallbladder)"
                    >
                        <BookOpen size={14} className="text-teal-600 dark:text-teal-500" />
                        Gallbladder
                    </button>
                </div>
              </div>

              {/* Right Group: Controls & Generate */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 w-full lg:w-auto">
                {/* Step Count Control */}
                <div className="flex items-center justify-between sm:justify-start gap-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-1.5 border border-slate-200 dark:border-slate-700" title="Estimated number of steps">
                    <div className="flex items-center">
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 pl-2 pr-1">Steps:</span>
                        <input 
                            type="number" 
                            min="1" 
                            max="20"
                            value={stepCount}
                            onChange={(e) => {
                                const val = parseInt(e.target.value);
                                setStepCount(isNaN(val) ? '' : val);
                            }}
                            className="w-12 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-600 rounded px-1 py-1 text-sm text-center focus:ring-1 focus:ring-teal-500 outline-none transition-all placeholder:text-slate-300 text-slate-700 dark:text-white"
                            placeholder="Auto"
                        />
                    </div>
                    <button 
                        onClick={handleEstimateSteps}
                        disabled={isEstimatingSteps || !manualText}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-teal-50 dark:hover:bg-slate-700 rounded text-teal-600 dark:text-teal-400 transition-colors disabled:opacity-50 text-xs font-bold shadow-sm"
                        title="AI Suggest: Calculate optimal steps"
                    >
                        {isEstimatingSteps ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                        <span>AI Count</span>
                    </button>
                </div>

                <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !manualText}
                    className={`w-full sm:w-auto px-6 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all transform active:scale-95 ${
                    isAnalyzing 
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed' 
                    : 'bg-teal-600 hover:bg-teal-700 text-white hover:shadow-md'
                    }`}
                >
                    {isAnalyzing ? (
                    <>
                        <Loader2 className="animate-spin" size={16} />
                        <span className="animate-pulse">Processing...</span>
                    </>
                    ) : (
                    <>
                        <Wand2 size={16} />
                        Generate Storyboard
                    </>
                    )}
                </button>
              </div>
          </div>

          {/* External Sources Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-8 gap-y-2 text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 px-4">
            <span className="opacity-75 uppercase tracking-wide font-medium">Source Material:</span>
            <a 
              href="https://pubmed.ncbi.nlm.nih.gov/?term=surgical+technique" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-teal-600 dark:hover:text-teal-400 transition-colors hover:underline"
            >
              PubMed <ExternalLink size={10} />
            </a>
            <a 
              href="https://emedicine.medscape.com/surgical_procedures" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-teal-600 dark:hover:text-teal-400 transition-colors hover:underline"
            >
              Medscape <ExternalLink size={10} />
            </a>
            <a 
              href="https://www.who.int/teams/integrated-health-services/patient-safety" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-teal-600 dark:hover:text-teal-400 transition-colors hover:underline"
            >
              WHO Guidelines <ExternalLink size={10} />
            </a>
          </div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg text-center text-sm">
              {error}
            </div>
          )}
        </section>

        {/* Results Section */}
        {steps.length > 0 && (
          <section className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-700 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 gap-4 bg-white/50 dark:bg-slate-900/50 p-4 rounded-xl backdrop-blur-sm">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                  <Sparkles className="text-teal-500 dark:text-teal-400 shrink-0" size={24} />
                  <span className="truncate">{procedureName || 'Procedure Storyboard'}</span>
                </h2>
                <p className="text-slate-500 dark:text-slate-500 text-xs sm:text-sm mt-1 font-medium">
                  {steps.length} Steps Identified • AI Visualization Ready
                </p>
              </div>
              
              <button 
                onClick={handleGenerateAllVideos}
                disabled={isGeneratingAllVideos || steps.some(s => !s.imageUrl) || steps.every(s => !!s.videoUrl)}
                className={`w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-all ${
                  isGeneratingAllVideos 
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 cursor-wait' 
                    : (steps.some(s => !s.imageUrl) || steps.every(s => !!s.videoUrl))
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                        : 'bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-md'
                }`}
                title={
                    steps.some(s => !s.imageUrl)
                    ? "Wait for all storyboard images to complete before generating videos"
                    : "Generate animation videos for all steps sequentially"
                }
              >
                {isGeneratingAllVideos ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Generating All...
                  </>
                ) : (
                  <>
                    <Film size={16} />
                    Generate All Animations
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {steps.map((step) => (
                <StepCard 
                  key={step.id} 
                  step={step} 
                  onGenerate={(id, type) => handleGenerate(id, type, undefined, generationSessionId)}
                  isProMode={isProMode}
                  totalSteps={steps.length}
                />
              ))}
            </div>
          </section>
        )}

      </main>
    </div>
  );
}
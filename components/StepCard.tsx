
import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Image as ImageIcon, Video, Volume2, VolumeX, Loader2, FileVideo, Film, AlertCircle, Eye, Lock, RefreshCw, Flag, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { SurgicalStep, GenerationType } from '../types';

interface StepCardProps {
  step: SurgicalStep;
  onGenerate: (id: number, type: GenerationType) => void;
  isProMode: boolean;
  totalSteps: number;
}

const LoadingVisual = ({ type }: { type: 'image' | 'video' }) => {
  const [text, setText] = useState(type === 'video' ? "Initializing Veo Model..." : "Initializing AI...");
  
  useEffect(() => {
    // Phases specific to generation type
    const imagePhases = [
      "Analyzing anatomy...",
      "Composing schematic...", 
      "Sketching outlines...",
      "Applying medical shading...",
      "Finalizing visualization..."
    ];

    const videoPhases = [
      "Initializing Veo 3.1 Model...",
      "Analyzing reference image...",
      "Constructing 3D scene depth...",
      "Rendering keyframes...",
      "Applying motion dynamics...",
      "Encoding video stream...",
      "Finalizing output..."
    ];

    const phases = type === 'video' ? videoPhases : imagePhases;
    // Slower interval for video as it takes longer
    const intervalTime = type === 'video' ? 5000 : 2000;

    let i = 0;
    setText(phases[0]);
    const interval = setInterval(() => {
      i = (i + 1) % phases.length;
      setText(phases[i]);
    }, intervalTime); 
    return () => clearInterval(interval);
  }, [type]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 p-6 z-10 animate-in fade-in duration-500">
      {/* Abstract Medical Shape Animation */}
      <div className="relative w-16 h-16 mb-4 flex items-center justify-center">
        {/* Outer Ring */}
        <div className="absolute inset-0 border-4 border-slate-200 dark:border-slate-800 rounded-full"></div>
        {/* Spinning Segment */}
        <div className={`absolute inset-0 border-t-4 ${type === 'video' ? 'border-indigo-500' : 'border-teal-500'} rounded-full animate-spin duration-[2s]`}></div>
        {/* Center Icon */}
        {type === 'video' ? (
           <Film className="w-6 h-6 text-indigo-500 animate-pulse" />
        ) : (
           <Sparkles className="w-6 h-6 text-teal-500 animate-pulse" />
        )}
      </div>
      
      <div className="flex flex-col items-center gap-3">
        <span className={`text-sm font-semibold ${type === 'video' ? 'text-indigo-700 dark:text-indigo-400' : 'text-teal-700 dark:text-teal-400'} animate-pulse text-center min-h-[20px]`}>
            {text}
        </span>
        <div className="flex gap-1.5 opacity-60">
            <div className={`w-1.5 h-1.5 ${type === 'video' ? 'bg-indigo-400' : 'bg-teal-400'} rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
            <div className={`w-1.5 h-1.5 ${type === 'video' ? 'bg-indigo-400' : 'bg-teal-400'} rounded-full animate-bounce`} style={{ animationDelay: '150ms' }}></div>
            <div className={`w-1.5 h-1.5 ${type === 'video' ? 'bg-indigo-400' : 'bg-teal-400'} rounded-full animate-bounce`} style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};

const CustomVideoPlayer = ({ src, poster }: { src: string; poster?: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => setDuration(video.duration);
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setProgress((video.currentTime / video.duration) * 100);
    };
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (videoRef.current) {
      const newTime = (val / 100) * videoRef.current.duration;
      videoRef.current.currentTime = newTime;
      setProgress(val);
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      setIsMuted(newMuted);
      videoRef.current.muted = newMuted;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className="relative w-full h-full group bg-black overflow-hidden"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      onClick={() => setShowControls(true)} // Touch support
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-cover cursor-pointer"
        onClick={(e) => { e.stopPropagation(); togglePlay(); }}
        playsInline
      />
      
      {/* Centered Play Button (Initial or Paused) */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/50 rounded-full p-4 backdrop-blur-sm">
            <Play fill="white" className="w-8 h-8 text-white ml-1" />
          </div>
        </div>
      )}

      {/* Controls Overlay */}
      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3 sm:p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex flex-col gap-2">
          {/* Progress Bar - Fat touch target */}
          <div className="relative h-4 flex items-center">
            <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleSeek}
                className="w-full h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-125 transition-all touch-action-none"
            />
          </div>
          
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <button onClick={togglePlay} className="hover:text-blue-400 transition-colors p-1">
                {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
              </button>
              
              <div className="flex items-center gap-2 group/vol">
                <button onClick={toggleMute} className="hover:text-blue-400 transition-colors p-1">
                  {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <div className="relative h-6 flex items-center w-0 overflow-hidden group-hover/vol:w-20 transition-all duration-300">
                    <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="h-1 w-full bg-slate-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                    />
                </div>
              </div>

              <span className="text-xs font-mono text-slate-300">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const StepCard: React.FC<StepCardProps> = ({ step, onGenerate, isProMode, totalSteps }) => {
  const [activeView, setActiveView] = useState<'image' | 'video'>('image');

  // Automatically switch to video view when a new video is generated
  useEffect(() => {
    if (step.videoUrl) {
      setActiveView('video');
    }
  }, [step.videoUrl]);

  const handleImageClick = () => {
    if (step.imageUrl) {
      setActiveView('image');
    } else {
      onGenerate(step.id, GenerationType.IMAGE);
    }
  };

  const handleVideoClick = () => {
    if (step.videoUrl) {
      setActiveView('video');
    } else {
      onGenerate(step.id, GenerationType.VIDEO);
    }
  };

  // Determine what content to show in the media area
  const showVideo = activeView === 'video' && step.videoUrl;
  const showWatermark = step.videoQuality === 'standard';
  // Check if both media types exist to show the toggle
  const hasBothMedia = !!step.imageUrl && !!step.videoUrl;

  // Determine Tags
  const isFirst = step.id === 0;
  const isLast = step.id === totalSteps - 1;
  
  // Heuristic for closure
  const closureKeywords = ['close', 'closure', 'suture', 'stitch', 'bandage', 'dressing', 'recovery', 'post-operative', 'complete', 'finish', 'end', 'staple'];
  const textContent = (step.title + " " + step.description).toLowerCase();
  const hasClosure = closureKeywords.some(k => textContent.includes(k));

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-xl overflow-hidden border shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full ${
        isLast && !hasClosure 
            ? 'border-amber-300 dark:border-amber-700 ring-1 ring-amber-100 dark:ring-amber-900/30' 
            : 'border-slate-200 dark:border-slate-700'
    }`}>
      
      {/* Media Display Area */}
      <div className="aspect-video bg-slate-50 dark:bg-slate-900 relative flex items-center justify-center group border-b border-slate-100 dark:border-slate-800 transition-all">
        {showVideo ? (
          <div className="relative w-full h-full">
            <CustomVideoPlayer src={step.videoUrl!} poster={step.imageUrl} />
            {showWatermark && (
                <div className="absolute top-3 right-3 bg-black/40 backdrop-blur border border-white/20 px-2 py-1 rounded text-[10px] font-medium text-white/80 pointer-events-none z-10 select-none">
                    STANDARD PREVIEW
                </div>
            )}
          </div>
        ) : (
          // Image View Area (Handles Images, Loading States, and Errors)
          <>
            {step.isGeneratingVideo ? (
                // Video Generation Visual with specific phases
                <LoadingVisual type="video" />
            ) : step.isGeneratingImage ? (
                // Image Generation Visual
                <LoadingVisual type="image" />
            ) : step.imageUrl ? (
              <div className="relative w-full h-full animate-in fade-in duration-500">
                <img 
                  src={step.imageUrl} 
                  alt={step.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : step.imageError ? (
              <div className="flex flex-col items-center justify-center text-red-600 dark:text-red-400 p-6 text-center animate-in fade-in">
                <AlertCircle className="w-12 h-12 mb-3 opacity-80" />
                <span className="text-sm font-medium">Generation Failed</span>
                <span className="text-xs text-red-500/80 dark:text-red-400/80 mt-1 max-w-[200px] mb-3">{step.imageError}</span>
                <button 
                  onClick={() => onGenerate(step.id, GenerationType.IMAGE)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-red-500/10 hover:bg-red-50 dark:hover:bg-red-500/20 text-red-700 dark:text-red-300 text-xs font-medium rounded border border-red-200 dark:border-red-500/30 transition-colors"
                  title="Try generating the image again"
                >
                   <RefreshCw size={12} /> Regenerate
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 p-6 text-center">
                <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                <span className="text-sm">No visualization yet</span>
              </div>
            )}
          </>
        )}

        {/* Media Toggle Switch (Only appears if both media exist) */}
        {hasBothMedia && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 flex bg-black/60 backdrop-blur-md rounded-full p-1 border border-white/10 z-20 shadow-xl">
                <button 
                    onClick={() => setActiveView('image')}
                    className={`p-1.5 px-3 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all ${
                        activeView === 'image' 
                        ? 'bg-teal-600 text-white shadow-md' 
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                >
                    <ImageIcon size={14} />
                    <span>Image</span>
                </button>
                <button 
                    onClick={() => setActiveView('video')}
                    className={`p-1.5 px-3 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all ${
                        activeView === 'video' 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                >
                    <Play size={14} />
                    <span>Video</span>
                </button>
            </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col bg-white dark:bg-slate-800">
        <div className="flex justify-between items-start mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] sm:text-xs font-bold px-2 py-1 rounded border border-slate-200 dark:border-slate-600 uppercase tracking-wide">
              STEP {step.id + 1}
            </span>
            
            {/* Start / End Tags */}
            {isFirst && (
                <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold px-2 py-1 rounded border border-emerald-200 dark:border-emerald-800 uppercase tracking-wide flex items-center gap-1">
                    <Flag size={10} /> Start
                </span>
            )}
            
            {isLast && hasClosure && (
                <span className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold px-2 py-1 rounded border border-slate-200 dark:border-slate-600 uppercase tracking-wide flex items-center gap-1">
                    <CheckCircle2 size={10} /> Procedure End
                </span>
            )}

            {isLast && !hasClosure && (
                <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-bold px-2 py-1 rounded border border-amber-200 dark:border-amber-800 uppercase tracking-wide flex items-center gap-1" title="The procedure text does not appear to describe a final closure step.">
                    <AlertTriangle size={10} /> Incomplete?
                </span>
            )}
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            {/* Image Button */}
            <button
              onClick={handleImageClick}
              disabled={step.isGeneratingImage}
              className={`p-2 rounded-lg transition-all relative group/btn ${
                step.imageUrl 
                  ? activeView === 'image'
                    ? 'bg-teal-600 text-white shadow-md' // Active & Viewing
                    : 'bg-slate-100 dark:bg-slate-700 text-teal-600 dark:text-teal-400 hover:bg-slate-200 dark:hover:bg-slate-600' // Available but inactive
                  : step.imageError 
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800' // Error/Retry
                    : 'bg-slate-50 dark:bg-slate-700 text-slate-400 dark:text-slate-400 hover:bg-teal-600 hover:text-white dark:hover:text-white' // Generate
              }`}
              title={step.imageUrl ? "View Storyboard" : "Generate Image (Standard)"}
            >
              {step.imageUrl && activeView !== 'image' ? <Eye size={18} /> : <ImageIcon size={18} />}
            </button>
            
            {/* Video Section */}
            <div className="flex items-center gap-1">
              <div className="relative group/video">
                <button
                  onClick={handleVideoClick}
                  disabled={step.isGeneratingVideo}
                  className={`p-2 rounded-lg transition-all ${
                    step.videoUrl
                      ? activeView === 'video'
                        ? 'bg-blue-600 text-white shadow-md' // Active & Viewing
                        : 'bg-slate-100 dark:bg-slate-700 text-blue-600 dark:text-blue-400 hover:bg-slate-200 dark:hover:bg-slate-600' // Available but inactive
                      : step.videoError 
                        ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800' // Error/Retry
                        : step.imageUrl
                            ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-md' // Ready to Animate
                            : 'bg-slate-50 dark:bg-slate-700 text-slate-400 dark:text-slate-400 hover:bg-blue-600 hover:text-white dark:hover:text-white' // Generate standard
                  }`}
                  title={
                      step.videoUrl 
                        ? (step.videoQuality === 'standard' ? "View Standard Preview" : "View Pro Animation")
                        : isProMode
                          ? "Generate Pro Video (1080p, 4K Quality)"
                          : "Generate Preview (Standard 720p) - Enable Pro Mode for 1080p & Higher Quality"
                  }
                >
                   {step.isGeneratingVideo ? <Loader2 size={18} className="animate-spin" /> : 
                   step.videoUrl && activeView !== 'video' ? <Play size={18} /> : 
                   step.imageUrl ? <Film size={18} /> : <FileVideo size={18} />}
                </button>
                 {step.videoError && (
                  <div className="absolute top-full right-0 mt-2 bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-200 text-xs p-2 rounded w-48 z-20 shadow-xl border border-red-200 dark:border-red-800 text-left hidden sm:block">
                    <span className="font-bold block mb-1">Video Failed</span>
                    {step.videoError}
                  </div>
                )}
              </div>
              {step.videoError && (
                 <button 
                   onClick={() => onGenerate(step.id, GenerationType.VIDEO)}
                   className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 rounded-full transition-colors"
                   title="Regenerate Video"
                 >
                   <RefreshCw size={14} />
                 </button>
              )}
            </div>
          </div>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white mb-2">{step.title}</h3>
        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed mb-4 flex-1">
          {step.description}
        </p>
        
        {/* Prompt Debug */}
        <details className="mt-4">
            <summary className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 cursor-pointer hover:text-teal-600 dark:hover:text-teal-400 font-medium">View Medical Prompt</summary>
            <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-500 mt-2 italic p-2 bg-slate-50 dark:bg-slate-900/50 rounded border border-slate-100 dark:border-slate-800">
                {step.visualPrompt}
            </p>
        </details>
      </div>
    </div>
  );
};

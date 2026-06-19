import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Video, 
  FileVideo, 
  CheckCircle2, 
  FileCheck,
  Zap,
  Cpu,
  Tv
} from 'lucide-react';
import { ActiveTab } from '../types';

interface VideoUploadScreenProps {
  onUploadComplete: (metadata: {
    name: string;
    size: string;
    duration: string;
    state: 'NORMAL' | 'MODERATE' | 'WARNING' | 'DANGEROUS';
  }) => void;
  onNavigate: (tab: ActiveTab) => void;
}

interface PresetOption {
  name: string;
  size: string;
  duration: string;
  desc: string;
  classification: 'NORMAL' | 'MODERATE' | 'WARNING' | 'DANGEROUS';
}

const PRESET_VIDEOS: PresetOption[] = [
  {
    name: 'subway_gate_04_rush.mp4',
    size: '142.1 MB',
    duration: '225 seconds',
    desc: 'Metropolitan Area Transit Terminal — Ingress Peak Flow',
    classification: 'NORMAL'
  },
  {
    name: 'plaza_food_court_cctv.mov',
    size: '280.4 MB',
    duration: '180 seconds',
    desc: 'Civic Square Retail Galleria — Seasonal Gathering Event',
    classification: 'MODERATE'
  },
  {
    name: 'stadium_concourse_evac.avi',
    size: '410.9 MB',
    duration: '315 seconds',
    desc: 'Block C Exit Corridor — Emergency Transit Drill',
    classification: 'DANGEROUS'
  }
];

export const VideoUploadScreen: React.FC<VideoUploadScreenProps> = ({ 
  onUploadComplete,
  onNavigate
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<PresetOption | null>(PRESET_VIDEOS[0]);
  const [customFile, setCustomFile] = useState<{ name: string; size: string; duration: string } | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'analyzing' | 'success'>('idle');
  const [progress, setProgress] = useState(0);
  const [analysisText, setAnalysisText] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const mockSize = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
      const mockDuration = `${Math.floor(Math.random() * 120) + 60} seconds`;
      setCustomFile({
        name: file.name,
        size: mockSize,
        duration: mockDuration
      });
      setSelectedPreset(null);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const mockSize = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
      const mockDuration = `${Math.floor(Math.random() * 120) + 60} seconds`;
      setCustomFile({
        name: file.name,
        size: mockSize,
        duration: mockDuration
      });
      setSelectedPreset(null);
    }
  };

  const startUploadAndAnalysis = () => {
    if (!selectedPreset && !customFile) {
      return;
    }

    setStatus('uploading');
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 120);

    setTimeout(() => {
      setStatus('analyzing');
      setAnalysisText('Extracting telemetry vectors (YOLOv8 framework)...');
      setTimeout(() => {
        setAnalysisText('Mapping occupancy density matrices on GPU CUDA node_02...');
        setTimeout(() => {
          setAnalysisText('Calculating movement tracking velocity vectors...');
          setTimeout(() => {
            setStatus('success');
            const finalState = selectedPreset ? selectedPreset.classification : 'MODERATE';
            onUploadComplete({
              name: selectedPreset ? selectedPreset.name : (customFile?.name || 'custom_upload.mp4'),
              size: selectedPreset ? selectedPreset.size : (customFile?.size || '195.4 MB'),
              duration: selectedPreset ? selectedPreset.duration : (customFile?.duration || '120 seconds'),
              state: finalState
            });
          }, 800);
        }, 800);
      }, 800);
    }, 1500);
  };

  const resetUpload = () => {
    setStatus('idle');
    setCustomFile(null);
    setSelectedPreset(PRESET_VIDEOS[0]);
    setProgress(0);
  };

  const currentFileName = selectedPreset ? selectedPreset.name : (customFile?.name || 'No file selected');
  const currentFileSize = selectedPreset ? selectedPreset.size : (customFile?.size || '0 MB');
  const currentFileDuration = selectedPreset ? selectedPreset.duration : (customFile?.duration || '0s');

  return (
    <div className="space-y-8 animate-fade-in text-slate-700">
      
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-5">
        <h2 className="text-xl md:text-2xl font-bold font-display text-slate-900 tracking-wide">
          Video Media Ingestion & Core Calibration
        </h2>
        <p className="text-xs text-slate-500 font-sans mt-1">
          Ingest high-density closed-circuit surveillance footage to initialize predictive drift modeling structures.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* LEFT COLUMN: UPLOADER CONTROLS */}
        <div className="space-y-6">
          <h3 className="text-[11px] font-sans font-bold tracking-wider text-slate-500 uppercase">
            Ingestion Settings
          </h3>

          <div className="border border-slate-200 bg-white p-6 rounded-2xl space-y-6 shadow-sm">
            
            <div>
              <label className="block text-xs font-sans font-bold uppercase tracking-wider text-slate-500 mb-3">
                Select Video File
              </label>

              {/* Drag & drop region area */}
              <div 
                id="drag-drop-zone"
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[170px] ${
                  dragActive 
                    ? 'border-brand-500 bg-brand-50' 
                    : customFile 
                    ? 'border-emerald-500 bg-emerald-50/50' 
                    : 'border-slate-300 bg-slate-50/40 hover:border-slate-450 hover:bg-slate-50/80'
                }`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept=".mp4,.avi,.mov"
                  className="hidden" 
                />
                
                {customFile ? (
                  <>
                    <FileVideo className="h-10 w-10 text-emerald-600 mb-3 animate-pulse" />
                    <p className="text-xs font-mono font-semibold text-emerald-600 truncate max-w-xs">{customFile.name}</p>
                    <p className="text-[11px] text-slate-500 mt-2">Asset calibrated • Click to choose a different file</p>
                  </>
                ) : (
                  <>
                    <Upload className="h-9 w-9 text-slate-400 mb-3" />
                    <p className="text-xs font-sans font-semibold text-slate-700">
                      Drag and Drop Surveillance Video Here
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      or click to examine local workstation directories
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Ingestion triggers */}
            <div className="flex items-center justify-between gap-4">
              <button 
                id="browse-files-btn"
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold py-2.5 px-6 rounded-xl uppercase tracking-wider transition-all cursor-pointer font-sans"
              >
                Browse Media Library
              </button>
              <div className="text-[11px] font-mono text-slate-400 truncate flex-1 block">
                {currentFileName !== 'No file selected' ? '✓ Data asset loaded' : 'No local file selected'}
              </div>
            </div>

            {/* DEMO ACADEMIC PRESETS */}
            <div className="border-t border-slate-100 pt-5">
              <span className="block text-[10px] font-sans font-bold text-slate-400 uppercase tracking-widest mb-3">
                Or choose an academic preset video to test:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {PRESET_VIDEOS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedPreset(preset);
                      setCustomFile(null);
                    }}
                    className={`p-3 text-left border rounded-xl transition-all cursor-pointer ${
                      selectedPreset?.name === preset.name
                        ? 'border-brand-500 bg-brand-50 text-brand-700 font-semibold shadow-sm'
                        : 'border-slate-200 bg-white text-slate-650 hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-mono font-semibold truncate block text-slate-800">{preset.name}</span>
                      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${preset.classification === 'DANGEROUS' ? 'bg-red-500 animate-pulse' : preset.classification === 'MODERATE' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                    </div>
                    <span className="text-[9.5px] font-mono text-slate-400 block mt-1 uppercase tracking-wider">
                      {preset.classification} ({preset.duration})
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Execute processing buttons */}
            <div className="pt-2">
              {status === 'idle' && (
                <button
                  id="upload-analyze-btn"
                  onClick={startUploadAndAnalysis}
                  className="w-full bg-brand-600 hover:bg-brand-700 text-white text-xs py-3.5 px-6 rounded-xl transition-all font-sans uppercase tracking-widest font-bold cursor-pointer hover:shadow-md"
                >
                  Ingest and Compute Behavioral Heuristics
                </button>
              )}

              {/* Progress feedback */}
              {(status === 'uploading' || status === 'analyzing') && (
                <div className="space-y-4 bg-slate-50 p-4 border border-slate-200 rounded-xl">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-brand-650 animate-pulse font-sans font-bold uppercase tracking-wider">
                      {status === 'uploading' ? 'Transmitting segments...' : 'Processing optical crowd density...'}
                    </span>
                    <span className="text-slate-500 font-mono font-medium">{progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-brand-650 h-full rounded-full transition-all duration-150"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  {status === 'analyzing' && (
                    <div className="flex items-center gap-2 text-[10px] font-mono text-amber-600 uppercase tracking-widest animate-pulse">
                      <Cpu className="h-3 w-3" />
                      <span>{analysisText}</span>
                    </div>
                  )}
                </div>
              )}

              {status === 'success' && (
                <div className="space-y-4 font-sans animate-fade-in">
                  <div className="bg-emerald-50 border border-emerald-250 p-4 rounded-xl flex items-start gap-3.5">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-sans font-bold text-emerald-800 uppercase tracking-wider leading-none">Ingestion Completed Successfully</h4>
                      <p className="text-[11px] text-slate-500 mt-1.5 font-sans">
                        Optical segments mapped. Statistical coordinate indexes successfully calculated.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => onNavigate('results')}
                      className="flex-1 bg-brand-600 hover:bg-brand-700 text-white text-xs py-3 rounded-xl font-sans font-semibold uppercase tracking-wider transition-all text-center cursor-pointer shadow-sm"
                    >
                      Open Processed Telemetry
                    </button>
                    <button
                      onClick={resetUpload}
                      className="border border-slate-200 hover:bg-slate-100 text-slate-500 text-xs py-3 px-4 rounded-xl font-sans uppercase tracking-wider transition-all cursor-pointer font-medium"
                    >
                      Clear File
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: PREVIEW INFO */}
        <div className="space-y-6">
          <h3 className="text-[11px] font-sans font-bold tracking-wider text-slate-500 uppercase">
            Visual Matrix Interface
          </h3>

          <div className="border border-slate-200 bg-white p-6 rounded-2xl space-y-4 shadow-sm">
            
            <div id="video-preview-placeholder-box" className="aspect-video bg-slate-900 rounded-xl flex flex-col justify-center items-center text-center p-4 border border-slate-800 relative overflow-hidden group">
              <div className="absolute inset-0 bg-blue-500/5 opacity-60 pointer-events-none" />
              
              <Tv className="h-10 w-10 text-slate-700 mb-3 group-hover:scale-105 transition-transform" />
              <p className="text-xs text-slate-400 font-sans font-medium tracking-wide">
                Visual Media Asset Preview
              </p>
              
              {selectedPreset && (
                <div className="absolute bottom-3 left-3 right-3 bg-slate-900/95 border border-slate-800 p-3 rounded-lg text-left flex items-start gap-2.5 animate-fade-in">
                  <div className="h-1.5 w-1.5 rounded-full bg-brand-500 mt-1.5 animate-pulse shrink-0" />
                  <div>
                    <span className="text-[11px] font-mono font-semibold text-slate-200 block leading-tight truncate">{selectedPreset.name}</span>
                    <span className="text-[10px] font-sans text-slate-450 block leading-normal mt-0.5">{selectedPreset.desc}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Metadata metrics styled exclusively in JetBrains Mono */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-150 font-mono text-xs text-slate-500 select-none">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-sans font-bold tracking-wider">File Identifier:</span>
                <span className="text-slate-700 font-semibold truncate block mt-0.5">{currentFileName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-sans font-bold tracking-wider">Storage Load:</span>
                <span className="text-slate-700 font-semibold block mt-0.5">{currentFileSize}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-sans font-bold tracking-wider">Timeline Run:</span>
                <span className="text-slate-700 font-semibold block mt-0.5">{currentFileDuration}</span>
              </div>
            </div>

          </div>

          {/* Academic Instructions panel */}
          <div className="border border-slate-200 bg-white p-6 rounded-2xl space-y-3 font-sans shadow-sm">
            <h4 className="text-xs font-sans font-bold uppercase tracking-wider text-slate-700">
              Ingestion Protocol Guidelines
            </h4>
            
            <ul className="text-xs text-slate-500 space-y-2.5 pl-3 list-none">
              <li className="flex items-start gap-2">
                <span className="text-brand-600 font-bold">•</span>
                <span>Calibrated frame resolution limits match up to <strong className="text-slate-700">2160p high definition CCTV streams</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-600 font-bold">•</span>
                <span>Supported file headers include <strong className="text-slate-700">MP4, AVI, and MOV files</strong> up to 500 MB.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-600 font-bold">•</span>
                <span>Optical tracking calculates object coordinates on GPU cloud infrastructure recursively with a <strong className="text-slate-700">YOLOv8 framework</strong> layout.</span>
              </li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
};

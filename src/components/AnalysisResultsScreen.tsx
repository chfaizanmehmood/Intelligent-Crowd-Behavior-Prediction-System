import React, { useState } from 'react';
import { 
  BarChart3, 
  HelpCircle, 
  Download, 
  Settings, 
  TrendingUp,
  FileText,
  Eye,
  Activity,
  Maximize2,
  Lock,
  PieChart,
  Layers,
  Crosshair,
  Compass
} from 'lucide-react';
import { ActiveTab, CrowdMetrics } from '../types';
import { CrowdCanvas } from './CrowdCanvas';

interface AnalysisResultsScreenProps {
  onNavigate: (tab: ActiveTab) => void;
  uploadedVideo: {
    name: string;
    size: string;
    duration: string;
    state: 'NORMAL' | 'MODERATE' | 'WARNING' | 'DANGEROUS';
  } | null;
}

export const AnalysisResultsScreen: React.FC<AnalysisResultsScreenProps> = ({ 
  onNavigate,
  uploadedVideo
}) => {
  // HUD toggles
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showPaths, setShowPaths] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  
  const [toast, setToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const activeState = uploadedVideo ? uploadedVideo.state : 'MODERATE';
  const videoName = uploadedVideo ? uploadedVideo.name : 'subway_gate_04_rush.mp4';
  const videoDuration = uploadedVideo ? uploadedVideo.duration : '3:45 minutes';
  const videoUploadDate = '2026-06-15 14:30:22';

  const getMetrics = (): CrowdMetrics => {
    switch (activeState) {
      case 'NORMAL':
        return {
          density: 42,
          averageDensity: 42,
          peakDensity: 55,
          minDensity: 28,
          state: 'NORMAL',
          peopleCount: 48,
          movementSpeed: 1.1,
          flowDirection: 'Southeast (135°)',
          panicLevel: 'None detected',
          congestionPoints: 0,
          anomalyEvents: 0
        };
      case 'WARNING':
        return {
          density: 74,
          averageDensity: 69,
          peakDensity: 88,
          minDensity: 52,
          state: 'HIGH',
          peopleCount: 114,
          movementSpeed: 2.3,
          flowDirection: 'Northwest (45°)',
          panicLevel: 'Low',
          congestionPoints: 4,
          anomalyEvents: 1
        };
      case 'DANGEROUS':
        return {
          density: 91,
          averageDensity: 85,
          peakDensity: 98,
          minDensity: 70,
          state: 'DANGEROUS',
          peopleCount: 182,
          movementSpeed: 3.4,
          flowDirection: 'Chaotic Convergent (Sector G)',
          panicLevel: 'High',
          congestionPoints: 7,
          anomalyEvents: 3
        };
      case 'MODERATE':
      default:
        return {
          density: 68,
          averageDensity: 68,
          peakDensity: 82,
          minDensity: 45,
          state: 'MODERATE',
          peopleCount: 127,
          movementSpeed: 1.2,
          flowDirection: 'Northwest (45°)',
          panicLevel: 'None detected',
          congestionPoints: 2,
          anomalyEvents: 0
        };
    }
  };

  const metrics = getMetrics();

  return (
    <div className="space-y-8 animate-fade-in text-slate-700">
      
      {/* Toast Banner */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-700 text-brand-400 font-sans text-xs px-5 py-3.5 rounded-xl shadow-2xl backdrop-blur-md flex items-center gap-2">
          <span>⚡</span> {toast}
        </div>
      )}

      {/* Page Header */}
      <div className="border-b border-slate-200 pb-5">
        <h2 className="text-xl md:text-2xl font-bold font-display text-slate-950 tracking-wide">
          Optical Telemetry Analysis Results
        </h2>
        <p className="text-xs text-slate-500 font-sans mt-1">
          Detailed spatial occupancy matrices, centroid classification data, and localized behavioral risk maps.
        </p>
      </div>

      <div>
        <h3 className="text-[11px] font-sans font-bold tracking-wider text-slate-500 uppercase mb-4">
          Visual Spatial Processing Engine
        </h3>

        <div className="border border-slate-200 bg-white p-6 rounded-2xl space-y-6 shadow-sm">
          
          {/* Controls Segment Header */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <label className="block text-xs font-sans font-bold uppercase tracking-wider text-slate-500">
                Processed Real-Time Matrix Output
              </label>
              <p className="text-[11.5px] text-slate-500 font-mono mt-0.5">
                Active Resource Vector: <span className="text-brand-600 font-bold">{videoName}</span>
              </p>
            </div>

            {/* Micro HUD Controls - elegant indicators */}
            <div className="flex flex-wrap items-center gap-2">
              <button 
                onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
                className={`px-3 py-1.5 rounded-lg border font-sans text-[11px] font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  showBoundingBoxes 
                    ? 'bg-brand-50 border-brand-300 text-brand-700 font-semibold shadow-sm' 
                    : 'border-slate-200 text-slate-500 bg-transparent hover:bg-slate-50 hover:text-slate-700'
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${showBoundingBoxes ? 'bg-brand-600' : 'bg-slate-450'}`} />
                Bounding Coordinates
              </button>
              <button 
                onClick={() => setShowHeatmap(!showHeatmap)}
                className={`px-3 py-1.5 rounded-lg border font-sans text-[11px] font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  showHeatmap 
                    ? 'bg-brand-50 border-brand-300 text-brand-700 font-semibold shadow-sm' 
                    : 'border-slate-200 text-slate-500 bg-transparent hover:bg-slate-50 hover:text-slate-700'
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${showHeatmap ? 'bg-brand-600' : 'bg-slate-450'}`} />
                Spatial Heatmaps
              </button>
              <button 
                onClick={() => setShowPaths(!showPaths)}
                className={`px-3 py-1.5 rounded-lg border font-sans text-[11px] font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  showPaths 
                    ? 'bg-brand-50 border-brand-300 text-brand-700 font-semibold shadow-sm' 
                    : 'border-slate-200 text-slate-500 bg-transparent hover:bg-slate-50 hover:text-slate-700'
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${showPaths ? 'bg-brand-600' : 'bg-slate-450'}`} />
                Drift Vectors
              </button>
              <button 
                onClick={() => setShowGrid(!showGrid)}
                className={`px-3 py-1.5 rounded-lg border font-sans text-[11px] font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  showGrid 
                    ? 'bg-brand-50 border-brand-300 text-brand-700 font-semibold shadow-sm' 
                    : 'border-slate-200 text-slate-500 bg-transparent hover:bg-slate-50 hover:text-slate-700'
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${showGrid ? 'bg-brand-600' : 'bg-slate-450'}`} />
                System HUD Grid
              </button>
            </div>
          </div>

          {/* Canvas Component Block */}
          <div className="relative">
            <CrowdCanvas 
              state={activeState} 
              showBoundingBoxes={showBoundingBoxes}
              showHeatmap={showHeatmap}
              showPaths={showPaths}
              showGrid={showGrid}
            />
          </div>

          {/* Under-canvas timeline specs */}
          <div className="flex flex-col md:flex-row justify-between text-[11px] font-mono text-slate-400 border-b border-slate-100 pb-5 gap-3">
            <span>Logged Timestamp: <span className="text-slate-700 font-medium">{videoUploadDate}</span></span>
            <span>Recorded Timeline duration: <span className="text-slate-700 font-medium">{videoDuration}</span></span>
          </div>

          {/* THREE TELEMETRY INDEX CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 font-sans">
            
            {/* Box 1: CROWD DENSITY */}
            <div className="border border-slate-200 bg-slate-50/20 rounded-2xl p-6 flex flex-col justify-between">
              <span className="text-[10px] font-sans font-bold tracking-wider text-slate-400 uppercase leading-none">
                Aggregated Crowd Density
              </span>
              <div className="my-5 text-center bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-4xl font-display font-semibold text-brand-650">
                  {metrics.density}%
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-500 space-y-2">
                <div className="flex justify-between">
                  <span>Average Occupancy:</span>
                  <span className="text-slate-700 font-semibold">{metrics.averageDensity}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Peak Density Vector:</span>
                  <span className="text-slate-700 font-semibold">{metrics.peakDensity}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Minimum Measured:</span>
                  <span className="text-slate-700 font-semibold">{metrics.minDensity}%</span>
                </div>
              </div>
            </div>

            {/* Box 2: CROWD STATE */}
            <div className="border border-slate-200 bg-slate-50/20 rounded-2xl p-6 flex flex-col justify-between">
              <span className="text-[10px] font-sans font-bold tracking-wider text-slate-400 uppercase leading-none">
                Calculated Safety State
              </span>
              <div className="my-5 text-center bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <span className={`text-2xl font-display font-bold tracking-widest uppercase ${
                  metrics.state === 'DANGEROUS' ? 'text-red-600' : metrics.state === 'HIGH' || metrics.state === 'WARNING' ? 'text-amber-600' : 'text-emerald-600'
                }`}>
                  {metrics.state}
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-500 space-y-2">
                <div className="flex justify-between">
                  <span>Anomaly Risk Class:</span>
                  <span className="text-slate-700 font-sans font-semibold">
                    {metrics.state === 'DANGEROUS' ? 'Urgent Warning' : metrics.state === 'HIGH' ? 'Elevated Drift' : 'Safe/Nominal'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Confidence Index:</span>
                  <span className="text-slate-700 font-semibold">94.2%</span>
                </div>
                <div className="flex justify-between">
                  <span>Risk Metric Level:</span>
                  <span className="text-slate-700 font-semibold">
                    {metrics.state === 'DANGEROUS' ? 'EXTREME' : metrics.state === 'HIGH' ? 'MODERATE' : 'LOW'}
                  </span>
                </div>
              </div>
            </div>

            {/* Box 3: ANALYSIS STATUS */}
            <div className="border border-slate-200 bg-slate-50/20 rounded-2xl p-6 flex flex-col justify-between">
              <span className="text-[10px] font-sans font-bold tracking-wider text-slate-400 uppercase leading-none">
                Computation State
              </span>
              <div className="my-5 text-center bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-2xl font-display font-bold tracking-widest text-slate-800">
                  COMPLETE
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-500 space-y-2">
                <div className="flex justify-between">
                  <span>Frame Analysis progress:</span>
                  <span className="text-emerald-600 font-bold">100.0%</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Frame Passes:</span>
                  <span className="text-slate-700 font-semibold">6,750 frames</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Node Classifications:</span>
                  <span className="text-slate-700 font-semibold">{metrics.peopleCount * 9} points</span>
                </div>
              </div>
            </div>

          </div>

          {/* DETAILED ANALYSIS METRICS DATA */}
          <div className="border border-slate-200 bg-white rounded-xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
              <Activity className="h-4 w-4 text-slate-500" />
              <span className="text-xs font-sans font-bold text-slate-700 uppercase tracking-widest">
                Aggregated Telemetry Data Outlets
              </span>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-[11px] font-mono text-slate-500">
              <div className="space-y-3.5 pl-3 border-l-2 border-brand-500">
                <div className="flex justify-between">
                  <span className="text-slate-450 font-sans">Object Counts (Epoch Avg):</span>
                  <strong className="text-slate-800 font-bold font-sans text-sm">{metrics.peopleCount}</strong>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-slate-450 font-sans">Pedestrian Drift Speed:</span>
                  <strong className="text-slate-800 font-semibold">{metrics.movementSpeed} m/s</strong>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-slate-450 font-sans">Dominant Vector Axis:</span>
                  <strong className="text-slate-800 font-semibold">{metrics.flowDirection}</strong>
                </div>
              </div>

              <div className="space-y-3.5 pl-3 border-l-2 border-orange-400">
                <div className="flex justify-between font-mono">
                  <span className="text-slate-450 font-sans">Instability indicators:</span>
                  <strong className="text-slate-800 font-semibold">{metrics.panicLevel}</strong>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-slate-450 font-sans">Identified Bottlenecks:</span>
                  <strong className="text-slate-800 font-semibold">{metrics.congestionPoints} active zone</strong>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-slate-450 font-sans">Unusual Anomaly Events:</span>
                  <strong className="text-slate-800 font-semibold">{metrics.anomalyEvents} flags</strong>
                </div>
              </div>
            </div>
          </div>

          {/* CONTROL CTA BUTTONS */}
          <div className="flex flex-col md:flex-row gap-4 pt-4">
            
            <button
              id="results-view-predictions-btn"
              onClick={() => onNavigate('predictions')}
              className="flex-1 border border-brand-500 hover:border-brand-600 bg-brand-50 hover:bg-brand-600 hover:text-white text-brand-700 text-xs py-3.5 rounded-xl font-sans font-bold uppercase tracking-wider transition-all cursor-pointer text-center shadow-sm"
            >
              Analyze Behavior Predictions
            </button>

            <button
              id="results-export-report-btn"
              onClick={() => triggerToast("Generating localized CCTV risk telemetry PDF report...")}
              className="flex-1 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs py-3.5 rounded-xl font-sans font-semibold uppercase tracking-wider transition-all cursor-pointer text-center"
            >
              Export Comprehensive Report
            </button>

            <button
              id="results-download-data-btn"
              onClick={() => triggerToast("Compiling tabular CSV coordinates files for download...")}
              className="flex-1 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs py-3.5 rounded-xl font-sans font-semibold uppercase tracking-wider transition-all cursor-pointer text-center"
            >
              Download Tabular Data
            </button>

          </div>

        </div>
      </div>

    </div>
  );
};

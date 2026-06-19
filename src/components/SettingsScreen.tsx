import React, { useState } from 'react';
import { 
  Sliders, 
  Settings as SettingsIcon,
  ShieldCheck, 
  AlertTriangle, 
  Tv, 
  Database, 
  RefreshCw, 
  HelpCircle,
  ShieldAlert,
  Save,
  Wrench,
  Cpu
} from 'lucide-react';

interface SettingsScreenProps {
  onSettingsSaved?: (config: any) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onSettingsSaved }) => {
  // Alert threshold states
  const [alertThreshold, setAlertThreshold] = useState(70);
  
  // Alert types preferences state
  const [alertTypes, setAlertTypes] = useState({
    densitySpike: true,
    velocityDrops: true,
    turbulenceInversion: false,
    congestionAnomaly: true
  });

  // System behavior configurations state
  const [behaviorOptions, setBehaviorOptions] = useState({
    kalmanFiltering: true,
    deepPredictionEpochs: '60s',
    gpuComputeEngine: 'cuda_node_02',
    consequentFailoverRate: '3_frames'
  });

  // Display options
  const [displayPrefs, setDisplayPrefs] = useState({
    opacityHUD: 85,
    overlayFont: 'Mono default (JetBrains)',
    coordinatePrecision: 'medium'
  });

  // General project info
  const [projectTitle, setProjectTitle] = useState('ICBPS - Department of Computer Science & Engineering');
  const [databaseBackup, setDatabaseBackup] = useState('Daily (Scheduled)');

  // Toast status feedback
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const handleSaveConfiguration = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Operational parameters successfully updated and written to system configuration memory.");
    if (onSettingsSaved) {
      onSettingsSaved({
        alertThreshold,
        alertTypes,
        behaviorOptions,
        displayPrefs,
        projectTitle,
        databaseBackup
      });
    }
  };

  return (
    <div id="settings-screen-container" className="space-y-8 animate-fade-in text-slate-705 font-sans">
      
      {/* Toast Alert Banner */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-700 text-brand-400 font-sans text-xs px-5 py-3.5 rounded-xl shadow-2xl backdrop-blur-md">
          ⚡ {toast}
        </div>
      )}

      {/* Page Header */}
      <div className="border-b border-slate-200 pb-5">
        <h2 className="text-xl md:text-2xl font-bold font-display text-slate-950 tracking-wide">
          System Settings & Model Calibration
        </h2>
        <p className="text-xs text-slate-500 font-sans mt-1">
          Calibrate localized warning thresholds, adjust neural tracking parameters, choose alert priorities, and configure project parameters.
        </p>
      </div>

      <form onSubmit={handleSaveConfiguration} className="space-y-8">
        
        {/* ROW 1: ALERT THRESHOLD & ALERT TYPES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Card A: Alert threshold calibration */}
          <div className="border border-slate-200 bg-white p-6 rounded-2xl space-y-5 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <ShieldAlert className="h-5 w-5 text-brand-500" />
              <span className="text-xs font-sans font-bold uppercase tracking-wider text-slate-800">
                Alert Threshold Calibration
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-slate-500">Trigger Threshold Limit:</span>
                <span className="text-xl font-mono font-bold text-brand-600">{alertThreshold}%</span>
              </div>
              
              <input
                id="threshold-slider"
                type="range"
                min="50"
                max="95"
                step="5"
                value={alertThreshold}
                onChange={(e) => setAlertThreshold(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-500"
              />

              <div className="grid grid-cols-2 text-[10px] text-slate-400 font-mono">
                <span>Min limit: 50%</span>
                <span className="text-right">Max limit: 95%</span>
              </div>

              {/* Formula and impact summary */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-2 pointer-events-none select-none">
                <span className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-widest block">
                  Computed Safety Multipliers
                </span>
                <div className="space-y-1 text-[11px] font-mono text-slate-500">
                  <div className="flex justify-between">
                    <span>Critical saturation limit:</span>
                    <span className="text-slate-800 font-semibold">{alertThreshold}%</span>
                  </div>
                  <div className="flex justify-between text-amber-600">
                    <span>Warning trigger point (90% limit):</span>
                    <span className="font-semibold">{Math.round(alertThreshold * 0.9)}%</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Baseline safety gap margin:</span>
                    <span>{100 - alertThreshold}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card B: Choosing alert type preferences */}
          <div className="border border-slate-200 bg-white p-6 rounded-2xl space-y-5 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Sliders className="h-5 w-5 text-brand-500" />
              <span className="text-xs font-sans font-bold uppercase tracking-wider text-slate-800">
                Active System Alarms Selection
              </span>
            </div>

            <div className="space-y-4 text-xs font-sans">
              <span className="block text-[10.5px] text-slate-400 font-bold uppercase tracking-wide">
                Enable Alert Notifications For:
              </span>

              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={alertTypes.densitySpike}
                    onChange={(e) => setAlertTypes({ ...alertTypes, densitySpike: e.target.checked })}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand-650 focus:ring-brand-500 bg-white"
                  />
                  <div>
                    <span className="font-semibold text-slate-800 group-hover:text-brand-650 transition-colors block">
                      Sentinel Cluster Density Spikes
                    </span>
                    <span className="text-[10px] text-slate-450">
                      Exceeding calculated safety threshold coordinates within localized matrices.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={alertTypes.velocityDrops}
                    onChange={(e) => setAlertTypes({ ...alertTypes, velocityDrops: e.target.checked })}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand-650 focus:ring-brand-500 bg-white"
                  />
                  <div>
                    <span className="font-semibold text-slate-800 group-hover:text-brand-650 transition-colors block">
                      Ingress / Egress Velocity Drops
                    </span>
                    <span className="text-[10px] text-slate-450">
                      Sudden deceleration of movement vectors signifying spatial bottlenecks.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={alertTypes.turbulenceInversion}
                    onChange={(e) => setAlertTypes({ ...alertTypes, turbulenceInversion: e.target.checked })}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand-650 focus:ring-brand-500 bg-white"
                  />
                  <div>
                    <span className="font-semibold text-slate-800 group-hover:text-brand-650 transition-colors block">
                      Turbulent Vector Inversions
                    </span>
                    <span className="text-[10px] text-slate-450">
                      Chaotic bidirectional flow clashes suggesting high pressure congregation events.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={alertTypes.congestionAnomaly}
                    onChange={(e) => setAlertTypes({ ...alertTypes, congestionAnomaly: e.target.checked })}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand-650 focus:ring-brand-500 bg-white"
                  />
                  <div>
                    <span className="font-semibold text-slate-800 group-hover:text-brand-650 transition-colors block">
                      Corridor Congestion Faults
                    </span>
                    <span className="text-[10px] text-slate-450">
                      Static blockage calculations detected exceeding 45 consecutive frames.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

        </div>

        {/* ROW 2: SYSTEM BEHAVIOR OPTIONS & DISPLAY PREFERENCES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Card C: Behavior calibration options */}
          <div className="border border-slate-200 bg-white p-6 rounded-2xl space-y-5 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Cpu className="h-5 w-5 text-brand-500" />
              <span className="text-xs font-sans font-bold uppercase tracking-wider text-slate-800">
                Behavior Modeling Controls
              </span>
            </div>

            <div className="space-y-4 text-xs font-sans">
              
              {/* Option 1: Kalman Filtering estimation */}
              <label className="flex items-center justify-between gap-4 py-1.5 cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 block">Kalman Filtering Recurrence</span>
                  <span className="text-[10px] text-slate-500">Smooth path trajectories over consecutive camera hops.</span>
                </div>
                <input
                  type="checkbox"
                  checked={behaviorOptions.kalmanFiltering}
                  onChange={(e) => setBehaviorOptions({ ...behaviorOptions, kalmanFiltering: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-brand-650 focus:ring-brand-500 bg-white"
                />
              </label>

              {/* Option 2: Trajectory Prediction window */}
              <div className="flex items-center justify-between gap-4 py-1 border-t border-slate-100 pt-3">
                <div>
                  <span className="font-bold text-slate-850 block">Trajectory Prediction Window</span>
                  <span className="text-[10px] text-slate-500">Statistical timeline span for Markov sequence trends.</span>
                </div>
                <select
                  value={behaviorOptions.deepPredictionEpochs}
                  onChange={(e) => setBehaviorOptions({ ...behaviorOptions, deepPredictionEpochs: e.target.value })}
                  className="border border-slate-200 bg-slate-50 p-2 rounded-xl text-xs font-mono font-semibold text-slate-700 focus:outline-none"
                >
                  <option value="30s">30 seconds</option>
                  <option value="60s">60 seconds (Standard)</option>
                  <option value="120s">120 seconds</option>
                  <option value="300s">5 minutes</option>
                </select>
              </div>

              {/* Option 3: GPU Cloud Node */}
              <div className="flex items-center justify-between gap-4 py-1 border-t border-slate-100 pt-3">
                <div>
                  <span className="font-bold text-slate-850 block">CUDA Acceleration Node</span>
                  <span className="text-[10px] text-slate-500">Designated hardware container mapping optical coordinates.</span>
                </div>
                <select
                  value={behaviorOptions.gpuComputeEngine}
                  onChange={(e) => setBehaviorOptions({ ...behaviorOptions, gpuComputeEngine: e.target.value })}
                  className="border border-slate-200 bg-slate-50 p-2 rounded-xl text-xs font-mono font-semibold text-slate-700 focus:outline-none"
                >
                  <option value="cuda_node_01">GPU CUDA node_01</option>
                  <option value="cuda_node_02">GPU CUDA node_02 (Active)</option>
                  <option value="cpu_fallback">CPU fallback architecture</option>
                </select>
              </div>

            </div>
          </div>

          {/* Card D: Display preferences */}
          <div className="border border-slate-200 bg-white p-6 rounded-2xl space-y-5 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Tv className="h-5 w-5 text-brand-500" />
              <span className="text-xs font-sans font-bold uppercase tracking-wider text-slate-800">
                Display & HUD Layout Options
              </span>
            </div>

            <div className="space-y-4 text-xs font-sans">
              
              {/* Option 1: Opacity HUD slider */}
              <div className="space-y-2">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>Overlay Graphics Opacity:</span>
                  <span className="text-brand-600 font-mono">{displayPrefs.opacityHUD}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  step="5"
                  value={displayPrefs.opacityHUD}
                  onChange={(e) => setDisplayPrefs({ ...displayPrefs, opacityHUD: Number(e.target.value) })}
                  className="w-full h-1.2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-500"
                />
              </div>

              {/* Option 2: Coordinate precision level */}
              <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-4">
                <div>
                  <span className="font-bold text-slate-850 block">Coordinate Precision Float</span>
                  <span className="text-[10px] text-slate-500">Coordinate index floating numbers formatting structure.</span>
                </div>
                <select
                  value={displayPrefs.coordinatePrecision}
                  onChange={(e) => setDisplayPrefs({ ...displayPrefs, coordinatePrecision: e.target.value })}
                  className="border border-slate-200 bg-slate-50 p-2 rounded-xl text-xs font-mono font-semibold text-slate-700 focus:outline-none"
                >
                  <option value="low">Integers only (ID_204)</option>
                  <option value="medium">Float v1 (e.g. ID_204.2)</option>
                  <option value="high">Float v2 (e.g. ID_204.248)</option>
                </select>
              </div>

              {/* Option 3: HUD fonts style */}
              <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-4">
                <div>
                  <span className="font-bold text-slate-850 block">System HUD Default Font</span>
                  <span className="text-[10px] text-slate-500">Choice font structure rendering bounding overlays.</span>
                </div>
                <select
                  value={displayPrefs.overlayFont}
                  onChange={(e) => setDisplayPrefs({ ...displayPrefs, overlayFont: e.target.value })}
                  className="border border-slate-200 bg-slate-50 p-2 rounded-xl text-xs font-sans font-semibold text-slate-700 focus:outline-none"
                >
                  <option value="JetBrains Mono">JetBrains Mono overlay (Standard)</option>
                  <option value="System monospace">System Default monospace</option>
                  <option value="Inter Pro">Inter proportional UI font</option>
                </select>
              </div>

            </div>
          </div>

        </div>

        {/* CONTAINER 3: COMPOSITE PROJECT SETTINGS */}
        <div className="border border-slate-200 bg-white p-6 rounded-2xl space-y-5 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Database className="h-5 w-5 text-brand-500" />
            <span className="text-xs font-sans font-bold uppercase tracking-wider text-slate-800">
              Composite Project Settings
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-sans">
            <div>
              <label className="block text-slate-500 font-bold mb-2 uppercase tracking-wide text-[10.5px]">
                Active Research Context Title
              </label>
              <input
                type="text"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                placeholder="e.g. ICBPS - Department of Computer Science & Engineering"
                className="w-full border border-slate-200 bg-slate-50 px-4 py-3 rounded-xl text-slate-800 placeholder-slate-450 font-sans focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-bold mb-2 uppercase tracking-wide text-[10.5px]">
                Risk Matrix Telemetry Database Log Backups
              </label>
              <select
                value={databaseBackup}
                onChange={(e) => setDatabaseBackup(e.target.value)}
                className="w-full border border-slate-200 bg-slate-50 px-4 py-3 rounded-xl text-slate-700 font-sans focus:outline-none focus:border-brand-500"
              >
                <option value="Daily (Scheduled)">Daily incremental synchronization (Scheduled)</option>
                <option value="Hourly (High-frequency)">Hourly high-frequency backups (Research mode)</option>
                <option value="Weekly">Weekly consolidated catalog archiving</option>
                <option value="None">Disabled local cache backups</option>
              </select>
            </div>
          </div>
        </div>

        {/* BOTTOM CTA: SAVE AND RESET OPTION */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          
          <button
            id="settings-save-btn"
            type="submit"
            className="flex-1 bg-brand-600 hover:bg-brand-700 text-white font-sans text-xs py-4 rounded-xl font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Calibration Configuration
          </button>

          <button
            id="settings-reset-all-btn"
            type="button"
            onClick={() => {
              setAlertThreshold(70);
              setAlertTypes({
                densitySpike: true,
                velocityDrops: true,
                turbulenceInversion: false,
                congestionAnomaly: true
              });
              setBehaviorOptions({
                kalmanFiltering: true,
                deepPredictionEpochs: '60s',
                gpuComputeEngine: 'cuda_node_02',
                consequentFailoverRate: '3_frames'
              });
              setDisplayPrefs({
                opacityHUD: 85,
                overlayFont: 'Mono default (JetBrains)',
                coordinatePrecision: 'medium'
              });
              setProjectTitle('ICBPS - Department of Computer Science & Engineering');
              setDatabaseBackup('Daily (Scheduled)');
              showToast("System configurations rolled back to factory defaults.");
            }}
            className="border border-slate-250 hover:bg-slate-50 text-slate-550 font-sans text-xs py-4 px-6 rounded-xl uppercase tracking-wider transition-all cursor-pointer font-semibold"
          >
            Restore Defaults
          </button>

        </div>

      </form>

    </div>
  );
};

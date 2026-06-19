import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  HelpCircle,
  Clock, 
  Sliders,
  FileText,
  Activity,
  ChevronRight,
  ShieldAlert,
  Compass,
  Play,
  PlayCircle,
  TrendingUp,
  RefreshCw,
  Layers,
  ArrowRightLeft
} from 'lucide-react';
import { ActiveTab, AlertItem, INITIAL_ALERT_HISTORY } from '../types';

interface PredictionsAlertsScreenProps {
  onNavigate: (tab: ActiveTab) => void;
  systemState: 'NORMAL' | 'MODERATE' | 'WARNING' | 'DANGEROUS';
  onSystemStateChange: (state: 'NORMAL' | 'MODERATE' | 'WARNING' | 'DANGEROUS') => void;
}

// Interconnected sector nodes for station flow simulation
interface StationNode {
  id: string;
  name: string;
  baseDensity: number; // base percentage density
  multiplier: number;  // how fast density climbs over time
}

const STATION_NODES: StationNode[] = [
  { id: 'gates', name: 'Sector Alpha Ingress Gates', baseDensity: 32, multiplier: 0.4 },
  { id: 'corridor', name: 'West Escalator Access Corridor', baseDensity: 45, multiplier: 1.1 },
  { id: 'escalator', name: 'Sector B Escalator Platforms', baseDensity: 52, multiplier: 1.8 },
  { id: 'platform', name: 'Commuter Exchange Platform', baseDensity: 38, multiplier: 0.9 },
  { id: 'exits', name: 'East Exit Corridors', baseDensity: 28, multiplier: 1.5 },
];

export const PredictionsAlertsScreen: React.FC<PredictionsAlertsScreenProps> = ({
  onNavigate,
  systemState,
  onSystemStateChange
}) => {
  // 1. Prediction Simulation Timeline States
  const [forecastOffset, setForecastOffset] = useState<number>(15); // slider from 0 to 60 minutes
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [countdown, setCountdown] = useState(60);
  const [toast, setToast] = useState<string | null>(null);

  // 2. Interactive Transition Matrix Weights
  const [matrixWeights, setMatrixWeights] = useState({
    gateToEscalator: 0.55, // transition probability gates -> escalator corridor
    escalatorToPlatform: 0.40, // escalator -> platform
    exitClearanceRate: 0.75, // clearance rate at East Exits
  });

  // 3. Current active scenario preset setting
  const [activeScenario, setActiveScenario] = useState<string>('nominal');

  // Trigger scenario presets
  const applyScenarioPreset = (preset: string) => {
    setActiveScenario(preset);
    switch (preset) {
      case 'nominal':
        setMatrixWeights({ gateToEscalator: 0.55, escalatorToPlatform: 0.40, exitClearanceRate: 0.75 });
        onSystemStateChange('NORMAL');
        setForecastOffset(15);
        triggerToast("Coded configuration: Nominal Midday flow activated.");
        break;
      case 'rush_hour':
        setMatrixWeights({ gateToEscalator: 0.85, escalatorToPlatform: 0.75, exitClearanceRate: 0.50 });
        onSystemStateChange('WARNING');
        setForecastOffset(30);
        triggerToast("Coded configuration: Peak commute rush simulated.");
        break;
      case 'evacuation':
        setMatrixWeights({ gateToEscalator: 0.20, escalatorToPlatform: 0.85, exitClearanceRate: 0.90 });
        onSystemStateChange('MODERATE');
        setForecastOffset(5);
        triggerToast("Coded configuration: Platform evacuation route active.");
        break;
      case 'blockage':
        setMatrixWeights({ gateToEscalator: 0.90, escalatorToPlatform: 0.95, exitClearanceRate: 0.20 });
        onSystemStateChange('DANGEROUS');
        setForecastOffset(45);
        triggerToast("Coded configuration: Saturated platform emergency active.");
        break;
      default:
        break;
    }
  };

  // Autoplay simulation timer
  useEffect(() => {
    let playInterval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      playInterval = setInterval(() => {
        setForecastOffset((prev) => {
          if (prev >= 60) return 0;
          return prev + 5;
        });
      }, 1000);
    }
    return () => {
      if (playInterval) clearInterval(playInterval);
    };
  }, [isPlaying]);

  // Model update countdown simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) return 60;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const currentLocalTime = "14:35:42";

  // Calculate simulated node densities dynamically under current sliders and inputs
  const simulatedNodes = useMemo(() => {
    return STATION_NODES.map(node => {
      // Calculate dynamic drift based on matrix weight parameters
      let modifier = 1.0;
      if (node.id === 'corridor') modifier = matrixWeights.gateToEscalator * 2;
      if (node.id === 'escalator') modifier = (matrixWeights.gateToEscalator + matrixWeights.escalatorToPlatform) * 1.5;
      if (node.id === 'platform') modifier = matrixWeights.escalatorToPlatform * 2.5;
      if (node.id === 'exits') modifier = (1.1 - matrixWeights.exitClearanceRate) * 3.0;

      // Density calculation recursively using logarithmic decay or trajectory offset multiplier
      const calculatedIncrease = node.multiplier * forecastOffset * modifier;
      const density = Math.min(100, Math.round(node.baseDensity + calculatedIncrease));

      // Determine safety tier tag
      let status: 'SAFE' | 'WARNING' | 'CRITICAL' = 'SAFE';
      if (density >= 85) status = 'CRITICAL';
      else if (density >= 65) status = 'WARNING';

      return {
        ...node,
        density,
        status,
      };
    });
  }, [forecastOffset, matrixWeights]);

  // Derive dynamic average systemic crowd load and alert triggers
  const systemicAverageLoad = useMemo(() => {
    const total = simulatedNodes.reduce((acc, curr) => acc + curr.density, 0);
    return Math.round(total / simulatedNodes.length);
  }, [simulatedNodes]);

  const derivedSystemState = useMemo(() => {
    if (systemicAverageLoad >= 80) return 'DANGEROUS';
    if (systemicAverageLoad >= 65) return 'WARNING';
    if (systemicAverageLoad >= 50) return 'MODERATE';
    return 'NORMAL';
  }, [systemicAverageLoad]);

  // Synchronize layout triggers with the simulated calculated systemic average value
  useEffect(() => {
    if (derivedSystemState !== systemState) {
      onSystemStateChange(derivedSystemState);
    }
  }, [derivedSystemState, onSystemStateChange, systemState]);

  // Dynamic forecasting accuracy confidence index
  const confidence = useMemo(() => {
    const variance = (matrixWeights.gateToEscalator + matrixWeights.escalatorToPlatform) / 2;
    const offsetNoise = forecastOffset * 0.12; 
    let base = 96.5 - offsetNoise;
    if (variance > 0.8) base -= 4.2;
    if (systemState === 'DANGEROUS') base -= 2.1;
    return Math.max(76.4, Number(base.toFixed(1)));
  }, [forecastOffset, matrixWeights, systemState]);

  // Active simulated alerts table mapping
  const simulatedAlerts = useMemo((): AlertItem[] => {
    const alerts: AlertItem[] = [];
    simulatedNodes.forEach(node => {
      if (node.status === 'CRITICAL') {
        alerts.push({
          timestamp: '2026-06-15 14:35:12',
          alertType: `Critical Crowd Crush - ${node.name}`,
          severity: 'CRITICAL',
          status: 'Active'
        });
      } else if (node.status === 'WARNING') {
        alerts.push({
          timestamp: '2026-06-15 14:35:40',
          alertType: `Sustained Congestion Risk - ${node.name}`,
          severity: 'MODERATE',
          status: 'Active'
        });
      }
    });
    return alerts;
  }, [simulatedNodes]);

  // Compass stroke calculations for Confidence Gauge
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (confidence / 100) * circumference;

  return (
    <div className="space-y-8 animate-fade-in text-slate-700">
      
      {/* Toast Alert Banner */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-700 text-brand-400 font-sans text-xs px-5 py-3.5 rounded-xl shadow-2xl backdrop-blur-md">
          ⚡ {toast}
        </div>
      )}

      {/* Page Header Layout */}
      <div className="border-b border-slate-200 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold font-display text-slate-950 tracking-wide">
            Behavior Predictions & Active Safeguards
          </h2>
          <p className="text-xs text-slate-500 font-sans mt-1">
            Simulate Markov chain trajectory forecasts, transition rate matrices, and real-time localized alert logs on top of variable corridor flows.
          </p>
        </div>
        <div className="shrink-0 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg font-mono text-[10px] text-slate-500 flex items-center gap-2 select-none">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          DECISION ALGORITHM ACTIVE
        </div>
      </div>

      {/* EXECUTIVE SUMMARY TELEMETRY CARDS (NEW ADDITION) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Final Crowd Prediction */}
        <div className="border border-slate-200 bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-md transition-all flex flex-col justify-between min-h-[220px]">
          <div className="flex justify-between items-start">
            <div className="space-y-1 select-none">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Core Prediction</span>
              <h4 className="text-xs font-sans font-extrabold text-slate-900 uppercase tracking-wider">Final Crowd Load</h4>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-brand-50 border border-brand-200 text-brand-700 font-mono text-[9px] font-bold tracking-wider animate-pulse select-none">LIVE</span>
          </div>

          <div className="flex items-center gap-4 my-3">
            {/* Custom high-fidelity Circular Progress Ring */}
            <div className="relative flex items-center justify-center shrink-0 w-20 h-20 select-none">
              <svg className="w-18 h-18 transform -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="32" className="text-slate-100/80" strokeWidth="6" stroke="currentColor" fill="transparent" />
                <circle cx="40" cy="40" r="32" 
                  className={`transition-all duration-350 ${
                    systemicAverageLoad >= 80 ? 'text-rose-500' : systemicAverageLoad >= 65 ? 'text-amber-500' : 'text-emerald-500'
                  }`} 
                  strokeWidth="6" 
                  strokeDasharray={2 * Math.PI * 32} 
                  strokeDashoffset={2 * Math.PI * 32 - (systemicAverageLoad / 100) * (2 * Math.PI * 32)} 
                  strokeLinecap="round" 
                  stroke="currentColor" 
                  fill="transparent" 
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-lg font-mono font-extrabold text-slate-900 leading-none">{systemicAverageLoad}%</span>
                <span className="text-[7.5px] font-sans font-bold uppercase tracking-wider text-slate-400 mt-0.5">EST. LOAD</span>
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] font-mono text-slate-400 uppercase block tracking-wide select-none">Active Influx State</span>
              <span className="text-[11px] text-slate-600 leading-normal font-sans font-medium">
                Predicted loading at +{forecastOffset}m matches {systemicAverageLoad >= 75 ? 'critical surges' : 'normal dispersion factors'}.
              </span>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3 text-[10px] text-slate-400 flex justify-between select-none">
            <span>Primary Calibration Inflow</span>
            <span className="font-semibold text-slate-800 font-mono">{(matrixWeights.gateToEscalator * 100).toFixed(0)}% weight</span>
          </div>
        </div>

        {/* Card 2: Risk Level and Safety Threat Indices */}
        <div className="border border-slate-200 bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-md transition-all flex flex-col justify-between min-h-[220px]">
          <div className="flex justify-between items-start">
            <div className="space-y-1 select-none">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Threat Rating</span>
              <h4 className="text-xs font-sans font-extrabold text-slate-900 uppercase tracking-wider">Alert Status Risk</h4>
            </div>
            <span className={`px-2 py-0.5 rounded-md font-mono text-[9px] font-bold border select-none ${
              derivedSystemState === 'DANGEROUS' ? 'bg-rose-50 text-rose-750 border-rose-200 animate-pulse' 
              : derivedSystemState === 'WARNING' ? 'bg-amber-50 text-amber-750 border-amber-200'
              : 'bg-emerald-50 text-emerald-750 border-emerald-200'
            }`}>
              {derivedSystemState}
            </span>
          </div>

          <div className="flex items-center gap-4 my-3">
            <div className="relative flex items-center justify-center shrink-0 w-20 h-10 overflow-hidden select-none">
              {/* Simulated semicircular Arc Meter */}
              <svg className="w-20 h-20 absolute -top-4" viewBox="0 0 100 100">
                <path d="M 15 50 A 35 35 0 0 1 85 50" fill="none" stroke="#f1f5f9" strokeWidth="7" strokeLinecap="round" />
                <path d="M 15 50 A 35 35 0 0 1 85 50" fill="none" 
                  stroke={derivedSystemState === 'DANGEROUS' ? '#f43f5e' : derivedSystemState === 'WARNING' ? '#f59e0b' : '#10b981'} 
                  strokeWidth="7" 
                  strokeDasharray="110"
                  strokeDashoffset={110 - (systemicAverageLoad / 100) * 110}
                  strokeLinecap="round" 
                />
              </svg>
              <div className="absolute bottom-0 text-center flex flex-col items-center">
                <span className="text-[8px] font-sans font-bold uppercase text-slate-400 leading-none">SEVERITY</span>
                <span className={`text-[13px] font-mono font-extrabold leading-none mt-0.5 ${
                  derivedSystemState === 'DANGEROUS' ? 'text-rose-500 animate-pulse' : derivedSystemState === 'WARNING' ? 'text-amber-500' : 'text-emerald-500'
                }`}>
                  {derivedSystemState === 'DANGEROUS' ? 'CRITICAL' : derivedSystemState === 'WARNING' ? 'ELEVATED' : 'STABLE'}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[9px] font-mono text-slate-400 uppercase block tracking-wide select-none">Trajectory Area Drift</span>
              <span className="text-[11px] text-slate-600 leading-normal font-sans font-medium">
                Flow vector calculations indicate {systemicAverageLoad >= 70 ? 'heightened backlog pressure' : 'orderly linear mobility pattern'}.
              </span>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3 text-[10px] text-slate-400 flex justify-between select-none">
            <span>Evacuation Limit</span>
            <span className="font-semibold text-rose-500 font-mono">85% density</span>
          </div>
        </div>

        {/* Card 3: Dispatcher Alert Trigger Queue */}
        <div className="border border-slate-200 bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-md transition-all flex flex-col justify-between min-h-[220px]">
          <div className="flex justify-between items-start">
            <div className="space-y-1 select-none">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Trigger Queue</span>
              <h4 className="text-xs font-sans font-extrabold text-slate-900 uppercase tracking-wider">Alert Descriptors</h4>
            </div>
            <span className={`h-2 w-2 rounded-full mt-1.5 ${simulatedAlerts.length > 0 ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`} />
          </div>

          <div className="my-2.5 space-y-2">
            <div className="flex items-baseline justify-between select-none">
              <span className="text-2xl font-mono font-extrabold text-slate-900 leading-none">
                {simulatedAlerts.length < 10 ? `0${simulatedAlerts.length}` : simulatedAlerts.length}
              </span>
              <span className="text-[8.5px] font-mono text-slate-400 uppercase tracking-wider font-bold">ACTIVE WARNINGS</span>
            </div>

            {/* Custom inline progress mini-bar charts showing real-time sub-sector density values */}
            <div className="h-7 flex items-end gap-1.5 select-none pt-1">
              {simulatedNodes.map((n, i) => (
                <div key={i} className="flex-1 group/bar relative">
                  <div 
                    className={`w-full rounded-t-xs transition-all duration-300 ${
                      n.status === 'CRITICAL' ? 'bg-rose-500 hover:bg-rose-600' : n.status === 'WARNING' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-500/60 hover:bg-emerald-500'
                    }`}
                    style={{ height: `${Math.max(20, n.density * 0.22)}%` }}
                  />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover/bar:block bg-slate-900 text-white text-[8px] font-mono px-1.5 py-0.5 rounded whitespace-nowrap z-30 shadow-md">
                    Sec {i+1}: {n.density}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3 text-[10px] text-slate-400 flex justify-between select-none">
            <span>Inter-node Streams</span>
            <span className="font-semibold text-slate-800 font-mono">5 Channels</span>
          </div>
        </div>

        {/* Card 4: Brief Analysis Summary with mini sparkline graph */}
        <div className="border border-slate-200 bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-md transition-all flex flex-col justify-between min-h-[220px]">
          <div className="flex justify-between items-start">
            <div className="space-y-1 select-none">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Analysis Summary</span>
              <h4 className="text-xs font-sans font-extrabold text-slate-900 uppercase tracking-wider">Predictive Index</h4>
            </div>
            <span className="p-1 px-1.5 rounded bg-slate-50 border border-slate-150 text-slate-600 font-mono text-[9px] font-bold select-none">CONF: {confidence}%</span>
          </div>

          <div className="my-2 space-y-2">
            <p className="text-[11px] text-slate-500 leading-normal line-clamp-2">
              Drift parameters project {derivedSystemState === 'DANGEROUS' ? 'severe congestion backlogs and platform saturation' : derivedSystemState === 'WARNING' ? 'elevated transit bottlenecks across escalators' : 'orderly linear commute flows with negligible friction'}.
            </p>

            {/* Simulated Live Mini-Trend Sparkline Graph */}
            <div className="h-6 bg-slate-50 border border-slate-150 rounded-lg p-1.5 relative flex items-end overflow-hidden select-none">
              <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                <path
                  d={`M 0 16 Q 20 ${18 - matrixWeights.gateToEscalator * 10} 40 ${16 - matrixWeights.escalatorToPlatform * 10} T 80 ${19 - matrixWeights.exitClearanceRate * 12} T 100 12`}
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="100" cy="12" r="2.5" fill="#4f46e5" />
              </svg>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3 text-[10px] text-slate-400 flex justify-between select-none">
            <span>Core Model Kernel</span>
            <span className="font-semibold text-slate-800 font-mono">Markov_v3.8</span>
          </div>
        </div>

      </div>

      {/* CORE INTERACTIVE WIDGET: FORECAST SIMULATION BOARD */}
      <div className="border border-slate-200 bg-white rounded-2xl shadow-sm overflow-hidden">
        
        {/* Widget Header */}
        <div className="border-b border-slate-100 bg-slate-50/50 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xs font-sans font-bold uppercase tracking-wider text-slate-800">
              Interactive Markov Flow Simulator & Map
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Drag the timeline slider or adjust the transition parameters below to trace crowd drift vectors recursively over time.
            </p>
          </div>

          {/* Quick Scenario Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-1">Pre-Sets:</span>
            <button
              onClick={() => applyScenarioPreset('nominal')}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-lg border transition-all cursor-pointer ${
                activeScenario === 'nominal'
                  ? 'bg-brand-50 border-brand-300 text-brand-700 font-semibold'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Steady State
            </button>
            <button
              onClick={() => applyScenarioPreset('rush_hour')}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-lg border transition-all cursor-pointer ${
                activeScenario === 'rush_hour'
                  ? 'bg-amber-50 border-amber-300 text-amber-700 font-semibold'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Peak Rush Hour
            </button>
            <button
              onClick={() => applyScenarioPreset('blockage')}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-lg border transition-all cursor-pointer ${
                activeScenario === 'blockage'
                  ? 'bg-red-50 border-red-300 text-red-700 font-semibold animate-pulse'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Escalator Halt
            </button>
          </div>
        </div>

        {/* 1. Interactive Dedicated Visual Telemetry Grid Layout */}
        <div className="p-6 bg-slate-50/50 border-b border-slate-150 relative">
          <span className="text-[9px] font-mono text-slate-450 uppercase tracking-widest block mb-4 select-none font-bold">
            Predictive Flow Grid (Single Ingested Feed Calibration)
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Widget A: Computed Trajectory Projection Matrix */}
            <div className="border border-slate-200 bg-white rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex flex-col h-full justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Vector Linkages</span>
                <h4 className="text-xs font-sans font-bold text-slate-800 uppercase tracking-wider mt-1">Computed Trajectory Projection Matrix</h4>
              </div>
              
              <div className="my-4 bg-slate-900 rounded-lg p-3 font-mono text-[9px] text-emerald-400 space-y-2 border border-slate-850 relative overflow-hidden h-32 flex flex-col justify-center">
                <div className="grid grid-cols-3 gap-1.5 text-center relative z-10">
                  {[
                    { val: "[0.84, 0.12]", flow: true },
                    { val: "[0.15, 0.45]", flow: false },
                    { val: "[0.02, 0.18]", flow: true },
                    { val: "[0.31, 0.60]", flow: false },
                    { val: "[0.55, 0.22]", flow: true },
                    { val: "[0.12, 0.90]", flow: false },
                    { val: "[0.00, 0.35]", flow: false },
                    { val: "[0.44, 0.75]", flow: true },
                    { val: "[0.21, 0.05]", flow: false }
                  ].map((cell, idx) => (
                    <div 
                      key={idx} 
                      className={`p-1 box-border rounded flex flex-col items-center justify-center border ${
                        cell.flow 
                          ? 'bg-emerald-500/10 border-emerald-500/60 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.15)]' 
                          : 'bg-slate-950 border-slate-800 text-slate-600'
                      }`}
                    >
                      <span className="text-[8px] font-bold block">{cell.val}</span>
                      <span className="text-[6.5px] uppercase mt-0.5 tracking-tighter opacity-80">
                        {cell.flow ? '• Active' : 'Idle'}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="absolute inset-0 " />
              </div>

              <div className="text-[10.5px] text-slate-500 font-sans leading-normal">
                Active trajectory flow vector linkages mapped across current coordinate intersections.
              </div>
            </div>

            {/* Widget B: Active Probability Vector Trend */}
            <div className="border border-slate-200 bg-white rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex flex-col h-full justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Probability State</span>
                <h4 className="text-xs font-sans font-bold text-slate-800 uppercase tracking-wider mt-1">Active Probability Vector Trend</h4>
              </div>

              <div className="my-3 space-y-3.5">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-sans font-bold text-xs select-none">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Steady Operational Flow
                </div>

                <div className="h-16 bg-slate-50/80 rounded-xl border border-slate-150 p-2 flex flex-col justify-between relative overflow-hidden">
                  <span className="text-[8px] font-mono text-slate-400">PROBABILITY DENSITIES (60s HISTORY)</span>
                  <svg className="w-full h-8 overflow-visible" viewBox="0 0 100 20" preserveAspectRatio="none">
                    <path
                      d="M 0 15 Q 15 5 30 14 T 60 4 T 90 12 T 100 6"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                    />
                    <circle cx="100" cy="6" r="2.5" fill="#10b981" />
                  </svg>
                </div>
              </div>

              <div className="text-[10.5px] text-slate-500 font-sans leading-normal">
                Real-time probability drift modeling remains within acceptable limit boundaries.
              </div>
            </div>

            {/* Widget C: Systemic Occupancy Dashboard */}
            <div className="border border-slate-200 bg-white rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex flex-col h-full justify-between lg:col-span-1">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Occupancy Load</span>
                <h4 className="text-xs font-sans font-bold text-slate-800 uppercase tracking-wider mt-1">Systemic Occupancy Dashboard</h4>
              </div>

              <div className="my-3 flex items-center justify-center gap-4">
                <div className="relative flex items-center justify-center h-20 w-20 shrink-0 select-none">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
                    <circle
                      cx="40"
                      cy="40"
                      r="30"
                      className="text-slate-100"
                      strokeWidth="6"
                      stroke="currentColor"
                      fill="transparent"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="30"
                      className="text-emerald-500"
                      strokeWidth="6"
                      strokeDasharray={2 * Math.PI * 30}
                      strokeDashoffset={(1 - 0.59) * (2 * Math.PI * 30)}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-lg font-mono font-bold text-slate-900 leading-none">59%</span>
                    <span className="text-[7.5px] font-sans font-bold uppercase tracking-wider text-slate-400 mt-0.5">CAPACITY</span>
                  </div>
                </div>

                <div className="flex-1 space-y-1">
                  <div className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md inline-block select-none">
                    MODERATE
                  </div>
                  <p className="text-[9px] font-mono text-slate-550">Baseline Target: 70.0% max</p>
                </div>
              </div>

              <p className="text-[10.5px] text-slate-500 font-sans leading-normal pt-2 border-t border-slate-100">
                Predictive telemetry metrics trace simulated drift loads along major corridor junctions. Occupancy reflects values across localized sub-sectors based on active transition probabilities.
              </p>
            </div>

            {/* Widget D: Tracking Telemetry Mini-Cards */}
            <div className="border border-slate-200 bg-white rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex flex-col h-full justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Micro-Indices</span>
                <h4 className="text-xs font-sans font-bold text-slate-800 uppercase tracking-wider mt-1">Tracking Telemetry Mini-Cards</h4>
              </div>

              <div className="grid grid-cols-2 gap-3.5 my-3">
                {/* Mini-Card 1: Recursive Coordinates */}
                <div className="bg-slate-50/60 border border-slate-150 rounded-xl p-3 flex flex-col justify-between space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[10.5px] font-mono font-bold text-brand-650 bg-brand-50 px-2 py-1 rounded-lg w-max select-none">
                    <Compass className="h-3 w-3 shrink-0" />
                    +15 mins step
                  </div>
                  <p className="text-[9.5px] font-sans text-slate-550 leading-snug">
                    Bounding tracking centers computed dynamically matching timeline step.
                  </p>
                </div>

                {/* Mini-Card 2: Flow Discrepancy */}
                <div className="bg-slate-50/60 border border-slate-150 rounded-xl p-3 flex flex-col justify-between space-y-1.5">
                  <div className="text-sm font-mono font-extrabold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg w-max select-none">
                    -20%
                  </div>
                  <p className="text-[9.5px] font-sans text-slate-550 leading-snug">
                    Ingress probability vectors relative to exits report a matching flow deviation factor.
                  </p>
                </div>
              </div>

              <div className="text-[10.5px] text-slate-500 font-sans leading-normal">
                Additional micro-factors contributing to trajectory calibration loops.
              </div>
            </div>

          </div>
        </div>

        {/* 2. Interactive Timeline Slider Grid */}
        <div className="p-6 border-b border-slate-100 bg-white grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          
          <div className="md:col-span-3 space-y-4">
            <div className="flex justify-between items-baseline select-none">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-brand-500" />
                Forecast Time Duration Offset:
              </span>
              <span className="text-base font-mono font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">
                +{forecastOffset} minutes from current epoch
              </span>
            </div>

            {/* Slider container */}
            <div className="flex items-center gap-4">
              <button
                id="play-simulation-btn"
                onClick={() => setIsPlaying(!isPlaying)}
                className={`h-9 w-9 border flex items-center justify-center rounded-lg cursor-pointer transition-all ${
                  isPlaying ? 'bg-amber-50 border-amber-300 text-amber-700' : 'bg-brand-50 border-brand-300 text-brand-700 hover:bg-brand-100'
                }`}
              >
                {isPlaying ? (
                  <span className="h-3 w-3 bg-amber-700 rounded-xs animate-pulse" />
                ) : (
                  <Play className="h-5 w-5 fill-brand-700 text-brand-700" />
                )}
              </button>

              <div className="flex-1 space-y-1">
                <input
                  id="forecast-timeline-slider"
                  type="range"
                  min="0"
                  max="60"
                  step="5"
                  value={forecastOffset}
                  onChange={(e) => {
                    setForecastOffset(Number(e.target.value));
                    setIsPlaying(false);
                  }}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                />
                <div className="flex justify-between text-[9.5px] font-mono text-slate-400">
                  <span>Current Time (0m)</span>
                  <span>+15m</span>
                  <span>+30m</span>
                  <span>+45m</span>
                  <span>+60m (Limit)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Forecast state outcome card */}
          <div className="border border-slate-200/80 bg-slate-50/50 p-4 rounded-xl space-y-1 text-center flex flex-col justify-center">
            <span className="text-[10px] text-slate-400 font-sans block uppercase font-bold tracking-wider">Systemic Load Average</span>
            <span className={`text-2xl font-mono font-bold block ${
              systemicAverageLoad >= 80 ? 'text-red-500' : systemicAverageLoad >= 65 ? 'text-amber-500' : 'text-emerald-500'
            }`}>
              {systemicAverageLoad}%
            </span>
            <span className="text-[9px] uppercase font-semibold text-slate-500">
              State: {derivedSystemState}
            </span>
          </div>

        </div>

        {/* 3. Transition Matrix Rates - Calibrate Flow probabilities directly */}
        <div className="p-6 bg-slate-50/20 grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-sans font-bold text-slate-500 uppercase tracking-wider">
                Gates → Escalator Flow Rate
              </span>
              <span className="text-xs font-mono font-semibold text-slate-800">
                {(matrixWeights.gateToEscalator * 100).toFixed(0)}% weight
              </span>
            </div>
            <input
              type="range"
              min="0.10"
              max="0.95"
              step="0.05"
              value={matrixWeights.gateToEscalator}
              onChange={(e) => setMatrixWeights({ ...matrixWeights, gateToEscalator: Number(e.target.value) })}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-600"
            />
            <p className="text-[10px] text-slate-400">
              Markov transition probability mapping from ingress turnstile gates to major corridor routes.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-sans font-bold text-slate-500 uppercase tracking-wider">
                Escalator → Platform Friction
              </span>
              <span className="text-xs font-mono font-semibold text-slate-800">
                {(matrixWeights.escalatorToPlatform * 100).toFixed(0)}% weight
              </span>
            </div>
            <input
              type="range"
              min="0.10"
              max="0.95"
              step="0.05"
              value={matrixWeights.escalatorToPlatform}
              onChange={(e) => setMatrixWeights({ ...matrixWeights, escalatorToPlatform: Number(e.target.value) })}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-600"
            />
            <p className="text-[10px] text-slate-400">
              Coefficient multiplier reflecting structural platform backlog and localized stair bottlenecks.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-sans font-bold text-slate-500 uppercase tracking-wider">
                East Exits Clearance Rate
              </span>
              <span className="text-xs font-mono font-semibold text-slate-800">
                {(matrixWeights.exitClearanceRate * 100).toFixed(0)}% clearance
              </span>
            </div>
            <input
              type="range"
              min="0.10"
              max="0.95"
              step="0.05"
              value={matrixWeights.exitClearanceRate}
              onChange={(e) => setMatrixWeights({ ...matrixWeights, exitClearanceRate: Number(e.target.value) })}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-600"
            />
            <p className="text-[10px] text-slate-400">
              Average evacuation throughput rate mapping egress clearing capacity. Higher clearance prevents backlog.
            </p>
          </div>

        </div>

      </div>

      {/* PROBABILITY ACCURACY ACCORDION AND GAUGE PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Dynamic explanations */}
        <div className="lg:col-span-2 border border-slate-200 bg-white p-6 rounded-2xl flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
            <h4 className="text-xs font-sans font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
              Computed Trajectory Projection Matrix
            </h4>
            
            <div className="space-y-3.5 text-xs font-sans">
              <p className="text-slate-700 flex flex-wrap items-center gap-2 font-medium">
                Active Probability Vector Trend:
                <strong className={`font-mono text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                  derivedSystemState === 'DANGEROUS' ? 'bg-red-50 text-red-600 border border-red-200' : derivedSystemState === 'WARNING' ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                }`}>
                  {derivedSystemState === 'DANGEROUS' ? 'Critical Backlog Drift' : derivedSystemState === 'WARNING' ? 'Elevated Transit Growth' : 'Steady Operational Flow'}
                </strong>
              </p>

              <p className="text-slate-500 leading-relaxed font-sans">
                Predictive telemetry metrics trace simulated drift loads along major corridor junctions. Currently, systemic occupancy calculations reflect values of {systemicAverageLoad}% across localized sub-sectors based on active transition probabilities.
              </p>

              <ul className="space-y-2 text-slate-500 pl-4 list-decimal">
                <li className="flex items-start gap-2">
                  <span className="text-brand-500 font-bold">•</span>
                  <span><strong>Recursive Coordinates:</strong> Bounding tracking centers computed dynamically matching timeline step of {forecastOffset} minutes.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-500 font-bold">•</span>
                  <span><strong>Flow Discrepancy:</strong> Ingress probability vectors relative to exits report a matching flow deviation factor of {((matrixWeights.gateToEscalator - matrixWeights.exitClearanceRate) * 100).toFixed(0)}%.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Coordinates table details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-150 font-mono text-xs text-slate-500 mt-4 select-none">
            <div>
              <span className="block uppercase text-[9px] text-slate-400 font-sans font-bold">ACCURACY confidence</span>
              <strong className="text-slate-700 block mt-0.5">{confidence}%</strong>
            </div>
            <div>
              <span className="block uppercase text-[9px] text-slate-400 font-sans font-bold">ALGORITHM MODEL</span>
              <strong className="text-slate-700 block mt-0.5">MARKOV_v3.8</strong>
            </div>
            <div>
              <span className="block uppercase text-[9px] text-slate-400 font-sans font-bold">LOCAL TARGET TIME</span>
              <strong className="text-slate-700 block mt-0.5">{currentLocalTime}</strong>
            </div>
            <div>
              <span className="block uppercase text-[9px] text-brand-600 font-sans font-bold">NEXT CALCULATION</span>
              <strong className="text-emerald-600 block mt-0.5 animate-pulse">{countdown}s</strong>
            </div>
          </div>
        </div>

        {/* Combined Gauge & Active Predictions side Panel */}
        <div className="border border-slate-200 bg-white p-6 rounded-2xl flex flex-col justify-between items-center gap-5 shadow-sm">
          
          <div className="w-full text-left border-b border-slate-100 pb-3">
            <span className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-widest block">
              Confidence & Forecast curves
            </span>
            <span className="text-xs font-sans text-slate-800 block font-semibold mt-1">
              Live Accuracy Gauge & Curve Plot
            </span>
          </div>

          <div className="w-full flex items-center justify-around gap-2 select-none">
            {/* SVG radial ring circle */}
            <div className="relative flex items-center justify-center shrink-0">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 80 80">
                {/* Background base circle trail */}
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  className="text-slate-100"
                  strokeWidth="6"
                  stroke="currentColor"
                  fill="transparent"
                />
                {/* Real-time active colored path indicator */}
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  className={`transition-all duration-350 ${
                    derivedSystemState === 'DANGEROUS' ? 'text-red-500' : derivedSystemState === 'WARNING' ? 'text-amber-500' : 'text-brand-500'
                  }`}
                  strokeWidth="6"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                />
              </svg>
              
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-base font-mono font-bold text-slate-900 leading-none">
                  {confidence}%
                </span>
                <span className="text-[7.5px] font-sans font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                  CONFID
                </span>
              </div>
            </div>

            {/* Micro SVG forecast trend curve */}
            <div className="flex-1 space-y-1.5 pl-2">
              <span className="text-[9.5px] font-sans font-bold text-slate-450 uppercase tracking-wide block">
                60m Predictive Flow
              </span>
              <div className="h-14 bg-slate-50 rounded-lg border border-slate-150 p-1.5 relative flex items-end">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
                  <path
                    d={`M 0 25 Q 30 ${25 - systemicAverageLoad * 0.2} 75 ${25 - systemicAverageLoad * 0.22} T 100 ${25 - systemicAverageLoad * 0.24}`}
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="2"
                  />
                  <circle cx="50" cy={25 - systemicAverageLoad * 0.21} r="3" fill="#3b82f6" className="animate-pulse" />
                </svg>
                <div className="absolute inset-x-1.5 top-1 flex justify-between items-center text-[7.5px] font-mono text-slate-400 pointer-events-none">
                  <span>Start</span>
                  <span className="text-brand-700 bg-white/95 px-1 border border-slate-150 rounded font-bold">Peak: {Math.max(systemicAverageLoad, 55)}%</span>
                  <span>Limit</span>
                </div>
              </div>
            </div>
          </div>

          {/* Predicted Congestion Info Box */}
          <div className="w-full space-y-1.5 border-t border-slate-100 pt-4 text-left font-sans">
            <span className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-widest block">
              Predicted Congestion State
            </span>
            <div className={`p-3 rounded-xl border flex items-start gap-2 ${
              derivedSystemState === 'DANGEROUS' 
                ? 'bg-rose-50/50 border-rose-200 text-rose-950' 
                : derivedSystemState === 'WARNING' 
                ? 'bg-amber-50/50 border-amber-200 text-amber-950' 
                : 'bg-emerald-50/50 border-emerald-100 text-emerald-950'
            }`}>
              <AlertTriangle className={`h-4 w-4 mt-0.5 shrink-0 ${
                derivedSystemState === 'DANGEROUS' ? 'text-red-600' : derivedSystemState === 'WARNING' ? 'text-amber-600' : 'text-emerald-600'
              }`} />
              <div className="text-[11px] leading-tight flex-1">
                <span className="font-bold block text-slate-800">
                  {derivedSystemState === 'DANGEROUS' 
                    ? 'Saturated Sector Backlog Risk' 
                    : derivedSystemState === 'WARNING' 
                    ? 'Elevated Transit Friction' 
                    : 'Clearance Performance Normal'}
                </span>
                <span className="text-slate-500 block leading-normal mt-0.5 font-normal">
                  {derivedSystemState === 'DANGEROUS' 
                    ? 'Severe backing identified at Escalator platforms. Alternate exits advised.'
                    : derivedSystemState === 'WARNING'
                    ? 'Transition vectors show mild density buildup at Sector Alpha access corridors.'
                    : 'Surveillance telemetry reports flawless dispersion profiles across current run.'}
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* DUAL-COLUMN ALERTS: ACTIVE LIST LIVE HUD & HISTORICAL TRAIL */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Active Alerts Live HUD */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-sans font-bold tracking-wider text-slate-500 uppercase flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-450 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500 animate-pulse"></span>
              </span>
              Active Prediction & Alerts HUD
            </h3>
            <span className="text-[9px] font-mono text-rose-600 font-bold uppercase bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-lg select-none shadow-sm">
              Live Monitor Link
            </span>
          </div>

          <div className="border border-slate-200 bg-white rounded-2xl p-5 min-h-[300px] flex flex-col shadow-sm">
            {simulatedAlerts.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-10 space-y-3">
                <div className="h-10 w-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">No active threat flags</h4>
                  <p className="text-[10.5px] text-slate-500 mt-1 max-w-xs font-sans leading-normal">
                    Model calculations report zero bottleneck safety violations on the active ingest feed.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-1 space-y-3 overflow-y-auto max-h-[320px] scrollbar-none pr-1">
                {simulatedAlerts.map((alert, idx) => {
                  const isCritical = alert.severity === 'CRITICAL';
                  return (
                    <div 
                      key={idx} 
                      className={`p-3.5 rounded-xl border transition-all flex items-start gap-3 relative ${
                        isCritical 
                          ? 'border-red-200 bg-red-50/15' 
                          : 'border-amber-200 bg-amber-50/20'
                      }`}
                    >
                      <div className={`h-7 w-7 rounded-lg shrink-0 flex items-center justify-center font-bold text-xs mt-0.5 ${
                        isCritical ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        ⚠️
                      </div>
                      <div className="flex-1 min-w-0 font-sans">
                        <div className="flex justify-between items-baseline gap-2">
                          <span className={`text-xs font-bold block truncate tracking-wide ${isCritical ? 'text-red-950' : 'text-amber-950'}`}>
                            {alert.alertType}
                          </span>
                          <span className="text-[9px] font-mono text-slate-400 shrink-0">14:35</span>
                        </div>
                        <span className="text-[10.5px] text-slate-500 block leading-tight mt-1">
                          Calculated spatial density exceeds safely calibrated baseline. Continuous tracking active.
                        </span>
                        <div className="flex items-center gap-2 mt-2 select-none">
                          <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                            isCritical ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                          }`}>
                            {alert.severity}
                          </span>
                          <span className="text-[9.5px] text-emerald-600 font-mono font-semibold">Status: EVALUATING</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Historical Resolved Alerts Trail */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-sans font-bold tracking-wider text-slate-500 uppercase flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-slate-400"></span>
              Resolved Alerts Trail — Historical (24 Hours)
            </h3>
            <span className="text-[9px] font-mono text-slate-400 uppercase select-none">
              Archived logs
            </span>
          </div>

          <div className="border border-slate-200 bg-white rounded-2xl p-5 min-h-[300px] shadow-sm flex flex-col justify-between">
            <div className="overflow-x-auto scrollbar-none flex-1">
              <table className="w-full text-left font-sans text-xs">
                <thead>
                  <tr className="border-b border-slate-150 bg-slate-50/50 text-slate-450 text-[10px] uppercase tracking-wider select-none font-bold">
                    <th className="p-3 pl-4">Timestamp</th>
                    <th className="p-3">Resolved Event Target</th>
                    <th className="p-3 text-right pr-4 font-bold">State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans text-[11px]">
                  {INITIAL_ALERT_HISTORY.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/40 transition-colors">
                      <td className="p-3 pl-4 text-slate-400 font-mono text-[10px]">{row.timestamp.split(' ')[1] || row.timestamp}</td>
                      <td className="p-3 font-semibold text-slate-700">{row.alertType.replace('Gates', 'G.').replace('Platform', 'Plt.').replace('Sustained ', '')}</td>
                      <td className="p-3 text-right pr-4">
                        <span className="inline-flex items-center gap-1.5 text-emerald-650 font-bold uppercase text-[9px] bg-emerald-50 border border-emerald-150 px-2 py-0.5 rounded-full">
                          <span className="h-1 w-1 bg-emerald-500 rounded-full"></span>
                          Resolved
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      {/* ACTIONS FOOTER PROCESS TRIGGERS */}
      <div className="flex flex-col md:flex-row gap-4 pt-4">
        
        <button
          id="predict-generate-report-btn"
          onClick={() => triggerToast("Generating predictive validation model report PDF...")}
          className="flex-1 border border-brand-500 hover:border-brand-600 bg-brand-50 hover:bg-brand-500 hover:text-white text-brand-600 text-xs py-3.5 rounded-xl font-sans font-semibold uppercase tracking-wider transition-all cursor-pointer text-center"
        >
          Generate Forecast Analysis
        </button>

        <button
          id="predict-config-alerts-btn"
          onClick={() => onNavigate('settings')}
          className="flex-1 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs py-3.5 rounded-xl font-sans font-semibold uppercase tracking-wider transition-all cursor-pointer text-center font-semibold"
        >
          Adjust Threshold Triggers
        </button>

        <button
          id="predict-view-trends-btn"
          onClick={() => onNavigate('dashboard')}
          className="flex-1 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs py-3.5 rounded-xl font-sans font-semibold uppercase tracking-wider transition-all cursor-pointer text-center font-semibold"
        >
          View Core Historical Trends
        </button>

      </div>

    </div>
  );
};

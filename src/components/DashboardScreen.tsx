import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Clock, 
  Cpu, 
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Radio,
  UserCheck,
  Server,
  Workflow,
  Video,
  BarChart2,
  ClipboardList,
  Settings
} from 'lucide-react';
import { ActiveTab, ActivityLog } from '../types';

interface DashboardScreenProps {
  onNavigate: (tab: ActiveTab) => void;
  recentLogs: ActivityLog[];
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ 
  onNavigate,
  recentLogs
}) => {
  const [currentTime, setCurrentTime] = useState('14:32:15');
  const [sparkValues, setSparkValues] = useState<number[]>([38, 41, 44, 43, 49, 57, 58, 62, 59, 56, 54, 58]);
  const [activeChartInterval, setActiveChartInterval] = useState<'24h' | '7d'>('24h');
  const [selectedChartPoint, setSelectedChartPoint] = useState<{ label: string; value: number } | null>(null);

  // Tick the clock synchronized to local system time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const HH = String(now.getHours()).padStart(2, '0');
      const MM = String(now.getMinutes()).padStart(2, '0');
      const SS = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${HH}:${MM}:${SS}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Periodic density calculation updates to simulate active telemetry streams
  useEffect(() => {
    const inter = setInterval(() => {
      setSparkValues(prev => {
        const copy = [...prev.slice(1)];
        const last = prev[prev.length - 1];
        const change = Math.floor(Math.random() * 7) - 3; // -3 to +3
        const next = Math.max(25, Math.min(88, last + change));
        copy.push(next);
        return copy;
      });
    }, 4000);
    return () => clearInterval(inter);
  }, []);

  // Selected state data for interactive SVG chart
  const chartData24h = [
    { label: '08:00', value: 34 },
    { label: '10:00', value: 52 },
    { label: '12:00', value: 78 },
    { label: '14:00', value: 64 },
    { label: '16:00', value: 48 },
    { label: '18:00', value: 85 },
    { label: '20:00', value: 71 },
    { label: '22:00', value: 42 },
  ];

  const chartData7d = [
    { label: 'Mon', value: 68 },
    { label: 'Tue', value: 72 },
    { label: 'Wed', value: 89 },
    { label: 'Thu', value: 61 },
    { label: 'Fri', value: 94 },
    { label: 'Sat', value: 45 },
    { label: 'Sun', value: 38 },
  ];

  const activeChartData = activeChartInterval === '24h' ? chartData24h : chartData7d;

  return (
    <div className="space-y-8 animate-fade-in text-slate-700">
      
      {/* Page Header Layout */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-5 gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold font-display text-slate-900 tracking-wide">
            Intelligent Crowd Behavior Prediction System — Overview
          </h2>
          <p className="text-xs text-slate-500 font-sans mt-1">
            Real-time optical feed parsing, spatial clustering models, and safety metric prediction indices.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white border border-slate-200 p-2.5 px-4 rounded-xl text-xs shadow-sm">
          <Clock className="h-4 w-4 text-brand-650" />
          <span className="text-slate-400 font-sans">System Clock:</span>
          <span className="text-emerald-600 font-mono font-bold tracking-widest">{currentTime}</span>
        </div>
      </div>      {/* 2-Column Responsive Board: Left side contains statistics & charts, Right side contains the vertical Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* LEFT COLUMN: PRIMARY SYSTEM INSIGHTS */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* ACTIVE STATUS INDICES */}
          <div>
            <h3 className="text-xs font-sans font-bold tracking-wider text-slate-700 uppercase mb-4 select-none">
              Active Status Indices
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
              
              {/* Card 1: Crowd Threat Safety Indices */}
              <div className="border border-slate-200 bg-white rounded-xl p-6 hover:border-brand-500/50 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-md transition-all group flex flex-col justify-between min-h-[220px]">
                <div className="flex items-start justify-between">
                  <span className="text-xs font-sans font-bold text-slate-500 uppercase tracking-widest">
                    Active Classification State
                  </span>
                  <Activity className="h-4 w-4 text-emerald-500 animate-pulse" />
                </div>
                
                <div className="my-auto py-2">
                  <div className="text-3xl font-display font-bold tracking-wide text-emerald-600 group-hover:translate-x-0.5 transition-transform origin-left">
                    Safe
                  </div>
                  <p className="text-xs font-sans text-slate-700 mt-1">
                    Measured densities reside below safety threshold limits (<span className="font-mono font-semibold">70%</span>)
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                  <span className="text-[10.5px] font-mono text-slate-550">
                    Trigger Value: <span className="text-slate-800 font-bold">{sparkValues[sparkValues.length - 1]}%</span>
                  </span>
                  <button 
                    onClick={() => onNavigate('results')}
                    className="text-[10.5px] font-sans font-semibold text-brand-650 hover:text-brand-800 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    Inspect Video Feed <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Card 2: Neural Model Core Operations */}
              <div className="border border-slate-200 bg-white rounded-xl p-6 hover:border-brand-500/50 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-md transition-all group flex flex-col justify-between min-h-[220px]">
                <div className="flex items-start justify-between">
                  <span className="text-xs font-sans font-bold text-slate-500 uppercase tracking-widest">
                    Forecast Channels
                  </span>
                  <TrendingUp className="h-4 w-4 text-brand-650" />
                </div>
                
                <div className="my-auto py-2">
                  <div className="flex items-baseline gap-2 text-3xl font-display font-semibold text-slate-800">
                    <span className="font-mono text-slate-900 font-bold">01</span>
                    <span className="text-xs font-sans text-slate-600 font-normal">active stream feed</span>
                  </div>
                  <p className="text-xs font-sans text-slate-700 mt-1">
                    Markov sequence and drift prediction calculations updating every <span className="font-mono font-semibold">60s</span>
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                  <span className="text-[10.5px] font-mono text-slate-550">
                    Global Accuracy: <span className="text-slate-800 font-bold">94.2%</span>
                  </span>
                  <button 
                    onClick={() => onNavigate('predictions')}
                    className="text-[10.5px] font-sans font-semibold text-brand-650 hover:text-brand-800 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    Predictions Hub <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Card 3: Warnings and Discrepancies */}
              <div className="border border-slate-200 bg-white rounded-xl p-6 hover:border-brand-500/50 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-md transition-all group flex flex-col justify-between min-h-[220px]">
                <div className="flex items-start justify-between">
                  <span className="text-xs font-sans font-bold text-slate-500 uppercase tracking-widest">
                    Identified Alarms
                  </span>
                  <ShieldAlert className="h-4 w-4 text-emerald-500" />
                </div>
                
                <div className="my-auto py-2">
                  <div className="text-3xl font-display font-bold text-emerald-600">
                    <span className="font-mono">00</span>
                  </div>
                  <p className="text-xs font-sans text-slate-700 mt-1">
                    All monitoring sub-sectors reports show normal occupancy rates
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                  <span className="text-[10.5px] font-sans text-emerald-700 font-semibold flex items-center gap-1">
                    <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    System Nominal
                  </span>
                  <button 
                    onClick={() => onNavigate('settings')}
                    className="text-[10.5px] font-sans font-semibold text-brand-650 hover:text-brand-800 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    Configure Limits <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* CORE GRAPH PANEL SECTION */}
          <div className="border border-slate-200 bg-white rounded-2xl p-6 space-y-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1 select-none">
                <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Radio className="h-4 w-4 text-brand-650" /> Projected Crowd Load Density Trends
                </h4>
                <p className="text-xs text-slate-700 font-sans">
                  Aggregated historical spatial loading percentage values mapped over intervals.
                </p>
              </div>
              
              {/* Chart controls */}
              <div className="flex items-center gap-1 border border-slate-200 p-1 rounded-lg bg-slate-50">
                <button
                  type="button"
                  onClick={() => { setActiveChartInterval('24h'); setSelectedChartPoint(null); }}
                  className={`px-3 py-1 text-xs font-sans font-medium rounded-md transition-all cursor-pointer ${
                    activeChartInterval === '24h' 
                      ? 'bg-white text-brand-655 shadow-sm border border-slate-150 font-semibold' 
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  24-Hour Plot
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveChartInterval('7d'); setSelectedChartPoint(null); }}
                  className={`px-3 py-1 text-xs font-sans font-medium rounded-md transition-all cursor-pointer ${
                    activeChartInterval === '7d' 
                      ? 'bg-white text-brand-655 shadow-sm border border-slate-150 font-semibold' 
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  7-Day Trend
                </button>
              </div>
            </div>

            {/* High quality SVG curve graph representing real prediction values */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3 border border-slate-150 bg-slate-50/50 p-6 rounded-xl relative h-64 flex flex-col justify-between">
                
                {/* Background grids */}
                <div className="absolute inset-x-6 inset-y-12 flex flex-col justify-between pointer-events-none">
                  <div className="border-b border-slate-200/50 w-full" />
                  <div className="border-b border-slate-200/50 w-full" />
                  <div className="border-b border-slate-200/50 w-full" />
                  <div className="border-b border-slate-200/50 w-full" />
                </div>

                {/* Custom SVG Line path */}
                <div className="relative flex-1 w-full pt-4">
                  <svg className="h-full w-full overflow-visible" viewBox="0 0 500 120" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {/* Area path */}
                    <path
                      d={`M 0 120 
                          ${activeChartData.map((d, i) => {
                            const x = (i / (activeChartData.length - 1)) * 500;
                            const y = 120 - (d.value / 100) * 100;
                            return `L ${x} ${y}`;
                          }).join(' ')} 
                          L 500 120 Z`}
                      fill="url(#chartGradient)"
                    />
                    {/* Stroke path */}
                    <path
                      d={activeChartData.map((d, i) => {
                        const x = (i / (activeChartData.length - 1)) * 498 + 1;
                        const y = 120 - (d.value / 100) * 100;
                        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                      }).join(' ')}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2.5"
                    />
                    {/* Node Circles */}
                    {activeChartData.map((d, i) => {
                      const x = (i / (activeChartData.length - 1)) * 498 + 1;
                      const y = 120 - (d.value / 100) * 100;
                      const isHovered = selectedChartPoint?.label === d.label;
                      return (
                        <circle
                          key={i}
                          cx={x}
                          cy={y}
                          r={isHovered ? "6" : "4"}
                          fill={isHovered ? "#3b82f6" : "#ffffff"}
                          stroke="#3b82f6"
                          strokeWidth="2.5"
                          className="cursor-pointer transition-all"
                          onClick={() => setSelectedChartPoint({ label: d.label, value: d.value })}
                        />
                      );
                    })}
                  </svg>
                </div>

                {/* X-Axis labels */}
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-550 pt-3 border-t border-slate-150 select-none">
                  {activeChartData.map((d, idx) => (
                    <span 
                      key={idx} 
                      className={`cursor-pointer hover:text-brand-600 transition-colors px-1 ${
                        selectedChartPoint?.label === d.label ? 'text-brand-600 font-bold' : ''
                      }`}
                      onClick={() => setSelectedChartPoint({ label: d.label, value: d.value })}
                    >
                      {d.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Interactive metadata display column */}
              <div className="border border-slate-200 bg-slate-50/40 p-5 rounded-xl flex flex-col justify-between">
                <div className="space-y-4">
                  <span className="text-[10px] font-sans font-bold text-slate-500 uppercase tracking-widest block">
                    Metric Details
                  </span>
                  {selectedChartPoint ? (
                    <div className="space-y-2 animate-fade-in font-sans">
                      <span className="text-xs text-slate-655">Selected Interval:</span>
                      <div className="text-sm font-mono font-bold text-slate-800">{selectedChartPoint.label}</div>
                      <div className="space-y-1">
                        <span className="text-xs text-slate-655 block">Density Load:</span>
                        <span className="text-2xl font-mono font-bold text-brand-600">{selectedChartPoint.value}%</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 text-slate-700 select-none py-4 font-sans text-xs">
                      <p className="italic leading-normal">
                        Click any point coordinate on the plot curve to see precise historical loading values.
                      </p>
                    </div>
                  )}
                </div>

                {/* Quick summary context */}
                <div className="border-t border-slate-150 pt-4 space-y-1 text-xs select-none">
                  <div className="flex justify-between">
                    <span className="text-slate-550">Peak Load Point:</span>
                    <span className="text-slate-800 font-mono font-bold">94.0%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-550">Average Load:</span>
                    <span className="text-slate-800 font-mono font-semibold">54.2%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RECENT OPERATIONAL ACTIVITIES */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-sans font-bold tracking-wider text-slate-700 uppercase">
                Recent System Activities
              </h3>
              <button 
                onClick={() => onNavigate('logs')}
                className="text-[11px] font-sans font-semibold text-brand-650 hover:text-brand-800 flex items-center gap-1.5 cursor-pointer select-none transition-colors"
              >
                Open Operational Logs View <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Dense Audit Trail Segment */}
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)] bg-white">
              <div className="overflow-x-auto scrollbar-none">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 font-sans text-[11px] text-slate-700 uppercase tracking-wider select-none font-bold font-sans">
                      <th className="p-4 pl-6">Logged Timestamp</th>
                      <th className="p-4">Calculated Action Event</th>
                      <th className="p-4">Trigger User</th>
                      <th className="p-4 pr-6">Execution Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-xs">
                    {recentLogs.slice(0, 4).map((log) => (
                      <tr 
                        key={log.id} 
                        className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                        onClick={() => {
                          if (log.action.includes('Upload')) onNavigate('upload');
                          if (log.action.includes('Analysis') || log.action.includes('Computed')) onNavigate('results');
                        }}
                      >
                        {/* Timestamp */}
                        <td className="p-4 pl-6 text-slate-600 font-mono">
                          {log.timestamp}
                        </td>

                        {/* Action */}
                        <td className="p-4 font-sans text-sm text-slate-800 font-semibold">
                          {log.action}
                        </td>

                        {/* Trigger User */}
                        <td className="p-4 font-mono text-slate-650">
                          {log.user === 'system_auto' ? 'Automated Core' : log.user}
                        </td>

                        {/* Exec State */}
                        <td className="p-4 pr-6">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide font-sans ${
                            log.status === 'Success' 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                              : 'bg-brand-50 text-brand-700 border border-brand-200'
                          }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${log.status === 'Success' ? 'bg-emerald-500' : 'bg-brand-500 animate-pulse'}`} />
                            {log.status}
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

        {/* RIGHT COLUMN: RESTRUCTURED VERTICAL QUICK ACTIONS */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] space-y-4">
            <div className="border-b border-slate-100 pb-3 select-none">
              <span className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-widest block">
                Command Deck
              </span>
              <h3 className="text-xs font-sans font-bold text-slate-800 uppercase tracking-wider mt-1">
                Quick Actions
              </h3>
            </div>

            <div className="flex flex-col gap-2">
              <button
                id="quick-nav-ingestion"
                onClick={() => onNavigate('upload')}
                className="w-full flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-150 bg-slate-50/50 hover:bg-brand-50 hover:border-brand-250 transition-all text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-8 w-8 rounded-lg bg-brand-50 text-brand-650 flex items-center justify-center font-bold group-hover:bg-brand-100/80 transition-colors shrink-0">
                    <Video className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-850 block leading-tight group-hover:text-brand-850">
                      Media Ingestion
                    </span>
                    <span className="text-[9.5px] text-slate-600 block truncate mt-0.5 font-normal">
                      Upload feed & parse
                    </span>
                  </div>
                </div>
                <ArrowRight className="h-3 w-3 text-slate-400 group-hover:text-brand-500 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                id="quick-nav-telemetry"
                onClick={() => onNavigate('results')}
                className="w-full flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-150 bg-slate-50/50 hover:bg-emerald-50 hover:border-emerald-250 transition-all text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold group-hover:bg-emerald-100/80 transition-colors shrink-0">
                    <BarChart2 className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-850 block leading-tight group-hover:text-emerald-850">
                      Telemetry Analysis
                    </span>
                    <span className="text-[9.5px] text-slate-600 block truncate mt-0.5 font-normal font-sans">
                      Density & clustering logs
                    </span>
                  </div>
                </div>
                <ArrowRight className="h-3 w-3 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                id="quick-nav-forecasts"
                onClick={() => onNavigate('predictions')}
                className="w-full flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-150 bg-slate-50/50 hover:bg-amber-50 hover:border-amber-250 transition-all text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold group-hover:bg-amber-100/80 transition-colors shrink-0">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-850 block leading-tight group-hover:text-amber-850 font-sans">
                      Behavior Forecasts
                    </span>
                    <span className="text-[9.5px] text-slate-600 block truncate mt-0.5 font-sans font-normal">
                      Accuracy & alert HUD
                    </span>
                  </div>
                </div>
                <ArrowRight className="h-3 w-3 text-slate-400 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                id="quick-nav-operational"
                onClick={() => onNavigate('logs')}
                className="w-full flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-150 bg-slate-50/50 hover:bg-purple-50 hover:border-purple-250 transition-all text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-8 w-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold group-hover:bg-purple-100/80 transition-colors shrink-0">
                    <ClipboardList className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-855 block leading-tight group-hover:text-purple-850 font-sans">
                      Operational Logs
                    </span>
                    <span className="text-[9.5px] text-slate-600 block truncate mt-0.5 font-sans font-normal">
                      Audit trials & sessions
                    </span>
                  </div>
                </div>
                <ArrowRight className="h-3 w-3 text-slate-400 group-hover:text-brand-500 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                id="quick-nav-settings"
                onClick={() => onNavigate('settings')}
                className="w-full flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-150 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-350 transition-all text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-8 w-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold group-hover:bg-slate-200 transition-colors shrink-0">
                    <Settings className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-855 block leading-tight group-hover:text-slate-900 font-sans">
                      System Setting
                    </span>
                    <span className="text-[9.5px] text-slate-600 block truncate mt-0.5 font-sans font-normal">
                      Configure threshold values
                    </span>
                  </div>
                </div>
                <ArrowRight className="h-3 w-3 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

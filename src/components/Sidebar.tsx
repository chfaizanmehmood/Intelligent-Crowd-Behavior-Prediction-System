import React from 'react';
import { 
  LayoutDashboard, 
  Video, 
  BarChart3, 
  Flame, 
  ShieldAlert, 
  FileSpreadsheet, 
  LogOut,
  Sliders,
  ShieldCheck
} from 'lucide-react';
import { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  onLogout: () => void;
  userRole?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  onChangeTab, 
  onLogout,
  userRole = 'Shift Officer'
}) => {
  const menuItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'System Dashboard',
      icon: LayoutDashboard,
      desc: 'Real-time state & telemetry statistics'
    },
    {
      id: 'upload' as ActiveTab,
      label: 'Media Ingestion',
      icon: Video,
      desc: 'Upload surveillance & sensor feeds'
    },
    {
      id: 'results' as ActiveTab,
      label: 'Telemetry Analysis',
      icon: BarChart3,
      desc: 'Processed density & drift results'
    },
    {
      id: 'predictions' as ActiveTab,
      label: 'Behavior Forecasts',
      icon: ShieldAlert,
      desc: 'Predictive modeling & active alerts'
    },
    {
      id: 'logs' as ActiveTab,
      label: 'Operation Logs',
      icon: FileSpreadsheet,
      desc: 'System event audit trails'
    },
    {
      id: 'settings' as ActiveTab,
      label: 'System Settings',
      icon: Sliders,
      desc: 'Calibrate sensitivity under analysis'
    }
  ];

  return (
    <aside id="sidebar-navigation" className="w-80 bg-navy-900 border-r border-navy-800/80 flex flex-col min-h-screen text-slate-350 select-none">
      
      {/* Title Segment - Academic Project Branding */}
      <div className="p-6 border-b border-navy-800/60 bg-navy-950/30">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-brand-500/10 rounded-lg flex items-center justify-center border border-brand-500/25">
            <Flame className="h-5 w-5 text-brand-500 animate-pulse" />
          </div>
          <div>
            <span className="text-base font-display font-bold tracking-wider text-white block">
              ICBPS
            </span>
            <span className="text-[10px] font-sans text-slate-400 block tracking-wide">
              Crowd Behavior Prediction
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Label */}
      <div className="px-6 pt-6 pb-2">
        <span className="text-[10px] font-sans font-bold tracking-widest text-slate-500 uppercase block">
          OPERATIONAL MODULES
        </span>
      </div>

      {/* Main Nav Items with colored custom indicator (no white slider) */}
      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto scrollbar-none">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              id={`nav-link-${item.id}`}
              key={item.id}
              onClick={() => onChangeTab(item.id)}
              className={`w-full flex items-start gap-3.5 px-4 py-3 rounded-lg text-left transition-all group relative cursor-pointer ${
                isActive 
                  ? 'bg-brand-500/10 border-l-4 border-l-brand-500 text-brand-400 font-medium' 
                  : 'hover:bg-navy-800/50 hover:text-white border-l-4 border-l-transparent text-slate-400'
              }`}
            >
              <Icon className={`h-[18px] w-[18px] mt-0.5 shrink-0 transition-transform ${isActive ? 'text-brand-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold block tracking-wide">
                  {item.label}
                </span>
                <span className="text-[10.5px] font-sans text-slate-500 block mt-0.5 truncate group-hover:text-slate-400">
                  {item.desc}
                </span>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Operator Session Tag */}
      <div className="mx-4 p-4 mb-3 border border-navy-800/60 rounded-lg bg-navy-950/20">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-brand-600 text-white rounded-md flex items-center justify-center font-mono text-xs font-semibold border border-brand-500/30">
            OP
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-mono font-medium text-slate-300 truncate">admin_user</p>
            <p className="text-[10px] font-sans text-emerald-500 flex items-center gap-1.5 font-medium">
              <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Active Session
            </p>
          </div>
        </div>
      </div>

      {/* Sign Out Trigger */}
      <div className="p-4 border-t border-navy-800/60 bg-navy-950/10">
        <button
          id="nav-logout-btn"
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 border border-navy-800 bg-navy-900/40 hover:bg-red-950/20 hover:text-red-400 hover:border-red-900/40 text-slate-400 font-sans text-xs py-2.5 px-4 rounded-lg transition-all cursor-pointer font-medium tracking-wide"
        >
          <LogOut className="h-3.5 w-3.5 shrink-0 text-slate-550" />
          Disconnect Session
        </button>
      </div>

    </aside>
  );
};

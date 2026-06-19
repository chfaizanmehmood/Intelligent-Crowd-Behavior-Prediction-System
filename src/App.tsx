import React, { useState } from 'react';
import { ActiveTab, ActivityLog, INITIAL_LOGS } from './types';
import { LoginScreen } from './components/LoginScreen';
import { Sidebar } from './components/Sidebar';
import { DashboardScreen } from './components/DashboardScreen';
import { VideoUploadScreen } from './components/VideoUploadScreen';
import { AnalysisResultsScreen } from './components/AnalysisResultsScreen';
import { PredictionsAlertsScreen } from './components/PredictionsAlertsScreen';
import { ActivityLogScreen } from './components/ActivityLogScreen';
import { SettingsScreen } from './components/SettingsScreen';

export default function App() {
  // Session authentication state
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  // Active navigation tab state
  const [activeTab, setActiveTab ] = useState<ActiveTab>('dashboard');

  // Shared state: dynamic override system status
  const [systemState, setSystemState] = useState<'NORMAL' | 'MODERATE' | 'WARNING' | 'DANGEROUS'>('MODERATE');

  // Shared state: uploaded video telemetry metadata
  const [uploadedVideo, setUploadedVideo] = useState<{
    name: string;
    size: string;
    duration: string;
    state: 'NORMAL' | 'MODERATE' | 'WARNING' | 'DANGEROUS';
  } | null>(null);

  // Shared state: admin action log entries
  const [logsList, setLogsList] = useState<ActivityLog[]>(INITIAL_LOGS);

  // Authentication callbacks
  const handleLoginSuccess = (username: string) => {
    setCurrentUser(username);
    
    // Log login action
    const now = new Date();
    const formatted = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
    
    const loginLog: ActivityLog = {
      id: Math.random().toString(),
      timestamp: formatted,
      action: 'User Login',
      user: username,
      details: 'Established secure console command connection, initial research link synced',
      status: 'Success'
    };

    setLogsList(prev => [loginLog, ...prev]);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('dashboard');
    resetUploadedState();
  };

  const resetUploadedState = () => {
    setUploadedVideo(null);
    setSystemState('MODERATE');
  };

  // Video processed event callback
  const handleVideoProcessed = (metadata: {
    name: string;
    size: string;
    duration: string;
    state: 'NORMAL' | 'MODERATE' | 'WARNING' | 'DANGEROUS';
  }) => {
    setUploadedVideo(metadata);
    setSystemState(metadata.state);

    // Dynamic prepend to administrator activity log
    const now = new Date();
    const formatted = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
    
    const analysisCompleteLog: ActivityLog = {
      id: Math.random().toString(),
      timestamp: formatted,
      action: 'Video Analysis Complete',
      user: currentUser || 'admin_user',
      details: `Computed ${metadata.state} density clusters from file: ${metadata.name}`,
      status: 'Success'
    };

    const uploadStartLog: ActivityLog = {
      id: (Math.random() + 1).toString(),
      timestamp: formatted,
      action: 'File Upload Started',
      user: currentUser || 'admin_user',
      details: `${metadata.name} (${metadata.size}) uploaded successfully`,
      status: 'Success'
    };

    setLogsList(prev => [analysisCompleteLog, uploadStartLog, ...prev]);
  };

  // Switch display contents matching active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardScreen 
            onNavigate={(tab) => setActiveTab(tab)} 
            recentLogs={logsList}
          />
        );
      case 'upload':
        return (
          <VideoUploadScreen 
            onUploadComplete={handleVideoProcessed}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        );
      case 'results':
        return (
          <AnalysisResultsScreen 
            uploadedVideo={uploadedVideo}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        );
      case 'predictions':
        return (
          <PredictionsAlertsScreen 
            onNavigate={(tab) => setActiveTab(tab)}
            systemState={systemState}
            onSystemStateChange={(state) => setSystemState(state)}
          />
        );
      case 'logs':
        return (
          <ActivityLogScreen 
            onNavigate={(tab) => setActiveTab(tab)}
          />
        );
      case 'settings':
        return (
          <SettingsScreen />
        );
      default:
        return <div className="p-8 text-center text-slate-500">Unknown segment view</div>;
    }
  };

  // If session is logged out, render standard credentials page
  if (!currentUser) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="flex h-screen bg-navy-950 text-slate-800 overflow-hidden font-sans">
      
      {/* Sidebar Navigation Left Rail */}
      <Sidebar 
        activeTab={activeTab} 
        onChangeTab={(tab) => setActiveTab(tab)} 
        onLogout={handleLogout}
        userRole="Administrator"
      />

      {/* Main Content Pane */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[#F5F7FA] text-slate-850">
        
        {/* Visual Header Banner matching layout */}
        <header className="px-8 py-5 border-b border-slate-200 bg-white/50 backdrop-blur-sm flex justify-between items-center shrink-0 select-none">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono text-emerald-600 font-semibold uppercase tracking-wider">
              Secure Channel Active
            </span>
          </div>
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest hidden md:block">
            ICBPS Research Workspace • Active Console Link
          </div>
        </header>

        {/* Dynamic content center view */}
        <div className="flex-1 p-8 max-w-7xl w-full mx-auto space-y-6">
          {renderTabContent()}
        </div>

      </main>

    </div>
  );
}

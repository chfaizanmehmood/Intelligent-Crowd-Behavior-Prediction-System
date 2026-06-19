import React, { useState, useMemo } from 'react';
import { 
  Search, 
  User, 
  Calendar, 
  Filter, 
  Database, 
  CheckCircle2, 
  AlertTriangle,
  X,
  FileSpreadsheet,
  Printer,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Clock
} from 'lucide-react';
import { ActiveTab, ActivityLog, INITIAL_LOGS } from '../types';

interface ActivityLogScreenProps {
  onNavigate: (tab: ActiveTab) => void;
}

export const ActivityLogScreen: React.FC<ActivityLogScreenProps> = ({ onNavigate }) => {
  // Active logged-in users state setup for administrative management
  const [activeUsers, setActiveUsers] = useState([
    { username: 'admin_user', role: 'System Administrator', ip: '192.168.1.100', joined: '10:04:12', initial: 'AD', color: 'bg-brand-600' },
    { username: 'operator_01', role: 'Monitoring Officer', ip: '192.168.1.105', joined: '12:15:32', initial: 'OP', color: 'bg-indigo-600' },
    { username: 'operator_02', role: 'Transit Supervisor', ip: '192.168.1.112', joined: '14:22:45', initial: 'TS', color: 'bg-emerald-600' },
    { username: 'researcher_alpha', role: 'Academic Analyst', ip: '172.16.2.44', joined: '09:44:01', initial: 'RA', color: 'bg-purple-600' },
  ]);

  const handleRemoveUser = (username: string) => {
    setActiveUsers(prev => prev.filter(u => u.username !== username));
    triggerToast(`Session terminated for @${username}. Access token successfully revoked.`);
  };

  // Client filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [userFilter, setUserFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('ALL');
  
  // Active applied filter snapshot
  const [appliedSearch, setAppliedSearch] = useState('');
  const [appliedUser, setAppliedUser] = useState('ALL');
  const [appliedDate, setAppliedDate] = useState('ALL');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Custom alert toast triggers
  const [toast, setToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const handleApplyFilters = () => {
    setAppliedSearch(searchQuery);
    setAppliedUser(userFilter);
    setAppliedDate(dateFilter);
    setCurrentPage(1); // Reset page on filter
    triggerToast("Filtering operational system logs...");
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setUserFilter('ALL');
    setDateFilter('ALL');
    setAppliedSearch('');
    setAppliedUser('ALL');
    setAppliedDate('ALL');
    setCurrentPage(1);
    triggerToast("Search filters cleared.");
  };

  // Perform search / filter mapping
  const filteredLogs = useMemo(() => {
    return INITIAL_LOGS.filter(log => {
      if (appliedSearch) {
        const query = appliedSearch.toLowerCase();
        const actionMatch = log.action.toLowerCase().includes(query);
        const detailsMatch = log.details.toLowerCase().includes(query);
        const idMatch = log.id.toLowerCase().includes(query);
        if (!actionMatch && !detailsMatch && !idMatch) return false;
      }

      if (appliedUser !== 'ALL') {
        if (log.user !== appliedUser) return false;
      }

      if (appliedDate !== 'ALL') {
        const isToday = log.timestamp.includes('2026-06-15');
        if (appliedDate === 'TODAY' && !isToday) return false;
        if (appliedDate === 'YESTERDAY' && isToday) return false;
      }

      return true;
    });
  }, [appliedSearch, appliedUser, appliedDate]);

  const totalEntries = filteredLogs.length;
  const isFiltered = appliedSearch !== '' || appliedUser !== 'ALL' || appliedDate !== 'ALL';
  const displayTotalEntries = isFiltered ? totalEntries : 1247;
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  
  const currentLogsSlice = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredLogs.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredLogs, currentPage]);

  const startIndexDisplay = (currentPage - 1) * itemsPerPage + 1;
  const endIndexDisplay = Math.min(currentPage * itemsPerPage, totalEntries);

  return (
    <div className="space-y-8 animate-fade-in text-slate-700 font-sans">
      
      {/* Toast Alert Banner */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-700 text-brand-400 font-sans text-xs px-5 py-3.5 rounded-xl shadow-2xl backdrop-blur-md">
          ⚡ {toast}
        </div>
      )}

      {/* Page Header */}
      <div className="border-b border-slate-200 pb-5">
        <h2 className="text-xl md:text-2xl font-bold font-display text-slate-950 tracking-wide">
          Operation & Administration Audit Logs
        </h2>
        <p className="text-xs text-slate-550 font-sans mt-1">
          Cryptographically compiled event log trails, resource allocation transactions, and sensor telemetry databases.
        </p>
      </div>

      {/* ACTIVE LOGGED-IN SESSIONS CONTROL SECTION */}
      <div className="space-y-4">
        <div className="flex justify-between items-center select-none">
          <h3 className="text-xs font-sans font-bold tracking-wider text-slate-500 uppercase flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Active Logged-In Users ({activeUsers.length})
          </h3>
          <span className="text-[10px] text-slate-550 font-mono">
            Security Authorization: ROOT_LEVEL
          </span>
        </div>
        {activeUsers.length === 0 ? (
          <div className="p-6 border border-dashed border-slate-250 bg-white rounded-2xl text-center text-slate-400 italic text-xs">
            No active remote operator sessions are connected • Local secure console session active.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {activeUsers.map((user) => (
              <div 
                key={user.username} 
                className="border border-slate-200 bg-white p-4 rounded-xl flex items-center justify-between gap-3 shadow-sm group hover:border-slate-350 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0 font-sans">
                  <div className={`h-9 w-9 text-white rounded-lg ${user.color} flex items-center justify-center font-bold font-mono text-[11px] border border-white/10 shrink-0 shadow-sm select-none`}>
                    {user.initial}
                  </div>
                  <div className="min-w-0 font-sans">
                    <span className="text-xs font-bold text-slate-800 block truncate leading-tight">
                      @{user.username}
                    </span>
                    <span className="text-[10px] text-slate-500 block truncate mt-0.5">
                      {user.role}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono block mt-1 select-none">
                      IP: {user.ip} • {user.joined}
                    </span>
                  </div>
                </div>
                
                {/* Remove Session Button */}
                <button
                  id={`remove-user-session-${user.username}`}
                  onClick={() => handleRemoveUser(user.username)}
                  className="h-8 w-8 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 border border-slate-150 group-hover:border-slate-200 hover:border-red-200 flex items-center justify-center cursor-pointer transition-all shrink-0 select-none"
                  title={`Revoke @${user.username} session`}
                >
                  <span className="text-xs font-bold font-sans">✕</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-[11px] font-sans font-bold tracking-wider text-slate-500 uppercase mb-4">
          Console Query Parameters
        </h3>

        {/* Search & Filter Container */}
        <div className="border border-slate-200 bg-white p-6 rounded-2xl space-y-6 shadow-sm">
          
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Filter className="h-4 w-4 text-slate-455" />
            <span className="text-xs font-sans font-bold uppercase tracking-wider text-slate-750">
              Narrow Audit Search
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            
            {/* Search Input */}
            <div>
              <label className="block text-slate-500 uppercase tracking-wider mb-2 text-[10px] font-semibold font-sans">
                Search By Keyword
              </label>
              <div className="relative">
                <input
                  id="search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter action details, ID, etc..."
                  className="w-full border border-slate-200 bg-slate-50 px-4 py-3 text-xs rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all font-sans"
                />
              </div>
            </div>

            {/* Filter by User Dropdown */}
            <div>
              <label className="block text-slate-500 uppercase tracking-wider mb-2 text-[10px] font-semibold font-sans">
                Operator Username Filter
              </label>
              <select
                id="user-dropdown-select"
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
                className="w-full border border-slate-200 bg-slate-50 px-4 py-3 text-xs rounded-xl text-slate-700 focus:outline-none focus:border-brand-500 transition-all font-sans"
              >
                <option value="ALL">All Operational Users</option>
                <option value="system_auto">system_auto</option>
                <option value="admin_user">admin_user</option>
                <option value="operator_01">operator_01</option>
                <option value="operator_02">operator_02</option>
              </select>
            </div>

            {/* Date Rangepicker */}
            <div>
              <label className="block text-slate-500 uppercase tracking-wider mb-2 text-[10px] font-semibold font-sans">
                Logged Duration Frame
              </label>
              <select
                id="date-picker-select"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full border border-slate-200 bg-slate-50 px-4 py-3 text-xs rounded-xl text-slate-700 focus:outline-none focus:border-brand-500 transition-all font-sans"
              >
                <option value="ALL">All Historical Logs</option>
                <option value="TODAY">Today (2026-06-15)</option>
                <option value="YESTERDAY">Yesterday (2026-06-14)</option>
              </select>
            </div>

          </div>

          {/* Action pills */}
          <div className="flex items-center gap-3 pt-2">
            
            <button
              id="apply-filters-btn"
              type="button"
              onClick={handleApplyFilters}
              className="border border-brand-500 hover:border-brand-600 bg-brand-50 hover:bg-brand-600 hover:text-white text-brand-700 text-xs font-bold py-2.5 px-6 rounded-xl uppercase tracking-wider transition-all cursor-pointer font-sans shadow-sm"
            >
              Apply Query Filters
            </button>

            <button
              id="reset-filters-btn"
              type="button"
              onClick={handleResetFilters}
              className="border border-slate-200 hover:bg-slate-50 text-slate-550 text-xs font-semibold py-2.5 px-6 rounded-xl uppercase tracking-wider transition-all cursor-pointer font-sans"
            >
              Clear Filters
            </button>

          </div>

        </div>
      </div>

      {/* CORE AUDIT LOG PANEL TABLE */}
      <div className="space-y-4">
        <div className="border border-slate-200 bg-white rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-sans text-[11px] uppercase tracking-wider select-none font-bold">
                <th className="p-4 pl-6">Logged Timestamp</th>
                <th className="p-4">Captured Action</th>
                <th className="p-4">User Issuer</th>
                <th className="p-4">Transaction Details</th>
                <th className="p-4 pr-6">Status State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentLogsSlice.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 italic uppercase font-sans text-xs bg-white">
                    No matching activity coordinate entries discovered in historical records database.
                  </td>
                </tr>
              ) : (
                currentLogsSlice.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 bg-white transition-colors">
                    <td className="p-4 pl-6 text-slate-500 truncate max-w-[150px]">{log.timestamp}</td>
                    <td className="p-4 text-slate-800 font-sans font-semibold text-sm">{log.action}</td>
                    <td className="p-4 text-brand-650 font-mono font-bold">@{log.user}</td>
                    <td className="p-4 text-slate-500 font-sans max-w-xs truncate">{log.details}</td>
                    <td className="p-4 pr-6">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-semibold font-sans tracking-wide ${
                        log.status === 'Success' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : log.status === 'Processing' 
                          ? 'bg-brand-50 text-brand-700 border border-brand-200' 
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        <span className={`h-1 w-1 rounded-full ${log.status === 'Success' ? 'bg-emerald-500' : 'bg-brand-500'}`} />
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* COMPLIANT PAGINATION CONTROLS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-xs text-slate-500 select-none">
          
          <span>
            Showing <strong className="text-slate-700 font-semibold font-mono">{startIndexDisplay}-{endIndexDisplay}</strong> of{' '}
            <strong className="text-slate-700 font-semibold font-mono">{displayTotalEntries}</strong> database entries
          </span>

          <div className="flex flex-wrap items-center gap-2 font-mono">
            
            <button
              id="pagination-prev-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-650 px-3 py-1.5 rounded-lg disabled:opacity-30 uppercase text-[10px] font-sans font-semibold cursor-pointer transition-all"
            >
              Previous Page
            </button>

            {/* clean page numbers */}
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              const isSelected = currentPage === pageNum;
              return (
                <button
                  id={`pagination-page-${pageNum}-btn`}
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                    isSelected 
                      ? 'border-brand-500 bg-brand-50 text-brand-700 font-bold' 
                      : 'border-slate-200 bg-white text-slate-500 hover:border-slate-350'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              id="pagination-next-btn"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-650 px-3 py-1.5 rounded-lg disabled:opacity-30 uppercase text-[10px] font-sans font-semibold cursor-pointer transition-all"
            >
              Next Page
            </button>

          </div>

        </div>
      </div>

      {/* CORE LOG STATISTICS DATABASE SNAPSHOT */}
      <div className="border border-slate-200 bg-white p-6 rounded-2xl space-y-4 shadow-sm">
        
        <h4 className="text-xs font-sans font-bold tracking-widest text-slate-700 uppercase">
          Audit Metrics (Last 24 Hours)
        </h4>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 select-none font-mono text-xs">
          
          <div className="border border-slate-150 bg-slate-50/50 p-4 rounded-xl text-center">
            <span className="text-[10px] text-slate-450 block uppercase font-sans font-bold tracking-wider">Total Transactions</span>
            <span className="text-2xl font-bold text-slate-800 block mt-1">1,247</span>
          </div>

          <div className="border border-slate-150 bg-slate-50/50 p-4 rounded-xl text-center">
            <span className="text-[10px] text-slate-450 block uppercase font-sans font-bold tracking-wider">Logged Success</span>
            <span className="text-2xl font-bold text-emerald-600 block mt-1">1,239</span>
          </div>

          <div className="border border-slate-150 bg-slate-50/50 p-4 rounded-xl text-center">
            <span className="text-[10px] text-slate-450 block uppercase font-sans font-bold tracking-wider">Unresolved Faults</span>
            <span className="text-2xl font-bold text-red-650 block mt-1">8</span>
          </div>

          <div className="border border-slate-150 bg-slate-50/50 p-4 rounded-xl text-center">
            <span className="text-[10px] text-slate-450 block uppercase font-sans font-bold tracking-wider">Active Operators</span>
            <span className="text-2xl font-bold text-brand-650 block mt-1">5</span>
          </div>

        </div>

      </div>

      {/* THREE ACTIONS BUTTONS AT THE BOTTOM (COMPLIANT ACADEMIC PROTOCOLS) */}
      <div className="flex flex-col md:flex-row gap-4 pt-4 font-sans text-xs">
        
        <button
          id="logs-export-csv-btn"
          onClick={() => triggerToast("Compiling tabular CSV database logs download...")}
          className="flex-1 border border-brand-500 hover:border-brand-600 bg-brand-50 hover:bg-brand-600 hover:text-white text-brand-700 py-3.5 rounded-xl font-bold uppercase tracking-wider transition-all cursor-pointer text-center"
        >
          Export Database to CSV format
        </button>

        <button
          id="logs-export-pdf-btn"
          onClick={() => triggerToast("Generating formal academic PDF audit trail document...")}
          className="flex-1 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 py-3.5 rounded-xl font-semibold uppercase tracking-wider transition-all cursor-pointer text-center"
        >
          Export Comprehensive PDF
        </button>

        <button
          id="logs-print-btn"
          onClick={() => triggerToast("Sending print signals to synchronized workstation devices...")}
          className="flex-1 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 py-3.5 rounded-xl font-semibold uppercase tracking-wider transition-all cursor-pointer text-center"
        >
          Print Log Audit Trail
        </button>

      </div>

    </div>
  );
};

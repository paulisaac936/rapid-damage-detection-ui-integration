import React from 'react';
import { Search, Bell, Menu, Radio } from 'lucide-react';
import { SystemStatus } from '../types';

interface HeaderProps {
  status: SystemStatus;
  toggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ status, toggleSidebar }) => {
  return (
    <header className="h-16 border-b border-white/5 bg-[#0b0c15]/90 backdrop-blur-sm flex items-center justify-between px-6 relative overflow-hidden shrink-0 z-10">
      
      {/* Scanline Animation */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-cyan-500/20 animate-scanline pointer-events-none" />

      <div className="flex items-center gap-6">
        <button onClick={toggleSidebar} className="text-slate-400 hover:text-white transition-colors">
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
            ResQ Sentinel AI
            <span className="px-1.5 py-0.5 rounded text-[9px] bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono tracking-widest">BETA</span>
          </h1>
          <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase">Rapid Disaster Infrastructure Assessment</p>
        </div>
      </div>

      {/* Center Search - Command Bar Style */}
      <div className="hidden md:flex items-center w-1/3 max-w-lg mx-4">
        <div className="w-full relative group">
          <input 
            type="text" 
            placeholder="Search Geo-ID / Infrastructure / Sector..." 
            className="w-full bg-[#13161f] border border-white/10 rounded-md py-2 pl-10 pr-4 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all placeholder:text-slate-600"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400" />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 bg-[#13161f] border border-white/10 rounded-md px-3 py-1.5">
           <span className="text-[10px] text-slate-400 font-mono">2026-02-16 14:35 UTC</span>
        </div>

        <div className={`flex items-center gap-2 px-3 py-1.5 rounded border ${
          status === SystemStatus.ONLINE ? 'bg-green-500/5 border-green-500/20 text-green-400' : 
          status === SystemStatus.PROCESSING ? 'bg-cyan-500/5 border-cyan-500/20 text-cyan-400' :
          'bg-red-500/5 border-red-500/20 text-red-400'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            status === SystemStatus.ONLINE ? 'bg-green-500' :
            status === SystemStatus.PROCESSING ? 'bg-cyan-500 animate-pulse' :
            'bg-red-500 animate-bounce'
          }`} />
          <span className="text-[10px] font-bold tracking-widest font-mono uppercase">{status}</span>
        </div>

        <div className="relative cursor-pointer">
          <Bell className="w-5 h-5 text-slate-400 hover:text-white transition-colors" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
        </div>
        
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 p-[1px] cursor-pointer">
           <div className="w-full h-full rounded-full bg-[#0b0c15] flex items-center justify-center">
             <span className="text-xs font-bold text-cyan-400">OP</span>
           </div>
        </div>
      </div>
    </header>
  );
};
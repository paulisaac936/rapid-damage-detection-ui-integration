import React, { useState } from 'react';
import { GlassCard } from './GlassCard';
import { 
  Save, Bell, Shield, Database, Users, Moon, Zap, Radio, 
  Cpu, Lock, Server, Terminal, Activity, Eye, Globe
} from 'lucide-react';

type SettingsTab = 'GENERAL' | 'DATA' | 'API' | 'SYSTEM' | 'LOGS';

export const SettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('GENERAL');

  const renderContent = () => {
    switch (activeTab) {
      case 'GENERAL':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white font-mono">INTERFACE & ALERTS</h3>
              <span className="text-xs text-slate-500 font-mono">UI-CONFIG-V3</span>
            </div>
            <GlassCard>
              <div className="space-y-5">
                <SettingToggle icon={<Bell className="w-4 h-4 text-cyan-400" />} label="Real-time Alerts" description="Push notifications for critical incidents" checked={true} />
                <SettingToggle icon={<Radio className="w-4 h-4 text-cyan-400" />} label="Audio Feedback" description="Tactical voice synthesis for alerts" checked={true} />
                <SettingToggle icon={<Moon className="w-4 h-4 text-cyan-400" />} label="High Contrast Mode" description="Optimized for sunlight visibility" checked={false} />
                <SettingToggle icon={<Eye className="w-4 h-4 text-cyan-400" />} label="Reduced Motion" description="Minimize UI animations for performance" checked={false} />
              </div>
            </GlassCard>
            
            <h3 className="text-lg font-bold text-white font-mono mt-8 mb-4">MAP PREFERENCES</h3>
            <GlassCard>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white/5 border border-white/10 rounded cursor-pointer hover:border-cyan-500/50 transition-all">
                  <div className="text-xs text-slate-400 mb-1">DEFAULT LAYER</div>
                  <div className="text-sm font-bold text-white">SATELLITE HYBRID</div>
                </div>
                <div className="p-3 bg-white/5 border border-white/10 rounded cursor-pointer hover:border-cyan-500/50 transition-all">
                  <div className="text-xs text-slate-400 mb-1">PROJECTION</div>
                  <div className="text-sm font-bold text-white">WGS 84 (EPSG:4326)</div>
                </div>
              </div>
            </GlassCard>
          </div>
        );
      case 'DATA':
        return (
          <div className="space-y-6 animate-fade-in">
             <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white font-mono">DATA STREAMS</h3>
              <div className="flex gap-2">
                 <span className="text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-1 rounded">2 ACTIVE</span>
              </div>
            </div>
            <GlassCard>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded border border-white/5 group hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Globe className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-200">Maxar SecureStream V2</div>
                      <div className="text-xs text-slate-500">Latency: 450ms • Bandwidth: 1.2GB/h</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                     <span className="text-xs text-green-400 font-mono">CONNECTED</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded border border-white/5 group hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Users className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-200">Civilian Reports (Crowdsource)</div>
                      <div className="text-xs text-slate-500">Source: Twitter/X, Public API</div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
                  </label>
                </div>
              </div>
            </GlassCard>
          </div>
        );
      case 'API':
        return (
          <div className="space-y-6 animate-fade-in">
             <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white font-mono">EXTERNAL INTEGRATIONS</h3>
            </div>
            <GlassCard>
              <div className="space-y-6">
                <div>
                  <label className="flex justify-between text-xs font-mono text-slate-400 mb-2">
                    <span>GOOGLE MAPS API KEY</span>
                    <span className="text-cyan-400 cursor-pointer hover:underline">Verify Key</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-black/30 border border-white/10 rounded px-3 py-3 text-sm text-slate-400 font-mono flex items-center gap-2">
                      <Lock className="w-3 h-3" />
                      <span>AIzaSyDummyKeyForUIPreview................</span>
                    </div>
                    <button className="px-4 py-2 bg-white/5 border border-white/10 rounded hover:bg-white/10 text-xs font-bold text-cyan-400">EDIT</button>
                  </div>
                </div>
                <div>
                  <label className="flex justify-between text-xs font-mono text-slate-400 mb-2">
                    <span>GEMINI PRO AI KEY</span>
                    <span className="text-green-400">Quota: 85% Remaining</span>
                  </label>
                   <div className="flex gap-2">
                    <div className="flex-1 bg-black/30 border border-white/10 rounded px-3 py-3 text-sm text-slate-400 font-mono flex items-center gap-2">
                      <Lock className="w-3 h-3" />
                      <span>********************************</span>
                    </div>
                    <button className="px-4 py-2 bg-white/5 border border-white/10 rounded hover:bg-white/10 text-xs font-bold text-cyan-400">EDIT</button>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        );
      case 'SYSTEM':
        return (
           <div className="space-y-6 animate-fade-in">
             <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white font-mono">SYSTEM DIAGNOSTICS</h3>
              <span className="text-xs text-green-400 font-mono flex items-center gap-1">
                 <Activity className="w-3 h-3" /> SYSTEM OPTIMAL
              </span>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
               <DiagnosticItem label="CPU LOAD" value="12%" status="normal" icon={<Cpu className="w-4 h-4 text-cyan-400" />} />
               <DiagnosticItem label="MEMORY" value="4.2GB" status="normal" icon={<Database className="w-4 h-4 text-purple-400" />} />
               <DiagnosticItem label="LATENCY" value="24ms" status="good" icon={<Zap className="w-4 h-4 text-yellow-400" />} />
               <DiagnosticItem label="UPTIME" value="14d 2h" status="normal" icon={<Server className="w-4 h-4 text-green-400" />} />
             </div>

             <GlassCard title="HEALTH CHECK">
                <div className="space-y-2">
                   <HealthRow label="Database Cluster (PostGIS)" status="ONLINE" latency="12ms" />
                   <HealthRow label="AI Inference Engine (TorchServe)" status="ONLINE" latency="85ms" />
                   <HealthRow label="Notification Service" status="IDLE" latency="-" />
                   <HealthRow label="Routing Engine (NetworkX)" status="ONLINE" latency="5ms" />
                </div>
             </GlassCard>
           </div>
        );
      default:
        return <div className="text-slate-500">Module not loaded.</div>;
    }
  };

  return (
    <div className="flex h-full bg-[#0b0c15] text-slate-200 overflow-hidden">
      {/* Sidebar Settings Nav */}
      <div className="w-64 border-r border-white/5 bg-[#0f172a]/50 p-6 flex flex-col gap-8">
        <div>
           <h2 className="text-xl font-bold text-white font-mono flex items-center gap-3 mb-1">
              SETTINGS
           </h2>
           <p className="text-[10px] text-slate-500 font-mono">V 3.0.1 CONFIGURATION</p>
        </div>

        <nav className="flex flex-col gap-2">
           <NavButton active={activeTab === 'GENERAL'} onClick={() => setActiveTab('GENERAL')} icon={<Shield className="w-4 h-4" />} label="General" />
           <NavButton active={activeTab === 'DATA'} onClick={() => setActiveTab('DATA')} icon={<Database className="w-4 h-4" />} label="Data Sources" />
           <NavButton active={activeTab === 'API'} onClick={() => setActiveTab('API')} icon={<Lock className="w-4 h-4" />} label="API Integrations" />
           <NavButton active={activeTab === 'SYSTEM'} onClick={() => setActiveTab('SYSTEM')} icon={<Server className="w-4 h-4" />} label="System Status" />
           <NavButton active={activeTab === 'LOGS'} onClick={() => setActiveTab('LOGS')} icon={<Terminal className="w-4 h-4" />} label="Event Logs" />
        </nav>

        <div className="mt-auto">
           <GlassCard className="bg-gradient-to-br from-cyan-900/20 to-transparent border-cyan-500/20">
              <div className="text-xs text-cyan-400 font-bold mb-1">PRO SUBSCRIPTION</div>
              <div className="text-[10px] text-slate-400 mb-3">Enterprise License Active</div>
              <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                 <div className="w-3/4 h-full bg-cyan-400"></div>
              </div>
           </GlassCard>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8 overflow-y-auto custom-scrollbar relative">
         <div className="max-w-4xl mx-auto">
            {renderContent()}

            <div className="mt-8 pt-8 border-t border-white/5 flex justify-end gap-4">
               <button className="px-6 py-2 rounded text-xs font-mono text-slate-400 hover:text-white transition-colors">
                  RESET DEFAULTS
               </button>
               <button className="px-6 py-2 bg-cyan-500/20 border border-cyan-500/50 rounded text-cyan-400 font-mono text-sm hover:bg-cyan-500/30 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                   <Save className="w-4 h-4" />
                   SAVE CHANGES
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

// Sub-components
const NavButton = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`
      w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
      ${active 
        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'}
    `}
  >
    {icon}
    {label}
  </button>
);

const SettingToggle = ({ icon, label, description, checked }: any) => (
  <div className="flex items-center justify-between p-1">
     <div className="flex items-center gap-3">
        <div className="p-2 rounded bg-white/5 border border-white/5">{icon}</div>
        <div>
           <div className="text-sm font-medium text-slate-200">{label}</div>
           <div className="text-xs text-slate-500">{description}</div>
        </div>
     </div>
     <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" defaultChecked={checked} />
        <div className="w-10 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
     </label>
  </div>
);

const DiagnosticItem = ({ label, value, status, icon }: any) => (
  <div className="p-4 bg-black/40 rounded-xl border border-white/5 flex flex-col items-center text-center gap-2 hover:border-white/10 transition-colors">
     <div className="p-2 rounded-full bg-white/5 mb-1">{icon}</div>
     <div className="text-[10px] text-slate-500 font-mono uppercase">{label}</div>
     <div className={`text-xl font-bold font-mono ${status === 'good' ? 'text-green-400' : 'text-white'}`}>{value}</div>
  </div>
);

const HealthRow = ({ label, status, latency }: any) => (
   <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
      <span className="text-sm text-slate-300">{label}</span>
      <div className="flex items-center gap-4">
         <span className="text-xs text-slate-500 font-mono">{latency}</span>
         <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${status === 'ONLINE' ? 'bg-green-500/10 text-green-400' : 'bg-slate-700 text-slate-400'}`}>
            {status}
         </span>
      </div>
   </div>
);

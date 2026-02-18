
import React from 'react';
import { 
  Truck, 
  MoreHorizontal, 
  Activity, 
  Shield, 
  Database,
  Search
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis } from 'recharts';
import { Unit } from '../types';

interface ResourceViewProps {
    units: Unit[];
}

export const ResourceView: React.FC<ResourceViewProps> = ({ units }) => {
  const missionData = [
      { name: 'Completed', value: 62, color: '#22d3ee' },
      { name: 'Remaining', value: 38, color: '#1e293b' }
  ];

  const deploymentData = [
      { name: 'TIME', val: 40 },
      { name: 'TIME', val: 70 },
      { name: 'TIME', val: 50 },
      { name: 'TIME', val: 85 },
      { name: 'TIME', val: 60 },
  ];

  return (
    <div className="p-4 h-full flex flex-col gap-4 bg-[#0b0c15] overflow-y-auto custom-scrollbar">
       
       {/* Header */}
       <div className="flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
              <div className="w-10 h-10 neumorphic-panel rounded flex items-center justify-center">
                  <Truck className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                  <h2 className="text-xl font-bold text-white tracking-widest font-mono uppercase">Resource Command</h2>
                  <p className="text-[10px] text-orange-500 font-mono uppercase">Unit Deployment & Logistics</p>
              </div>
          </div>
          {/* Duplicate Search and Status sections removed */}
       </div>

       {/* Top Row: Unit Cards (Physical Modules) */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-1/3 min-h-[180px]">
           <UnitModule 
                id="UNIT-04" 
                type="RESCUE SQUAD" 
                status="BUSY" 
                statusColor="bg-cyan-500 text-black" 
                battery={88} 
                load={100}
                active={true}
           />
           <UnitModule 
                id="UNIT-03" 
                type="MEDICAL SQUAD" 
                status="MOVING" 
                statusColor="bg-cyan-500 text-black" 
                battery={98} 
                load={60} 
           />
           <UnitModule 
                id="UNIT-02" 
                type="DRONE SCOUT" 
                status="IDLE" 
                statusColor="bg-slate-600 text-slate-300" 
                battery={45} 
                load={0} 
           />
       </div>

       {/* Bottom Row: Dashboard Split */}
       <div className="grid grid-cols-12 gap-4 flex-grow min-h-[300px]">
           
           {/* Bottom Left: Mission Overview */}
           <div className="col-span-12 lg:col-span-7 neumorphic-panel rounded-xl p-6 relative overflow-hidden">
               <div className="flex justify-between items-start mb-6">
                   <h3 className="text-sm font-bold text-slate-400 font-mono uppercase tracking-widest">Mission Overview</h3>
                   <MoreHorizontal className="w-4 h-4 text-slate-600" />
               </div>

               <div className="flex items-center justify-around h-full pb-6">
                   
                   {/* Donut Chart */}
                   <div className="relative w-48 h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={missionData}
                                    innerRadius={60}
                                    outerRadius={80}
                                    startAngle={90}
                                    endAngle={-270}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {missionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-bold text-white">62%</span>
                        </div>
                   </div>

                   {/* Stats Text */}
                   <div className="flex flex-col gap-6">
                       <div>
                           <div className="flex items-center gap-2 mb-1">
                               <div className="w-2 h-2 bg-cyan-400 rounded-sm"></div>
                               <span className="text-[10px] text-slate-400 font-mono uppercase">Operational Completion (87%)</span>
                           </div>
                           <div className="flex items-baseline gap-2">
                               <span className="text-xl font-bold text-white font-mono">377%</span>
                               <span className="text-xs text-green-500 font-mono">Efficiency</span>
                           </div>
                       </div>
                       
                       <div>
                           <div className="flex items-center gap-2 mb-1">
                               <div className="w-2 h-2 bg-slate-700 rounded-sm"></div>
                               <span className="text-[10px] text-slate-400 font-mono uppercase">Personnel Deployed (Sector)</span>
                           </div>
                           <div className="flex items-baseline gap-2">
                               <span className="text-xl font-bold text-white font-mono">377%</span>
                               <span className="text-xs text-red-500 font-mono">Early Warning</span>
                           </div>
                       </div>
                   </div>
                   
                   {/* Bar Chart */}
                   <div className="w-40 h-32">
                        <div className="text-[10px] text-slate-400 font-mono mb-2">Overall Completion</div>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={deploymentData}>
                                <Bar dataKey="val" fill="#22d3ee" radius={[2, 2, 0, 0]} />
                                <XAxis dataKey="name" tick={{fontSize: 8, fill: '#64748b'}} axisLine={false} tickLine={false} />
                            </BarChart>
                        </ResponsiveContainer>
                   </div>

               </div>
               
               {/* Background Pink Donut Removed */}
           </div>

           {/* Bottom Right: Live Map & Logs */}
           <div className="col-span-12 lg:col-span-5 flex flex-col gap-4">
               
               {/* Mini Map Card */}
               <div className="neumorphic-panel rounded-xl p-4 flex gap-4 h-1/2">
                   <div className="w-1/2 bg-[#0f172a] rounded border border-slate-700 relative overflow-hidden group">
                       <div className="absolute inset-0 tactical-grid opacity-50"></div>
                       {/* Mock Mini Map Nodes */}
                       <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                       <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-red-500 rounded-full border border-white"></div>
                       <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-orange-500 rounded-full border border-white"></div>
                       <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-green-500 rounded-full border border-white"></div>
                       <svg className="absolute inset-0 w-full h-full pointer-events-none">
                           <line x1="30%" y1="25%" x2="75%" y2="50%" stroke="rgba(255,255,255,0.1)" strokeDasharray="2,2" />
                       </svg>
                   </div>
                   
                   <div className="w-1/2 flex flex-col justify-between">
                       <div className="flex justify-between items-start">
                           <span className="text-xs font-bold text-white">Live Map</span>
                           <MoreHorizontal className="w-4 h-4 text-slate-600" />
                       </div>
                       
                       <div className="space-y-2">
                           <StatRow label="Fuel Reserves" val="74%" color="text-orange-400" />
                           <StatRow label="Medical Kits" val="29%" color="text-red-400" icon={<Shield className="w-3 h-3" />} />
                           <StatRow label="Drone Batteries" val="99%" color="text-green-400" />
                           <StatRow label="Rations" val="58%" color="text-green-400" />
                       </div>
                       
                       <div className="p-2 bg-black/40 rounded border border-white/5">
                           <div className="text-[10px] font-bold text-white">UNRESTRICTED</div>
                           <div className="text-[8px] text-slate-500">Drone Route</div>
                       </div>
                   </div>
               </div>

               {/* Communication Log */}
               <div className="neumorphic-panel rounded-xl p-4 h-1/2 overflow-hidden flex flex-col">
                   <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-slate-400 font-mono uppercase">Communication Log</span>
                        <MoreHorizontal className="w-4 h-4 text-slate-600" />
                   </div>
                   <div className="flex-grow space-y-3 overflow-y-auto custom-scrollbar pr-2">
                       <LogEntry id="Unit-04" msg="Landing zone secured. Awaiting extraction." time="14:02" />
                       <LogEntry id="Unit-01" msg="Blocked route detected sector 7B." time="14:00" warning />
                       <LogEntry id="Central" msg="Deploying drone swarm to grid 34." time="13:58" />
                       <LogEntry id="Medical" msg="Triage center established at Base Alpha." time="13:45" />
                       <LogEntry id="Unit-03" msg="Medical supplies running low." time="13:30" warning />
                   </div>
               </div>
           </div>

       </div>
    </div>
  );
};

/* --- Sub Components for ResourceView --- */

const UnitModule = ({ id, type, status, statusColor, battery, load, active }: any) => (
    <div className={`neumorphic-panel p-5 rounded-xl border ${active ? 'border-cyan-500/30 ring-1 ring-cyan-500/20' : 'border-transparent'} relative group hover:bg-[#161b26] transition-colors`}>
        <div className="flex justify-between items-start mb-6">
            <div className="flex gap-3 items-center">
                <div className={`p-2 rounded-lg ${active ? 'bg-cyan-900/20 text-cyan-400' : 'bg-slate-800 text-slate-500'}`}>
                    <Truck className="w-5 h-5" />
                </div>
                <div>
                    <div className="text-sm font-bold text-white font-mono">{id}</div>
                    <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">{type}</div>
                </div>
            </div>
            <MoreHorizontal className="w-4 h-4 text-slate-600 cursor-pointer hover:text-white" />
        </div>

        {/* Battery Bar (Segmented Look) */}
        <div className="mb-4">
            <div className="flex justify-between text-[9px] font-mono text-slate-500 mb-1">
                <span>BATTERY</span>
                <span className={active ? 'text-cyan-400' : 'text-slate-400'}>{battery}%</span>
            </div>
            <div className="h-2 w-full bg-[#0b0c15] rounded border border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 segmented-bar opacity-20 text-black z-10"></div>
                <div className={`h-full ${active ? 'bg-gradient-to-r from-cyan-600 to-cyan-400' : 'bg-slate-600'}`} style={{ width: `${battery}%` }}></div>
            </div>
        </div>
        
        <div className="flex justify-between items-end mt-4 pt-4 border-t border-white/5">
             <div className="px-2 py-0.5 rounded text-[9px] font-mono bg-slate-800 text-slate-400 border border-white/5">
                 IDLE
             </div>
             <div className={`px-4 py-1 rounded text-[10px] font-bold font-mono ${statusColor} shadow-lg`}>
                 {status}
             </div>
        </div>

        <div className="absolute top-2 right-2 flex gap-1">
             <div className="w-1 h-1 rounded-full bg-slate-600"></div>
             <div className="w-1 h-1 rounded-full bg-slate-600"></div>
        </div>
    </div>
);

const StatRow = ({ label, val, color, icon }: any) => (
    <div className="flex justify-between items-center text-[10px]">
        <div className="flex items-center gap-2 text-slate-400">
            {icon || <Database className="w-3 h-3" />}
            <span>{label}</span>
        </div>
        <span className={`font-mono font-bold ${color}`}>{val}</span>
    </div>
);

const LogEntry = ({ id, msg, time, warning }: any) => (
    <div className="flex gap-3 items-start border-l-2 border-slate-700 pl-3 py-1 hover:border-cyan-500 transition-colors">
        <div className="pt-0.5">
            <Activity className={`w-3 h-3 ${warning ? 'text-red-500' : 'text-slate-600'}`} />
        </div>
        <div>
            <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-bold text-slate-300 font-mono">{id}</span>
                <span className="text-[9px] text-slate-600">{time}</span>
            </div>
            <div className={`text-[10px] leading-tight ${warning ? 'text-red-400' : 'text-slate-500'}`}>{msg}</div>
        </div>
    </div>
);

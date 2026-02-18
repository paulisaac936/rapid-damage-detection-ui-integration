
import React from 'react';
import { 
  Network, 
  MoreHorizontal,
  Route,
  Target,
  MapPin
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const MissionView: React.FC = () => {
  const infraData = [
    { name: 'Active', value: 75, color: '#10b981' }, // Green
    { name: 'Damaged', value: 20, color: '#334155' }, // Slate
    { name: 'Crit', value: 5, color: '#0f172a' }      // Dark
  ];

  return (
    <div className="p-4 h-full flex flex-col bg-[#0b0c15] overflow-hidden">
       
       {/* Header */}
       <div className="flex justify-between items-center mb-4 shrink-0 px-2">
         <div className="flex items-center gap-3">
             <div className="p-2 neumorphic-panel rounded">
                <Network className="w-5 h-5 text-cyan-400" />
             </div>
             <div>
                <h2 className="text-xl font-bold text-white font-mono tracking-tight flex items-center gap-2">
                    ResQ Sentinel AI <span className="text-[10px] bg-cyan-900/30 text-cyan-400 border border-cyan-500/30 px-1 rounded">BETA</span>
                </h2>
                <p className="text-slate-500 text-[10px] font-mono uppercase tracking-widest">Sector Health & Route Analysis</p>
             </div>
         </div>
         {/* Duplicate Search/Status removed here */}
       </div>

       {/* Main Grid Layout */}
       <div className="grid grid-cols-12 gap-4 h-full overflow-hidden">
          
          {/* Left Column: Sector Controls */}
          <div className="col-span-12 lg:col-span-3 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2">
             
             {/* Sector Toggles */}
             <div className="space-y-4">
                 <SectorCard name="Downtown Core" status="assigned" assignedTo="ResQ_Squad_Alpha" active={false} />
                 <SectorCard name="Westside Hub" status="active" assignedTo="ResQ_Squad_Alpha" progress={85} active={true} />
                 <SectorCard name="Industrial Zone" status="assigned" assignedTo="ResQ_Squad_Bravo" active={false} />
                 <SectorCard name="Port Authority" status="assigned" assignedTo="ResQ_Squad_Naval" active={false} />
             </div>

             {/* Key Infrastructure Donut */}
             <div className="mt-auto">
                 <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex justify-between items-center">
                    <span>KEY INFRASTRUCTURE</span>
                    <MoreHorizontal className="w-4 h-4 text-slate-600" />
                 </div>
                 
                 <div className="neumorphic-panel rounded-xl p-4">
                    <div className="flex items-center gap-4">
                        <div className="w-24 h-24 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={infraData}
                                        innerRadius={30}
                                        outerRadius={40}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                        startAngle={90}
                                        endAngle={-270}
                                    >
                                        {infraData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-[10px] font-bold text-emerald-500">92%</span>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 flex-1">
                             <InfraStat label="BRIDGES" val="5%" />
                             <InfraStat label="TUNNELS" val="3%" />
                             <InfraStat label="HELIPADS" val="4%" />
                             <InfraStat label="HOSPITALS" val="4%" />
                        </div>
                    </div>
                 </div>
             </div>
          </div>

          {/* Center Column: Tactical Map (Vector) */}
          <div className="col-span-12 lg:col-span-6 flex flex-col">
              <div className="flex-grow neumorphic-inset rounded-xl relative overflow-hidden group border border-slate-800">
                  {/* Grid Background */}
                  <div className="absolute inset-0 tactical-grid opacity-30"></div>
                  
                  {/* Vector Map Simulation */}
                  <svg className="w-full h-full absolute inset-0 z-10" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
                      {/* Zones (Polygons with Gradients) */}
                      <defs>
                          <linearGradient id="zoneGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="rgba(15, 23, 42, 0.4)" />
                              <stop offset="100%" stopColor="rgba(30, 41, 59, 0.8)" />
                          </linearGradient>
                          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                              <feGaussianBlur stdDeviation="3" result="blur" />
                              <feComposite in="SourceGraphic" in2="blur" operator="over" />
                          </filter>
                      </defs>

                      {/* Zone Shapes */}
                      <path d="M50,50 L350,50 L450,400 L50,550 Z" fill="url(#zoneGrad1)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                      <path d="M350,50 L750,50 L600,350 L450,400 Z" fill="rgba(6,182,212,0.05)" stroke="rgba(6,182,212,0.3)" strokeWidth="1" />
                      <path d="M600,350 L750,50 L750,550 L450,550 L450,400 Z" fill="rgba(15, 23, 42, 0.6)" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

                      {/* Pathfinding Line */}
                      <path d="M250,200 L550,200 L650,450" fill="none" stroke="#22d3ee" strokeWidth="2" strokeDasharray="6,4" className="animate-pulse" filter="url(#glow)" />

                      {/* Node: Start */}
                      <g transform="translate(250, 200)">
                          <circle r="8" fill="rgba(239, 68, 68, 0.2)" className="animate-ping" />
                          <circle r="4" fill="#ef4444" stroke="#fff" strokeWidth="1" />
                          <text x="12" y="4" fill="#ef4444" fontSize="10" fontFamily="monospace" fontWeight="bold">ALERT POINT ALPHA</text>
                      </g>

                      {/* Node: Waypoint */}
                      <g transform="translate(550, 200)">
                          <circle r="4" fill="#10b981" stroke="#fff" strokeWidth="1" />
                          <text x="-20" y="-10" fill="#10b981" fontSize="10" fontFamily="monospace">WAYPOINT</text>
                      </g>

                      {/* Node: End */}
                      <g transform="translate(650, 450)">
                          <circle r="15" fill="none" stroke="#22d3ee" strokeWidth="1" strokeDasharray="2,2" className="animate-spin-slow" />
                          <circle r="4" fill="#22d3ee" stroke="#fff" strokeWidth="1" />
                          <text x="12" y="4" fill="#22d3ee" fontSize="10" fontFamily="monospace" fontWeight="bold">INCIDENT ZERO</text>
                      </g>
                  </svg>
                  
                  {/* Floating HUD Elements */}
                  <div className="absolute bottom-4 left-4 z-20 neumorphic-panel px-4 py-3 rounded-lg border border-slate-700">
                      <div className="text-[10px] text-slate-400 font-mono mb-2 uppercase tracking-widest">Service Catchment</div>
                      <div className="flex flex-col gap-2">
                          <LegendItem color="bg-emerald-500" label="Secured Zone B" />
                          <LegendItem color="bg-cyan-500" label="ResQ Unit Zone 8" />
                          <LegendItem color="bg-red-500" label="Restricted Zone" />
                      </div>
                  </div>
              </div>
          </div>

          {/* Right Column: Route Analysis */}
          <div className="col-span-12 lg:col-span-3 flex flex-col gap-4 overflow-y-auto custom-scrollbar pl-2">
             <RouteCard name="Route Alpha-1" score="SAFE" color="text-green-400" barColor="bg-green-500" eta="12m" />
             <RouteCard name="Route Bravo-4" score="CRITICAL" color="text-red-500" barColor="bg-red-500" eta="2m" width="30%" />
             <RouteCard name="Route Charlie-2" score="CAUTION" color="text-amber-500" barColor="bg-amber-500" eta="18m" width="60%" />
             <RouteCard name="Rosie Deantic-2" score="CAUTION" color="text-amber-500" barColor="bg-amber-500" eta="21m" width="55%" />
             
             <div className="mt-auto">
                 <button className="w-full py-3 neumorphic-panel text-cyan-400 rounded-lg text-xs font-bold font-mono hover:text-cyan-300 transition-all flex items-center justify-center gap-2 border border-cyan-900/50 shadow-[0_0_15px_rgba(34,211,238,0.1)]">
                     <Target className="w-4 h-4" />
                     ACTIVATE EVACUATION PLAN
                 </button>
             </div>
          </div>

       </div>
    </div>
  );
};

/* --- Sub Components for MissionView --- */

const SectorCard = ({ name, status, assignedTo, progress, active }: any) => (
    <div className={`neumorphic-panel p-4 rounded-xl border ${active ? 'border-emerald-500/30' : 'border-transparent'}`}>
        <div className="flex justify-between items-start mb-3">
            <div>
                <h3 className="text-sm font-bold text-white">{name}</h3>
                <div className="flex items-center gap-2 mt-1">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    <span className="text-[9px] text-slate-500 font-mono uppercase">{assignedTo}</span>
                </div>
            </div>
            {/* Skeuomorphic Toggle */}
            <input type="checkbox" className="skeuo-toggle" defaultChecked={active} />
        </div>
        
        {active && (
            <div className="mt-2 relative">
                <div className="flex justify-between items-center mb-1">
                     <span className="text-[9px] font-bold text-emerald-400 bg-emerald-900/30 px-1 rounded">85% SECURE</span>
                </div>
                <div className="h-1.5 w-full bg-[#0b0c15] rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-emerald-500" style={{ width: `${progress}%` }}></div>
                </div>
                {/* Circular Progress Indicator Overlay REMOVED as requested */}
            </div>
        )}
    </div>
);

const InfraStat = ({ label, val }: any) => (
    <div className="flex flex-col items-center p-2 bg-[#0b0c15] rounded border border-white/5">
        <span className="text-[8px] text-slate-500 uppercase font-mono">{label}</span>
        <span className="text-xs font-bold text-white">{val}</span>
    </div>
);

const LegendItem = ({ color, label }: any) => (
    <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-sm border border-white/20 ${color}`}></div>
        <span className="text-[9px] text-slate-300 font-mono">{label}</span>
    </div>
);

const RouteCard = ({ name, score, color, barColor, eta, width = "90%" }: any) => (
    <div className="neumorphic-panel p-4 rounded-xl border-l-2 border-l-slate-700 hover:border-l-cyan-500 transition-colors">
        <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
                <Route className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-bold text-white">{name}</span>
            </div>
            <span className={`text-[9px] font-bold border px-1.5 py-0.5 rounded ${color} border-current bg-opacity-10`}>{score}</span>
        </div>
        <div className="mb-2">
            <div className="flex justify-between text-[9px] text-slate-500 font-mono mb-1">
                <span>Safety Score: IMS</span>
                <span>ETA: {eta}</span>
            </div>
            <div className="h-1.5 w-full bg-[#0b0c15] rounded-full overflow-hidden">
                <div className={`h-full ${barColor}`} style={{ width: width }}></div>
            </div>
        </div>
    </div>
);

import React from 'react';
import { GlassCard } from './GlassCard';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line } from 'recharts';
import { Incident, Unit } from '../types';
import { Activity, TrendingUp, AlertTriangle, ShieldCheck, Zap, Users } from 'lucide-react';

interface AnalyticsViewProps {
  incidents: Incident[];
  units: Unit[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ incidents, units }) => {
  
  // Mock Complex Data
  const recoveryData = [
    { day: 'Day 1', predicted: 10, actual: 12 },
    { day: 'Day 2', predicted: 25, actual: 22 },
    { day: 'Day 3', predicted: 45, actual: 40 },
    { day: 'Day 4', predicted: 60, actual: 68 },
    { day: 'Day 5', predicted: 85, actual: 80 },
  ];

  const resourceAllocation = [
    { type: 'Drone Fleet', usage: 85, total: 100, color: '#06b6d4' },
    { type: 'Heavy Machinery', usage: 45, total: 100, color: '#f97316' },
    { type: 'Medical Units', usage: 92, total: 100, color: '#ef4444' },
    { type: 'Supplies', usage: 60, total: 100, color: '#22c55e' },
  ];

  const riskRadar = [
    { subject: 'Structural', A: 120, fullMark: 150 },
    { subject: 'Bio-Hazard', A: 40, fullMark: 150 },
    { subject: 'Fire', A: 86, fullMark: 150 },
    { subject: 'Flood', A: 20, fullMark: 150 },
    { subject: 'Power', A: 95, fullMark: 150 },
    { subject: 'Security', A: 65, fullMark: 150 },
  ];

  return (
    <div className="p-6 h-full overflow-y-auto custom-scrollbar bg-[#0b0c15]">
      
      {/* Tactical Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-white/5 pb-6">
        <div>
           <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-cyan-500 text-black text-[10px] font-bold font-mono">LIVE MISSION</span>
              <span className="text-[10px] text-slate-500 font-mono">OP-ID: 77-ALPHA-KILO</span>
           </div>
           <h2 className="text-3xl font-bold text-white font-mono tracking-tight">TACTICAL DASHBOARD</h2>
        </div>
        
        {/* Top Level Metrics */}
        <div className="flex gap-4">
           <TopMetric label="THREAT LEVEL" value="HIGH" color="text-red-500" icon={<AlertTriangle className="w-4 h-4" />} />
           <TopMetric label="AI CONFIDENCE" value="98.4%" color="text-cyan-400" icon={<Zap className="w-4 h-4" />} />
           <TopMetric label="CIVILIAN SAFETY" value="72%" color="text-orange-400" icon={<Users className="w-4 h-4" />} />
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-6 grid-rows-[auto_auto_auto]">
         
         {/* 1. Recovery Prediction (Line/Area) - Large */}
         <div className="col-span-12 lg:col-span-8 row-span-2">
            <GlassCard title="PREDICTIVE RECOVERY MODEL" className="h-[400px]">
               <div className="h-full w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={recoveryData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                           <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                           </linearGradient>
                           <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                           </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                        <Legend iconType="circle" />
                        <Area type="monotone" dataKey="predicted" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorPredicted)" name="AI Prediction" />
                        <Area type="monotone" dataKey="actual" stroke="#10b981" strokeDasharray="5 5" strokeWidth={2} fillOpacity={1} fill="url(#colorActual)" name="Actual Progress" />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
            </GlassCard>
         </div>

         {/* 2. Risk Radar - Square */}
         <div className="col-span-12 md:col-span-6 lg:col-span-4">
            <GlassCard title="MULTI-VECTOR RISK ANALYSIS" className="h-[250px]">
               <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={riskRadar}>
                     <PolarGrid stroke="#334155" />
                     <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                     <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                     <Radar name="Risk" dataKey="A" stroke="#ef4444" strokeWidth={2} fill="#ef4444" fillOpacity={0.2} />
                     <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                  </RadarChart>
               </ResponsiveContainer>
            </GlassCard>
         </div>

         {/* 3. Resource Allocation - Progress Bars */}
         <div className="col-span-12 md:col-span-6 lg:col-span-4">
            <GlassCard title="RESOURCE UTILIZATION" className="h-full min-h-[140px] flex flex-col justify-center gap-4">
               {resourceAllocation.map((res, i) => (
                  <div key={i} className="flex flex-col gap-1">
                     <div className="flex justify-between text-xs text-slate-300">
                        <span>{res.type}</span>
                        <span className="font-mono">{res.usage}%</span>
                     </div>
                     <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div 
                           className="h-full rounded-full transition-all duration-1000"
                           style={{ width: `${res.usage}%`, backgroundColor: res.color }} 
                        />
                     </div>
                  </div>
               ))}
            </GlassCard>
         </div>

         {/* 4. Live Feed Ticker - Wide Bottom */}
         <div className="col-span-12">
            <GlassCard className="flex items-center gap-4 py-3 bg-red-500/5 border-red-500/20">
               <div className="px-3 py-1 bg-red-500 text-white text-[10px] font-bold rounded animate-pulse">LIVE ALERT</div>
               <div className="flex-1 overflow-hidden relative h-6">
                  <div className="absolute whitespace-nowrap animate-marquee text-xs font-mono text-red-200 flex items-center gap-8">
                     <span>+++ SECTOR 7 BRIDGE COLLAPSE CONFIRMED VIA SIAMESE-NET +++</span>
                     <span>+++ MEDICAL DRONE U3 RE-ROUTING TO GRID 34.5 +++</span>
                     <span>+++ NEW SATELLITE IMAGERY INGESTED: SENTINEL-2A +++</span>
                     <span>+++ YOLOv8 DETECTED 3 BLOCKED ARTERIAL ROADS +++</span>
                  </div>
               </div>
            </GlassCard>
         </div>

      </div>
      <style>{`
        @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
        }
        .animate-marquee {
            animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

const TopMetric = ({ label, value, color, icon }: any) => (
    <div className="flex items-center gap-3 bg-white/5 border border-white/5 px-4 py-2 rounded-lg">
        <div className={`p-2 rounded bg-black/40 ${color}`}>{icon}</div>
        <div>
            <div className="text-[9px] text-slate-500 font-mono uppercase tracking-wider">{label}</div>
            <div className={`text-lg font-bold font-mono ${color}`}>{value}</div>
        </div>
    </div>
);
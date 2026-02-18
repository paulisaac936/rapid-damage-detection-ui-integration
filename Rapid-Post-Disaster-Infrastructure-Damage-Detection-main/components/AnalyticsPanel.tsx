import React, { useMemo } from 'react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Incident } from '../types';

interface AnalyticsPanelProps {
  type: 'inference' | 'severity' | 'trend';
  analyzing?: boolean;
  incidents?: Incident[];
}

const dataTrend = [
  { time: '10:00', risk: 30 },
  { time: '11:00', risk: 45 },
  { time: '12:00', risk: 55 },
  { time: '13:00', risk: 80 },
  { time: '14:00', risk: 75 },
  { time: '15:00', risk: 90 },
];

const COLORS = {
  CRITICAL: '#ef4444',
  MODERATE: '#f97316',
  LOW: '#22c55e'
};

const CHART_COLORS = ['#ef4444', '#f97316', '#22c55e'];

export const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ type, analyzing, incidents = [] }) => {
  
  // Dynamic data for severity pie chart
  const severityData = useMemo(() => {
    const critical = incidents.filter(i => i.severity === 'CRITICAL').length;
    const moderate = incidents.filter(i => i.severity === 'MODERATE').length;
    // Assuming some baseline safe areas for the chart visual balance
    const low = Math.max(1, 10 - critical - moderate); 
    
    return [
        { name: 'Critical', value: critical },
        { name: 'Moderate', value: moderate },
        { name: 'Low', value: low }
    ];
  }, [incidents]);

  // Dynamic data for Inference list
  const inferenceData = useMemo(() => {
    return incidents.map(inc => ({
        name: inc.label,
        value: inc.severity === 'CRITICAL' ? 95 + Math.random()*4 : 70 + Math.random()*10,
        color: inc.severity === 'CRITICAL' ? COLORS.CRITICAL : COLORS.MODERATE
    }));
  }, [incidents]);


  if (type === 'inference') {
    return (
      <div className="flex flex-col gap-3">
        {inferenceData.length === 0 ? (
            <div className="text-center text-xs text-slate-500 py-4">No Active Incidents</div>
        ) : inferenceData.slice(0, 4).map((item, index) => (
          <div key={index} className="flex flex-col gap-1">
             <div className="flex justify-between text-[10px]">
                <span className="font-medium text-slate-300 truncate w-24">{item.name}</span>
                <span className="font-mono text-slate-400">{analyzing ? Math.floor(Math.random()*100) : item.value.toFixed(1)}% Conf</span>
             </div>
             <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ 
                      width: `${analyzing ? Math.random() * 100 : item.value}%`, 
                      backgroundColor: item.color 
                  }}
                />
             </div>
          </div>
        ))}
        {inferenceData.length > 4 && (
             <div className="text-center text-[9px] text-slate-500 italic">+{inferenceData.length - 4} more incidents</div>
        )}
      </div>
    );
  }

  if (type === 'severity') {
      const total = incidents.length;
      return (
          <div className="h-32 w-full flex items-center">
             <div className="w-1/2 h-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={severityData}
                            cx="50%"
                            cy="50%"
                            innerRadius={25}
                            outerRadius={40}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {severityData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={CHART_COLORS[index]} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                {/* Center text */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
                    <span className="text-xs font-bold text-white">{total}</span>
                    <span className="text-[8px] text-slate-400">ALERTS</span>
                </div>
             </div>
             <div className="w-1/2 flex flex-col justify-center gap-2">
                 {severityData.map((entry, index) => (
                     <div key={index} className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: CHART_COLORS[index] }} />
                         <span className="text-[9px] text-slate-300 uppercase flex justify-between w-full pr-4">
                             {entry.name} <span className="text-slate-500 font-mono">{entry.value}</span>
                         </span>
                     </div>
                 ))}
             </div>
          </div>
      )
  }

  if (type === 'trend') {
    return (
      <div className="h-full w-full min-h-[120px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={dataTrend}>
            <defs>
              <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="time" tick={{fontSize: 9, fill: '#64748b'}} axisLine={false} tickLine={false} />
            <YAxis hide domain={[0, 100]} />
            <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '10px' }} 
                itemStyle={{ color: '#ef4444' }}
            />
            <Area 
                type="monotone" 
                dataKey="risk" 
                stroke="#ef4444" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorRisk)" 
                animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="text-center text-[10px] text-slate-500 mt-1">Flooding Progress - +15%/hr</div>
      </div>
    );
  }

  return null;
};
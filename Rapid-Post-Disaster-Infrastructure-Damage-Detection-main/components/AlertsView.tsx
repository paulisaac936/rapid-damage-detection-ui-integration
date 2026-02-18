import React, { useState } from 'react';
import { Incident } from '../types';
import { GlassCard } from './GlassCard';
import { FileText, Download, Share2, AlertOctagon, X, Printer, CheckCircle } from 'lucide-react';

interface AlertsViewProps {
  incidents: Incident[];
}

export const AlertsView: React.FC<AlertsViewProps> = ({ incidents }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [reportContent, setReportContent] = useState("");

  const handleGenerateClick = () => {
     const content = `OFFICIAL DAMAGE ASSESSMENT REPORT
Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}
Sector: 7 (Los Angeles Downtown)
Authority: ResQ Sentinel Command

------------------------------------------------
MISSION SUMMARY
------------------------------------------------
Total Incidents Detected: ${incidents.length}
Critical Status: ${incidents.some(i => i.severity === 'CRITICAL') ? 'ACTIVE' : 'CLEAR'}
Operational Units: 3

------------------------------------------------
INCIDENT LOG
------------------------------------------------
${incidents.map(i => `[${new Date(i.timestamp).toLocaleTimeString()}] ${i.type} - ${i.label}
   Severity: ${i.severity}
   Location: ${i.coordinates.lat.toFixed(5)}, ${i.coordinates.lng.toFixed(5)}`).join('\n')}

------------------------------------------------
AUTOMATED RECOMMENDATIONS
------------------------------------------------
1. Deploy structural engineering team to Sector 4.
2. Reroute civilian traffic away from bridge collapse zone.
3. Prioritize medical drone drops at Grid 34.52.

[END OF REPORT]`;
     setReportContent(content);
     setShowPreview(true);
  };

  return (
    <div className="p-6 h-full overflow-y-auto custom-scrollbar relative">
       <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white font-mono flex items-center gap-3">
            <span className="w-2 h-8 bg-red-500 rounded-full animate-pulse"></span>
            ACTIVE ALERTS & REPORTS
          </h2>
          <button 
            onClick={handleGenerateClick}
            className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/50 text-cyan-400 rounded flex items-center gap-2 hover:bg-cyan-500/20 transition-colors"
          >
             <Download className="w-4 h-4" />
             Generate PDF Report
          </button>
       </div>

       <div className="flex gap-6">
          {/* Alert Feed */}
          <div className="w-2/3 flex flex-col gap-4">
             {incidents.map(inc => (
               <GlassCard key={inc.id} className="border-l-4 border-l-red-500">
                  <div className="flex justify-between items-start">
                     <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                           <AlertOctagon className="w-6 h-6 text-red-500" />
                        </div>
                        <div>
                           <h3 className="text-lg font-bold text-slate-200">{inc.label}</h3>
                           <p className="text-sm text-slate-400">Coordinates: {inc.coordinates.lat.toFixed(4)}, {inc.coordinates.lng.toFixed(4)}</p>
                           <p className="text-xs text-slate-500 mt-1">Time: {new Date(inc.timestamp).toLocaleTimeString()}</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">CRITICAL</span>
                        <div className="mt-2 text-xs text-slate-400">Confidence: 98%</div>
                     </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/5 flex gap-4">
                     <button className="text-xs text-cyan-400 hover:underline">View on Map</button>
                     <button className="text-xs text-slate-400 hover:text-white">Assign Unit</button>
                     <button className="text-xs text-slate-400 hover:text-white">Dismiss</button>
                  </div>
               </GlassCard>
             ))}
             
             {incidents.length === 0 && (
                <div className="p-8 text-center text-slate-500 border border-dashed border-white/10 rounded-xl">
                   No active alerts. System nominal.
                </div>
             )}
          </div>

          {/* Generated Reports List */}
          <div className="w-1/3 flex flex-col gap-4">
             <GlassCard title="ARCHIVED REPORTS">
                <div className="flex flex-col gap-2">
                   {[
                     { title: 'Damage_Assessment_Sector4.pdf', date: 'Today, 10:00 AM' },
                     { title: 'Route_Safety_Audit_Alpha.pdf', date: 'Yesterday, 4:30 PM' },
                     { title: 'Incident_Summary_Log_24h.pdf', date: 'Yesterday, 08:00 AM' }
                   ].map((doc, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded hover:bg-white/10 transition-colors group cursor-pointer">
                         <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-slate-400 group-hover:text-cyan-400" />
                            <div>
                               <div className="text-xs text-slate-200 font-mono group-hover:text-cyan-200">{doc.title}</div>
                               <div className="text-[10px] text-slate-500">{doc.date}</div>
                            </div>
                         </div>
                         <Download className="w-4 h-4 text-slate-500 hover:text-white" />
                      </div>
                   ))}
                </div>
             </GlassCard>
             
             <GlassCard title="DECISION SUPPORT">
                <div className="p-2 text-xs text-slate-300 space-y-2">
                   <p>Based on current metrics, the following actions are recommended:</p>
                   <ul className="list-disc pl-4 space-y-1 text-slate-400">
                      <li>Prioritize bridge inspection at Sector B.</li>
                      <li>Deploy medical drone to grid 34.52, -118.24.</li>
                      <li>Route supply convoys via Northern Arterial.</li>
                   </ul>
                </div>
             </GlassCard>
          </div>
       </div>

       {/* Modal Preview */}
       {showPreview && (
         <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-[#0f172a] border border-cyan-500/30 rounded-xl w-full max-w-3xl shadow-[0_0_50px_rgba(6,182,212,0.1)] flex flex-col max-h-[85vh]">
               {/* Modal Header */}
               <div className="flex justify-between items-center p-4 border-b border-white/10 bg-white/5 rounded-t-xl">
                  <div className="flex items-center gap-3">
                     <div className="p-2 rounded bg-cyan-500/10 border border-cyan-500/20">
                        <FileText className="w-5 h-5 text-cyan-400" />
                     </div>
                     <div>
                        <h3 className="text-base font-mono font-bold text-white tracking-wider">REPORT PREVIEW</h3>
                        <p className="text-[10px] text-slate-400">Verify content before export</p>
                     </div>
                  </div>
                  <button onClick={() => setShowPreview(false)} className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded">
                     <X className="w-5 h-5" />
                  </button>
               </div>
               
               {/* Modal Body */}
               <div className="p-6 flex-1 overflow-hidden flex flex-col gap-2 bg-[#0b0c15]">
                  <textarea 
                    value={reportContent}
                    onChange={(e) => setReportContent(e.target.value)}
                    className="flex-1 w-full bg-[#13161f] border border-white/10 rounded-lg p-6 font-mono text-xs md:text-sm text-slate-300 focus:outline-none focus:border-cyan-500/50 resize-none leading-relaxed custom-scrollbar shadow-inner"
                    spellCheck={false}
                  />
               </div>

               {/* Modal Footer */}
               <div className="p-4 border-t border-white/10 bg-white/5 rounded-b-xl flex justify-between items-center">
                  <div className="text-[10px] text-slate-500 font-mono">
                      GENERATED BY RESQ SENTINEL AI V3.0
                  </div>
                  <div className="flex gap-3">
                    <button 
                        onClick={() => setShowPreview(false)}
                        className="px-4 py-2 rounded text-xs font-mono text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        CANCEL
                    </button>
                    <button 
                        onClick={() => {
                            // Simulation of download
                            const blob = new Blob([reportContent], { type: 'text/plain' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `Damage_Report_${Date.now()}.txt`;
                            a.click();
                            setShowPreview(false);
                        }}
                        className="px-6 py-2 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 rounded text-xs font-mono font-bold flex items-center gap-2 hover:bg-cyan-500/30 transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                    >
                        <Printer className="w-4 h-4" />
                        CONFIRM & DOWNLOAD
                    </button>
                  </div>
               </div>
            </div>
         </div>
       )}
    </div>
  );
};
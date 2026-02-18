import React, { useState, useEffect } from 'react';
import { GlassCard } from './GlassCard';
import { 
  UploadCloud, 
  FileImage, 
  Database, 
  Globe, 
  Cpu, 
  Layers, 
  ScanLine, 
  Activity, 
  CheckCircle2, 
  ArrowRight,
  Server,
  Lock
} from 'lucide-react';

export const SatelliteView: React.FC = () => {
  const [pipelineStep, setPipelineStep] = useState(0);
  const [processingFile, setProcessingFile] = useState<string | null>(null);

  // Simulate the AI Pipeline sequence
  const startPipeline = (filename: string) => {
    setProcessingFile(filename);
    setPipelineStep(1); // Uploading
    
    setTimeout(() => setPipelineStep(2), 1500); // Pre-processing
    setTimeout(() => setPipelineStep(3), 3000); // Siamese U-Net
    setTimeout(() => setPipelineStep(4), 5000); // Attention U-Net
    setTimeout(() => setPipelineStep(5), 7000); // YOLOv8
    setTimeout(() => {
        setPipelineStep(0);
        setProcessingFile(null);
    }, 9000); // Done
  };

  return (
    <div className="p-8 h-full flex flex-col gap-6 overflow-y-auto custom-scrollbar bg-[#0b0c15]">
       
       <div className="flex justify-between items-end mb-2">
         <div>
            <h2 className="text-3xl font-bold text-white font-mono tracking-tight flex items-center gap-3">
                <Globe className="w-8 h-8 text-cyan-400 animate-spin-slow" />
                DATA INGESTION & AI PIPELINE
            </h2>
            <p className="text-slate-400 text-xs font-mono mt-1 ml-1">MULTIMODAL SENSOR FUSION // DEEP LEARNING INFERENCE</p>
         </div>
         <div className="flex gap-4">
            <div className="px-3 py-1 rounded bg-white/5 border border-white/10 text-[10px] text-slate-400 font-mono flex items-center gap-2">
                <Server className="w-3 h-3" /> STORAGE: 45TB / 1PB
            </div>
            <div className="px-3 py-1 rounded bg-green-500/10 border border-green-500/20 text-[10px] text-green-400 font-mono flex items-center gap-2">
                <Cpu className="w-3 h-3" /> GPU CLUSTER: ONLINE
            </div>
         </div>
       </div>

       <div className="grid grid-cols-12 gap-6 h-full">
          
          {/* Left Col: Upload & Sources */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
             <GlassCard className="flex-shrink-0 relative group cursor-pointer border-dashed hover:border-cyan-500 transition-colors">
                <div 
                    className="h-40 flex flex-col items-center justify-center gap-3"
                    onClick={() => startPipeline('Sector7_Drone_Mosaic_V3.tiff')}
                >
                   <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(6,182,212,0.15)]">
                      <UploadCloud className="w-8 h-8 text-cyan-400" />
                   </div>
                   <div className="text-center">
                     <h3 className="text-sm font-bold text-slate-200">DROP GEOSPATIAL DATA</h3>
                     <p className="text-[10px] text-slate-500 mt-1 font-mono">SUPPORTED: GEOTIFF, LAZ, JSON, MP4</p>
                   </div>
                </div>
                {processingFile && (
                   <div className="absolute inset-0 bg-[#0b0c15]/90 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                      <div className="text-xs font-mono text-cyan-400 animate-pulse">UPLOADING STREAM...</div>
                      <div className="w-1/2 h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
                         <div className="h-full bg-cyan-400 animate-loading-bar"></div>
                      </div>
                   </div>
                )}
             </GlassCard>

             <GlassCard title="ACTIVE SATELLITE FEEDS" className="flex-grow">
                <div className="space-y-3">
                    {[
                        { name: 'SENTINEL-2A', region: 'Sector 7 (LA)', status: 'LIVE', lat: '35ms' },
                        { name: 'MAXAR WORLDVIEW-3', region: 'Global', status: 'BUFFERING', lat: '120ms' },
                        { name: 'PLANETSCOPE', region: 'Sector 4', status: 'LIVE', lat: '45ms' },
                        { name: 'USGS LANDSAT 9', region: 'Historical', status: 'STANDBY', lat: '-' },
                    ].map((sat, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded hover:bg-white/10 transition-all group">
                            <div className="flex items-center gap-3">
                                <Globe className={`w-4 h-4 ${sat.status === 'LIVE' ? 'text-green-400' : 'text-slate-500'}`} />
                                <div>
                                    <div className="text-xs font-bold text-slate-200">{sat.name}</div>
                                    <div className="text-[10px] text-slate-500 font-mono">{sat.region}</div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${sat.status === 'LIVE' ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'}`}>
                                    {sat.status}
                                </span>
                                <span className="text-[9px] text-slate-600 font-mono mt-1">{sat.lat}</span>
                            </div>
                        </div>
                    ))}
                </div>
             </GlassCard>
          </div>

          {/* Right Col: Deep Learning Pipeline Visualization */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
             
             {/* The Pipeline Visualizer */}
             <div className="relative h-64 bg-[#0f172a] rounded-xl border border-cyan-500/20 p-6 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(0deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                
                <div className="relative z-10 h-full flex items-center justify-between px-4">
                    
                    {/* Step 1: Ingest */}
                    <PipelineNode 
                        label="RAW INGEST" 
                        icon={<Database className="w-5 h-5" />} 
                        active={pipelineStep >= 1} 
                        processing={pipelineStep === 1}
                    />
                    <PipelineConnector active={pipelineStep > 1} />

                    {/* Step 2: Siamese U-Net */}
                    <PipelineNode 
                        label="SIAMESE U-NET" 
                        subLabel="Change Detection"
                        icon={<Layers className="w-5 h-5" />} 
                        active={pipelineStep >= 3} 
                        processing={pipelineStep === 3}
                        color="text-purple-400"
                        borderColor="border-purple-500"
                    />
                    <PipelineConnector active={pipelineStep > 3} />

                    {/* Step 3: Attention U-Net */}
                    <PipelineNode 
                        label="ATTENTION U-NET" 
                        subLabel="Damage Seg."
                        icon={<ScanLine className="w-5 h-5" />} 
                        active={pipelineStep >= 4} 
                        processing={pipelineStep === 4}
                        color="text-red-400"
                        borderColor="border-red-500"
                    />
                    <PipelineConnector active={pipelineStep > 4} />

                    {/* Step 4: YOLOv8 */}
                    <PipelineNode 
                        label="YOLO v8" 
                        subLabel="Road Obstruction"
                        icon={<Activity className="w-5 h-5" />} 
                        active={pipelineStep >= 5} 
                        processing={pipelineStep === 5}
                        color="text-orange-400"
                        borderColor="border-orange-500"
                    />
                    <PipelineConnector active={pipelineStep > 5} />

                    {/* Step 5: Database */}
                    <PipelineNode 
                        label="POSTGIS DB" 
                        icon={<Server className="w-5 h-5" />} 
                        active={pipelineStep === 0 && processingFile === null} 
                        processing={false}
                        color="text-green-400"
                        borderColor="border-green-500"
                    />

                </div>
             </div>

             {/* Processing Logs / Terminal */}
             <GlassCard title="INFERENCE LOGS" className="flex-1 font-mono text-xs overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                    <LogLine time="14:30:01" type="INFO" msg="System initialized. Waiting for input stream." />
                    <LogLine time="14:30:05" type="INFO" msg="Connected to PostGIS:5432 (Spatial Ext Enabled)" />
                    {pipelineStep >= 1 && <LogLine time="14:35:10" type="DATA" msg={`Receiving stream: ${processingFile}...`} />}
                    {pipelineStep >= 2 && <LogLine time="14:35:12" type="PROC" msg="Normalizing geospatial coordinates (EPSG:4326)..." />}
                    {pipelineStep >= 3 && <LogLine time="14:35:15" type="AI" msg="Loading Siamese U-Net (ResNet50 backbone)..." color="text-purple-400" />}
                    {pipelineStep >= 3 && <LogLine time="14:35:18" type="AI" msg="> Change Map Generated (Confidence: 94.2%)" color="text-purple-400" />}
                    {pipelineStep >= 4 && <LogLine time="14:35:20" type="AI" msg="Loading Attention U-Net..." color="text-red-400" />}
                    {pipelineStep >= 4 && <LogLine time="14:35:22" type="AI" msg="> Segmentation Mask Applied (12 buildings identified)" color="text-red-400" />}
                    {pipelineStep >= 5 && <LogLine time="14:35:24" type="AI" msg="Loading YOLOv8 (Road Model)..." color="text-orange-400" />}
                    {pipelineStep >= 5 && <LogLine time="14:35:26" type="AI" msg="> 3 Obstructions Bounding Boxes Detected" color="text-orange-400" />}
                    {pipelineStep === 0 && processingFile === null && <LogLine time="14:35:28" type="SUCCESS" msg="Data committed to Vector Layer. Ready for query." color="text-green-400" />}
                </div>
             </GlassCard>

          </div>
       </div>
    </div>
  );
};

const PipelineNode = ({ label, subLabel, icon, active, processing, color = 'text-cyan-400', borderColor = 'border-cyan-500' }: any) => (
    <div className={`flex flex-col items-center gap-3 relative z-10 transition-all duration-500 ${active || processing ? 'opacity-100 scale-105' : 'opacity-40 scale-95'}`}>
        <div className={`
            w-12 h-12 rounded-lg flex items-center justify-center border-2 bg-[#0b0c15] shadow-[0_0_20px_rgba(0,0,0,0.5)]
            ${active || processing ? `${borderColor} ${color} shadow-[0_0_15px_currentColor]` : 'border-slate-700 text-slate-700'}
        `}>
            {processing ? <Activity className="w-6 h-6 animate-spin" /> : icon}
        </div>
        <div className="text-center">
            <div className={`text-[10px] font-bold tracking-wider ${active ? 'text-white' : 'text-slate-600'}`}>{label}</div>
            {subLabel && <div className="text-[8px] text-slate-500">{subLabel}</div>}
        </div>
        {processing && (
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-white rounded-full animate-ping"></div>
        )}
    </div>
);

const PipelineConnector = ({ active }: { active: boolean }) => (
    <div className="flex-1 h-0.5 mx-2 bg-slate-800 relative overflow-hidden">
        <div className={`absolute inset-0 bg-cyan-500 transition-transform duration-1000 ${active ? 'translate-x-0' : '-translate-x-full'}`}></div>
    </div>
);

const LogLine = ({ time, type, msg, color = 'text-slate-300' }: any) => (
    <div className="flex gap-3 hover:bg-white/5 p-1 rounded">
        <span className="text-slate-600">[{time}]</span>
        <span className={`w-12 font-bold ${type === 'AI' ? 'text-cyan-400' : type === 'SUCCESS' ? 'text-green-400' : 'text-slate-500'}`}>{type}</span>
        <span className={color}>{msg}</span>
    </div>
);
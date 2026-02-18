
import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  Map as MapIcon, 
  AlertTriangle, 
  Settings, 
  Cpu, 
  Satellite, 
  ShieldCheck,
  UploadCloud,
  Play,
  FileUp,
  Image as ImageIcon,
  CheckCircle2,
  Navigation,
  ArrowRight,
  AlertOctagon,
  Timer,
  Compass,
  Truck
} from 'lucide-react';
import { SystemStatus, LayerType, Incident, Unit, ViewType } from './types';
import { GlassCard } from './components/GlassCard';
import { Header } from './components/Header';
import { MapView } from './components/MapView';
import { AnalyticsPanel } from './components/AnalyticsPanel';
import { ControlPanel } from './components/ControlPanel';
import { AnalyticsView } from './components/AnalyticsView';
import { SatelliteView } from './components/SatelliteView';
import { AlertsView } from './components/AlertsView';
import { SettingsView } from './components/SettingsView';
import { MissionView } from './components/MissionView';
import { ResourceView } from './components/ResourceView';
import { DamageAnalysisDisplay } from './components/DamageAnalysisDisplay';
import apiService from './services/apiService';

// Los Angeles Coordinates Center
const CENTER_LAT = 34.0522;
const CENTER_LNG = -118.2437;

const initialIncidents: Incident[] = [
  { id: '1', type: 'DAMAGE', severity: 'MODERATE', coordinates: { x: 250, y: 250, lat: 34.0622, lng: -118.2537 }, label: 'Sector 4 Damage', timestamp: Date.now() },
  { id: '2', type: 'BLOCKED', severity: 'CRITICAL', coordinates: { x: 850, y: 600, lat: 34.0422, lng: -118.2337 }, label: 'Bridge Collapse', timestamp: Date.now() },
  { id: '3', type: 'DAMAGE', severity: 'CRITICAL', coordinates: { x: 0, y: 0, lat: 34.048, lng: -118.26 }, label: 'Grid Failure', timestamp: Date.now() },
];

const initialUnits: Unit[] = [
  { id: 'u1', type: 'RESCUE', status: 'MOVING', coordinates: { x: 400, y: 400, lat: 34.0552, lng: -118.2457 }, heading: 45 },
  { id: 'u2', type: 'MEDICAL', status: 'IDLE', coordinates: { x: 600, y: 300, lat: 34.0582, lng: -118.2387 }, heading: 90 },
  { id: 'u3', type: 'DRONE', status: 'MOVING', coordinates: { x: 200, y: 700, lat: 34.0322, lng: -118.2637 }, heading: 180 },
];

const App: React.FC = () => {
  const [activeLayers, setActiveLayers] = useState<Set<LayerType>>(new Set([LayerType.SATELLITE, LayerType.HEATMAP, LayerType.ROADS]));
  const [systemStatus, setSystemStatus] = useState<SystemStatus>(SystemStatus.ONLINE);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState<ViewType>(ViewType.DASHBOARD);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [showAnalysisResult, setShowAnalysisResult] = useState(false);
  
  // Routing Tool State
  const [routingState, setRoutingState] = useState<'IDLE' | 'CALCULATING' | 'CALCULATED'>('IDLE');
  const [selectedRouteStart, setSelectedRouteStart] = useState<string>('base-alpha');
  const [selectedRouteEnd, setSelectedRouteEnd] = useState<string>('incident-1');
  const [routeResult, setRouteResult] = useState<{ risk: number; eta: string; status: string } | null>(null);

  // Image Upload State
  const [preImage, setPreImage] = useState<string>("https://picsum.photos/100/100?grayscale");
  const [postImage, setPostImage] = useState<string>("https://picsum.photos/101/101?grayscale");
  const [isCustomImages, setIsCustomImages] = useState(false);
  const preInputRef = useRef<HTMLInputElement>(null);
  const postInputRef = useRef<HTMLInputElement>(null);

  // Real-time Data State
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
  const [units, setUnits] = useState<Unit[]>(initialUnits);
  const [lastAlertTime, setLastAlertTime] = useState<number>(Date.now());

  const toggleLayer = (layer: LayerType) => {
    const newLayers = new Set(activeLayers);
    if (newLayers.has(layer)) {
      newLayers.delete(layer);
    } else {
      newLayers.add(layer);
    }
    setActiveLayers(newLayers);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setImg: (url: string) => void) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setImg(url);
      setIsCustomImages(true);
    }
  };

  const handleComputeRoute = () => {
    setRoutingState('CALCULATING');
    setTimeout(() => {
        setRoutingState('CALCULATED');
        setRouteResult({
            risk: Math.floor(Math.random() * 20) + 5, // Random low-ish risk
            eta: '14m 30s',
            status: 'CLEARED'
        });
        // Auto-enable roads layer if not active
        if(!activeLayers.has(LayerType.ROADS)) toggleLayer(LayerType.ROADS);
    }, 1500);
  };

  const runAnalysis = async () => {
    if (analyzing || !isCustomImages) {
      alert('Please upload pre and post satellite images first');
      return;
    }
    
    setAnalyzing(true);
    setSystemStatus(SystemStatus.PROCESSING);
    setAnalysisProgress(0);

    try {
      // Convert data URLs to files
      const preImageBlob = await fetch(preImage).then(r => r.blob());
      const postImageBlob = await fetch(postImage).then(r => r.blob());
      
      const preFile = new File([preImageBlob], 'pre_image.jpg', { type: 'image/jpeg' });
      const postFile = new File([postImageBlob], 'post_image.jpg', { type: 'image/jpeg' });

      // Simulate progress bar
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => Math.min(prev + 15, 80));
      }, 200);

      // Call real API
      const result = await apiService.analyzeChangeDetection(preFile, postFile);
      
      clearInterval(progressInterval);
      setAnalysisProgress(100);
      
      if (result.status === 'success') {
        setAnalysisResult(result.analysis);
        setShowAnalysisResult(true);
        
        // Add incident based on damage percentage
        const damagePercent = result.analysis.damage_percentage || 0;
        if (damagePercent > 10) {
          setIncidents(prev => [
            ...prev,
            { 
              id: Date.now().toString(), 
              type: 'DAMAGE', 
              severity: damagePercent > 70 ? 'CRITICAL' : damagePercent > 40 ? 'MODERATE' : 'LOW',
              coordinates: { x: 500, y: 500, lat: CENTER_LAT + 0.005, lng: CENTER_LNG - 0.005 }, 
              label: `AI Detected ${damagePercent.toFixed(1)}% Damage`, 
              timestamp: Date.now() 
            }
          ]);
          setLastAlertTime(Date.now());
        }
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      setAnalysisResult({ status: 'ERROR', error: String(error) });
      setShowAnalysisResult(true);
    } finally {
      setAnalyzing(false);
      setSystemStatus(SystemStatus.ONLINE);
    }
  };

  // Simulation Loop
  useEffect(() => {
    const simInterval = setInterval(() => {
      const now = Date.now();

      // 1. Move Units randomly (Simulating GPS updates)
      setUnits(prevUnits => prevUnits.map(unit => {
        // State transitions
        if (unit.status === 'IDLE' && Math.random() > 0.97) return { ...unit, status: 'MOVING' };
        if (unit.status === 'MOVING' && Math.random() > 0.99) return { ...unit, status: 'IDLE' };

        if (unit.status === 'MOVING') {
          // Move
          const speed = 0.0003; // degrees approx
          // Biased random walk towards center if too far
          const distToCenterLat = CENTER_LAT - unit.coordinates.lat;
          const distToCenterLng = CENTER_LNG - unit.coordinates.lng;
          
          let dLat = (Math.random() - 0.5) * speed;
          let dLng = (Math.random() - 0.5) * speed;

          // Weak pull to center to keep them in view
          if (Math.abs(distToCenterLat) > 0.06) dLat += distToCenterLat * 0.02;
          if (Math.abs(distToCenterLng) > 0.06) dLng += distToCenterLng * 0.02;
          
          let newLat = unit.coordinates.lat + dLat;
          let newLng = unit.coordinates.lng + dLng;
          
          // Calculate heading
          const heading = (Math.atan2(dLng, dLat) * (180 / Math.PI) + 360) % 360;

          return { ...unit, coordinates: { ...unit.coordinates, lat: newLat, lng: newLng }, heading: heading };
        }
        return unit;
      }));

      // 2. Dynamic Incidents Simulation
      setIncidents(prevIncidents => {
        const r = Math.random();
        
        // Remove an incident (Resolved) - 1% chance if > 3 incidents
        if (prevIncidents.length > 3 && r < 0.01) {
            return prevIncidents.slice(1);
        }

        // Add an incident - 1.5% chance
        if (r > 0.985) {
             const types: Incident['type'][] = ['DAMAGE', 'BLOCKED', 'HAZARD'];
             const severities: Incident['severity'][] = ['LOW', 'MODERATE', 'CRITICAL'];
             const type = types[Math.floor(Math.random() * types.length)];
             const severity = severities[Math.floor(Math.random() * severities.length)];
             
             // Random location near center
             const lat = CENTER_LAT + (Math.random() - 0.5) * 0.05;
             const lng = CENTER_LNG + (Math.random() - 0.5) * 0.05;
             
             const newInc: Incident = {
                 id: `inc-${now}`,
                 type,
                 severity,
                 coordinates: { x: 0, y: 0, lat, lng },
                 label: `${type} Alert`,
                 timestamp: now
             };
             setLastAlertTime(now); 
             return [...prevIncidents, newInc];
        }
        
        // Update severity of existing - 2% chance
        if (r > 0.5 && r < 0.52 && prevIncidents.length > 0) {
             const idx = Math.floor(Math.random() * prevIncidents.length);
             const severities: Incident['severity'][] = ['LOW', 'MODERATE', 'CRITICAL'];
             const updated = [...prevIncidents];
             updated[idx] = {
                 ...updated[idx],
                 severity: severities[Math.floor(Math.random() * severities.length)],
                 timestamp: now
             };
             return updated;
        }

        return prevIncidents;
      });

    }, 1000);

    return () => clearInterval(simInterval);
  }, []);

  const renderContent = () => {
    switch(currentView) {
      case ViewType.MISSION:
        return <MissionView />;
      case ViewType.RESOURCES:
        return <ResourceView units={units} />;
      case ViewType.ANALYTICS:
        return <AnalyticsView incidents={incidents} units={units} />;
      case ViewType.SATELLITE:
        return <SatelliteView />;
      case ViewType.ALERTS:
        return <AlertsView incidents={incidents} />;
      case ViewType.SETTINGS:
        return <SettingsView />;
      case ViewType.DASHBOARD:
      default:
        return (
          <div className="flex-1 p-4 grid grid-cols-12 grid-rows-12 gap-4 overflow-hidden h-full">
            {/* Left Control Column */}
            <div className="col-span-12 md:col-span-3 lg:col-span-2 row-span-12 flex flex-col gap-4 overflow-y-auto pr-1 custom-scrollbar">
              
              <GlassCard title="LAYER TOGGLE" className="flex-shrink-0">
                <ControlPanel activeLayers={activeLayers} onToggle={toggleLayer} />
              </GlassCard>

              <GlassCard title="TEMPORAL SLIDER" className="flex-shrink-0 min-h-[180px]">
                <div className="flex justify-between gap-2 mb-4">
                  {/* Pre Image Upload */}
                  <div className="flex flex-col gap-1 items-center cursor-pointer group" onClick={() => preInputRef.current?.click()}>
                    <div className="w-16 h-12 rounded bg-slate-800 border border-white/10 overflow-hidden relative group-hover:border-cyan-500/50 transition-colors">
                      <img src={preImage} className="opacity-70 object-cover w-full h-full" alt="Pre" />
                      <div className="absolute inset-0 flex items-center justify-center text-[8px] font-mono bg-black/40 group-hover:bg-black/20">
                        <FileUp className="w-4 h-4 text-white opacity-0 group-hover:opacity-100" />
                        <span className="group-hover:hidden">PRE</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 group-hover:text-cyan-400">Upload Pre</span>
                    <input type="file" ref={preInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, setPreImage)} />
                  </div>

                  {/* Post Image Upload */}
                  <div className="flex flex-col gap-1 items-center cursor-pointer group" onClick={() => postInputRef.current?.click()}>
                    <div className="w-16 h-12 rounded bg-slate-800 border border-red-500/30 overflow-hidden relative group-hover:border-red-500 transition-colors">
                      <img src={postImage} className="opacity-70 object-cover w-full h-full" alt="Post" />
                      <div className="absolute inset-0 flex items-center justify-center text-[8px] font-mono bg-red-900/20 group-hover:bg-red-900/10">
                        <FileUp className="w-4 h-4 text-white opacity-0 group-hover:opacity-100" />
                        <span className="group-hover:hidden">POST</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-red-400 group-hover:text-white">Upload Post</span>
                    <input type="file" ref={postInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, setPostImage)} />
                  </div>
                </div>
                <input type="range" className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
                
                {/* Comparison Insights (Shows up if custom images are loaded) */}
                {isCustomImages && analysisResult && (
                  <div className="mt-4 pt-4 border-t border-white/10 animate-fade-in-up">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-3 h-3 text-cyan-400" />
                      <span className="text-[10px] font-bold text-slate-300">CHANGE DETECTION RESULTS</span>
                    </div>
                    <div className="space-y-2">
                       <div className="flex justify-between text-[9px]">
                          <span className="text-slate-400">Damage Detected</span>
                          <span className={`font-mono ${analysisResult.damage_percentage > 50 ? 'text-red-400' : 'text-amber-400'}`}>
                            {analysisResult.damage_percentage?.toFixed(1) || 0}%
                          </span>
                       </div>
                       <div className="w-full h-1 bg-slate-800 rounded-full">
                          <div 
                            className={`h-full rounded-full transition-all ${analysisResult.damage_percentage > 50 ? 'bg-red-500' : 'bg-amber-500'}`}
                            style={{ width: `${analysisResult.damage_percentage || 0}%` }}
                          ></div>
                       </div>
                       <div className="flex justify-between text-[9px]">
                          <span className="text-slate-400">Confidence Score</span>
                          <span className="text-cyan-400 font-mono">{((analysisResult.confidence || 0) * 100).toFixed(1)}%</span>
                       </div>
                       <div className="w-full h-1 bg-slate-800 rounded-full">
                          <div 
                            className="h-full bg-cyan-500 rounded-full transition-all"
                            style={{ width: `${(analysisResult.confidence || 0) * 100}%` }}
                          ></div>
                       </div>
                    </div>
                  </div>
                )}
              </GlassCard>

              <GlassCard title="AI OPERATIONS" className="flex-shrink-0">
                <div className="flex flex-col gap-3">
                    <div className="p-3 border border-dashed border-white/10 rounded-lg bg-white/5 flex flex-col items-center justify-center text-center gap-2 hover:bg-white/10 transition-colors cursor-pointer group">
                      <UploadCloud className="w-6 h-6 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                      <span className="text-xs text-slate-400">Ingest New Data Source</span>
                    </div>
                    
                    <button 
                      onClick={runAnalysis}
                      disabled={analyzing}
                      className={`
                        relative overflow-hidden w-full py-3 rounded bg-cyan-500/10 border border-cyan-500/50 
                        text-cyan-400 font-mono text-xs uppercase tracking-wider hover:bg-cyan-500/20 transition-all
                        flex items-center justify-center gap-2
                        ${analyzing ? 'cursor-not-allowed opacity-80' : ''}
                      `}
                    >
                      {analyzing ? (
                        <>
                          <Activity className="w-4 h-4 animate-spin" />
                          Processing... {Math.round(analysisProgress)}%
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          Run Analysis
                        </>
                      )}
                      {analyzing && (
                        <div 
                          className="absolute bottom-0 left-0 h-0.5 bg-cyan-400 transition-all duration-75" 
                          style={{ width: `${analysisProgress}%` }}
                        />
                      )}
                    </button>
                </div>
              </GlassCard>

              <GlassCard title="ACTIVE UNITS" className="flex-grow">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400">Search & Rescue</span>
                  <span className="text-xs text-cyan-400 font-mono">{units.filter(u => u.status === 'MOVING').length} MOVING</span>
                </div>
                <div className="flex flex-col gap-2 overflow-y-auto max-h-[150px] custom-scrollbar">
                    {units.map(unit => (
                      <div key={unit.id} className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/5 hover:bg-white/10 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${unit.status === 'MOVING' ? 'bg-cyan-400 animate-pulse' : 'bg-slate-500'}`} />
                          <span className="text-[10px] font-mono text-slate-300">{unit.type}-{unit.id.toUpperCase()}</span>
                        </div>
                        <span className="text-[9px] text-slate-500">{unit.coordinates.lat.toFixed(3)}, {unit.coordinates.lng.toFixed(3)}</span>
                      </div>
                    ))}
                </div>
              </GlassCard>
            </div>

            {/* Center Map Area - REAL MAP */}
            <div className="col-span-12 md:col-span-6 lg:col-span-7 row-span-12 relative rounded-xl overflow-hidden border border-white/10 bg-black/40 shadow-2xl">
              <div className="absolute inset-0 z-0">
                  <MapView 
                    activeLayers={activeLayers} 
                    analyzing={analyzing}
                    incidents={incidents}
                    units={units}
                  />
              </div>

              {/* Map Overlays (Floating UI) */}
              <div className="absolute top-6 left-6 z-[400] pointer-events-auto">
                 <button 
                   onClick={() => setCurrentView(ViewType.ALERTS)}
                   className="group relative flex flex-col items-center justify-center bg-[#450a0a]/80 border border-red-500/40 rounded px-3 py-1.5 hover:bg-red-600 hover:border-red-400 hover:shadow-[0_0_20px_rgba(239,68,68,0.8),0_0_40px_rgba(239,68,68,0.4)] transition-all duration-300 backdrop-blur-md active:scale-95"
                 >
                    <span className="text-[10px] font-black text-red-200 tracking-widest group-hover:text-white transition-colors uppercase">LIVE ALERT</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                       <span className="w-1 h-1 bg-red-500 rounded-full animate-pulse group-hover:bg-white shadow-[0_0_5px_currentColor]"></span>
                       <span className="text-[8px] font-mono text-red-400 uppercase group-hover:text-red-100 tracking-wider">++ NEW SATELLITE DATA ++</span>
                    </div>
                 </button>
              </div>
              
              <div className="absolute bottom-4 right-4 z-[400] flex flex-col gap-2 pointer-events-none">
                  <div className="glass-panel px-4 py-2 rounded border border-white/10 pointer-events-auto">
                    <div className="text-[10px] text-slate-400 uppercase tracking-widest">Map Center</div>
                    <div className="font-mono text-xs text-cyan-300">{CENTER_LAT}° N, {CENTER_LNG}° W</div>
                  </div>
              </div>
            </div>

            {/* Right Analytics Column */}
            <div className="col-span-12 md:col-span-3 lg:col-span-3 row-span-12 flex flex-col gap-4 overflow-y-auto pl-1 custom-scrollbar">
              
              <GlassCard title="AI INFERENCE PANEL" className="flex-shrink-0">
                <AnalyticsPanel type="inference" analyzing={analyzing} incidents={incidents} />
              </GlassCard>

              {/* INTELLIGENT ROUTING TOOL */}
              <GlassCard title="INTELLIGENT ROUTING" className="flex-shrink-0">
                 <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-2">
                       <label className="text-[10px] text-slate-500 font-mono uppercase">Start Node</label>
                       <div className="relative">
                          <select 
                            value={selectedRouteStart}
                            onChange={(e) => setSelectedRouteStart(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50 appearance-none font-mono"
                          >
                            <option value="base-alpha">Med-Base Alpha (Safe Zone)</option>
                            <option value="fob-zulu">FOB Zulu (Perimeter)</option>
                            <option value="airfield">Main Airfield</option>
                          </select>
                          <Navigation className="w-3 h-3 text-cyan-500 absolute right-3 top-2.5 pointer-events-none" />
                       </div>
                    </div>

                    <div className="flex justify-center -my-1">
                       <ArrowRight className="w-4 h-4 text-slate-600 rotate-90" />
                    </div>

                    <div className="flex flex-col gap-2">
                       <label className="text-[10px] text-slate-500 font-mono uppercase">Target Destination</label>
                       <div className="relative">
                          <select 
                             value={selectedRouteEnd}
                             onChange={(e) => setSelectedRouteEnd(e.target.value)}
                             className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50 appearance-none font-mono"
                          >
                             {incidents.map(inc => (
                               <option key={inc.id} value={`incident-${inc.id}`}>
                                  {inc.label} ({inc.severity})
                               </option>
                             ))}
                          </select>
                          <AlertTriangle className="w-3 h-3 text-red-500 absolute right-3 top-2.5 pointer-events-none" />
                       </div>
                    </div>

                    <button 
                       onClick={handleComputeRoute}
                       disabled={routingState === 'CALCULATING'}
                       className={`
                         mt-2 w-full py-2 rounded flex items-center justify-center gap-2 text-xs font-bold tracking-wider transition-all
                         ${routingState === 'CALCULATING' 
                            ? 'bg-cyan-500/10 text-cyan-600 cursor-wait' 
                            : 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 border border-cyan-500/40'}
                       `}
                    >
                       {routingState === 'CALCULATING' ? (
                          <>
                            <Activity className="w-3 h-3 animate-spin" />
                            COMPUTING...
                          </>
                       ) : 'COMPUTE SAFE PATH'}
                    </button>

                    {/* Calculation Results */}
                    {routingState === 'CALCULATED' && routeResult && (
                       <div className="mt-2 p-3 bg-white/5 rounded border border-white/10 animate-fade-in-up">
                          <div className="flex items-center justify-between mb-2">
                             <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-green-400" />
                                <span className="text-xs font-bold text-green-400">PATH CLEARED</span>
                             </div>
                             <span className="text-[10px] font-mono text-slate-400">ID: RT-992</span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-center">
                             <div className="p-2 bg-black/20 rounded">
                                <div className="text-[9px] text-slate-500 uppercase">Risk Score</div>
                                <div className="text-sm font-bold text-cyan-400 font-mono">{routeResult.risk}%</div>
                             </div>
                             <div className="p-2 bg-black/20 rounded">
                                <div className="text-[9px] text-slate-500 uppercase">Est. Time</div>
                                <div className="text-sm font-bold text-white font-mono">{routeResult.eta}</div>
                             </div>
                          </div>
                          
                          <div className="mt-2 text-[9px] text-slate-400 text-center">
                             *Avoided 2 structural hazards
                          </div>
                       </div>
                    )}
                 </div>
              </GlassCard>

              <GlassCard title="DAMAGE SEVERITY" className="flex-shrink-0">
                <AnalyticsPanel type="severity" incidents={incidents} />
              </GlassCard>

              <GlassCard title="RISK TREND LINE" className="flex-grow min-h-[150px]">
                <AnalyticsPanel type="trend" />
              </GlassCard>

            </div>
          </div>
        );
    }
  }

  return (
    <div className="flex h-screen w-full bg-[#0b0c15] text-slate-200 overflow-hidden relative selection:bg-cyan-500/30">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.03),transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-50" />

      {/* Sidebar Navigation */}
      <aside 
        className={`z-50 h-full glass-panel border-r border-white/5 transition-all duration-300 ease-in-out flex flex-col ${isSidebarOpen ? 'w-20' : 'w-0 overflow-hidden'}`}
      >
        <div className="h-16 flex items-center justify-center border-b border-white/5">
          <Cpu className="w-8 h-8 text-cyan-400 animate-pulse" />
        </div>
        
        <nav className="flex-1 flex flex-col items-center py-6 gap-6">
          <NavIcon 
            icon={<MapIcon />} 
            active={currentView === ViewType.DASHBOARD} 
            onClick={() => setCurrentView(ViewType.DASHBOARD)} 
          />
          <NavIcon 
            icon={<Compass />} 
            active={currentView === ViewType.MISSION} 
            onClick={() => setCurrentView(ViewType.MISSION)}
          />
          <NavIcon 
            icon={<Truck />} 
            active={currentView === ViewType.RESOURCES} 
            onClick={() => setCurrentView(ViewType.RESOURCES)}
          />
          <NavIcon 
            icon={<Activity />} 
            active={currentView === ViewType.ANALYTICS} 
            onClick={() => setCurrentView(ViewType.ANALYTICS)}
          />
          <NavIcon 
            icon={<Satellite />} 
            active={currentView === ViewType.SATELLITE} 
            onClick={() => setCurrentView(ViewType.SATELLITE)}
          />
          <NavIcon 
            icon={<AlertTriangle />} 
            active={currentView === ViewType.ALERTS} 
            alert={incidents.some(i => i.severity === 'CRITICAL')} 
            onClick={() => setCurrentView(ViewType.ALERTS)}
          />
          <NavIcon 
            icon={<Settings />} 
            active={currentView === ViewType.SETTINGS} 
            onClick={() => setCurrentView(ViewType.SETTINGS)}
          />
        </nav>

        <div className="p-4 flex flex-col items-center gap-4 border-t border-white/5">
          <div className={`w-2 h-2 rounded-full shadow-[0_0_10px_currentColor] transition-colors duration-500 ${systemStatus === SystemStatus.WARNING ? 'bg-red-500 text-red-500' : 'bg-green-500 text-green-500'}`} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative h-full overflow-hidden">
        <Header 
          status={systemStatus} 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
        {renderContent()}
        
        {/* Footer */}
        <footer className="h-8 border-t border-white/5 bg-[#0b0c15] flex items-center justify-between px-4 text-[10px] text-slate-500 font-mono shrink-0">
           <div className="flex gap-4">
             <span>LAT: {CENTER_LAT.toFixed(4)} N, LONG: {CENTER_LNG.toFixed(4)} W</span>
             <span>ACTIVE UNITS: {units.length}</span>
             <span>DETECTED INCIDENTS: {incidents.length}</span>
           </div>
           <div className="flex gap-4">
             <span className={`${systemStatus === SystemStatus.WARNING ? 'text-red-500' : 'text-green-500'} transition-colors duration-300`}>
               SYSTEM HEALTH: {systemStatus}
             </span>
             <span>V 3.0.1 ALPHA</span>
           </div>
        </footer>
      </main>

      {/* Damage Analysis Result Display Modal */}
      {showAnalysisResult && (
        <DamageAnalysisDisplay 
          result={analysisResult} 
          onClose={() => setShowAnalysisResult(false)}
        />
      )}
    </div>
  );
};

// Sub-component for Nav Icons
const NavIcon = ({ icon, active = false, alert = false, onClick }: { icon: React.ReactNode, active?: boolean, alert?: boolean, onClick?: () => void }) => (
  <div 
    onClick={onClick}
    className={`
      w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 relative group
      ${active ? 'bg-cyan-500/10 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)] border border-cyan-500/20' : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'}
    `}
  >
    {icon}
    {active && <div className="absolute -left-[18px] w-1 h-6 bg-cyan-400 rounded-r shadow-[0_0_10px_#22d3ee]" />}
    {alert && <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_#ef4444]" />}
  </div>
);

export default App;

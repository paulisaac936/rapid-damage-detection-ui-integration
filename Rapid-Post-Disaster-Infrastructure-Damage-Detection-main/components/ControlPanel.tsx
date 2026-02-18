import React from 'react';
import { LayerType } from '../types';

interface ControlPanelProps {
  activeLayers: Set<LayerType>;
  onToggle: (layer: LayerType) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ activeLayers, onToggle }) => {
  
  const ToggleItem = ({ label, layer, colorClass }: { label: string, layer: LayerType, colorClass: string }) => {
    const isActive = activeLayers.has(layer);
    return (
      <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isActive ? colorClass : 'bg-slate-700'}`} />
          <span className={`text-[11px] font-medium transition-colors ${isActive ? 'text-slate-200' : 'text-slate-500'}`}>
            {label}
          </span>
        </div>
        <button 
          onClick={() => onToggle(layer)}
          className={`
            w-8 h-4 rounded-full relative transition-colors duration-300 focus:outline-none
            ${isActive ? 'bg-cyan-500/20 border border-cyan-500/50' : 'bg-slate-800 border border-white/10'}
          `}
        >
           <div className={`
             absolute top-0.5 left-0.5 w-2.5 h-2.5 rounded-full bg-white transition-transform duration-300
             ${isActive ? 'translate-x-4 bg-cyan-400 shadow-[0_0_8px_#22d3ee]' : 'bg-slate-500'}
           `} />
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col">
      <ToggleItem label="Satellite" layer={LayerType.SATELLITE} colorClass="bg-green-500" />
      <ToggleItem label="LIDAR Scan" layer={LayerType.LIDAR} colorClass="bg-blue-500" />
      <ToggleItem label="Damage Heatmap" layer={LayerType.HEATMAP} colorClass="bg-red-500 animate-pulse" />
      <ToggleItem label="Safe Routes" layer={LayerType.ROADS} colorClass="bg-cyan-500" />
      <ToggleItem label="GeoJSON Overlay" layer={LayerType.GEOJSON} colorClass="bg-fuchsia-500" />
    </div>
  );
};

import React, { useEffect, useRef } from 'react';
import { LayerType, Incident, Unit } from '../types';

// Declare Leaflet Types globally since we use CDN
declare global {
  interface Window {
    L: any;
  }
}

interface MapViewProps {
  activeLayers: Set<LayerType>;
  analyzing: boolean;
  incidents: Incident[];
  units: Unit[];
}

export const MapView: React.FC<MapViewProps> = ({ activeLayers, analyzing, incidents, units }) => {
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  // Refs to store layer groups and individual markers for diffing
  const layersRef = useRef<{ 
    incidents?: any; 
    units?: any; 
    heat?: any; 
    routes?: any; 
    geoJson?: any; 
  }>({});
  
  const incidentMarkersRef = useRef<{ [id: string]: any }>({});
  const unitMarkersRef = useRef<{ [id: string]: any }>({});
  
  // Track previous state to optimize updates and prevent popup closures
  const prevUnitsRef = useRef<{ [id: string]: Unit }>({});
  const prevIncidentsRef = useRef<{ [id: string]: Incident }>({});

  // 1. Initialize Map
  useEffect(() => {
    if (typeof window.L === 'undefined' || !mapContainerRef.current) return;
    if (mapRef.current) return; // Already initialized

    const L = window.L;
    
    // Los Angeles Center
    const map = L.map(mapContainerRef.current, {
        center: [34.0522, -118.2437],
        zoom: 14,
        zoomControl: false,
        attributionControl: false
    });

    // Dark Matter Tiles (CartoDB)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
        opacity: 0.9
    }).addTo(map);

    // Custom Zoom Control
    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);

    // Initialize Layer Groups
    layersRef.current.incidents = L.layerGroup().addTo(map);
    layersRef.current.units = L.layerGroup().addTo(map);
    layersRef.current.heat = L.layerGroup();
    layersRef.current.routes = L.layerGroup();
    layersRef.current.geoJson = L.layerGroup();

    mapRef.current = map;

    return () => {
       map.remove();
       mapRef.current = null;
    };
  }, []);

  // 2. Handle Static/Toggleable Layers (Heatmap, Roads, GeoJSON)
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const L = window.L;

    // HEATMAP
    if (activeLayers.has(LayerType.HEATMAP)) {
        if (!map.hasLayer(layersRef.current.heat)) {
             layersRef.current.heat.addTo(map);
             // Re-generate heat data
             layersRef.current.heat.clearLayers();
             
             if (incidents.length > 0) {
                const heatPoints = incidents.map(inc => [
                    inc.coordinates.lat, 
                    inc.coordinates.lng, 
                    inc.severity === 'CRITICAL' ? 1.0 : 0.5 
                ]);
                // Noise
                for(let i=0; i<20; i++) {
                    heatPoints.push([
                        34.0522 + (Math.random()-0.5)*0.03, 
                        -118.2437 + (Math.random()-0.5)*0.03, 
                        Math.random() * 0.4
                    ]);
                }
                const heatLayer = L.heatLayer(heatPoints, {
                    radius: 35,
                    blur: 20,
                    gradient: {0.4: 'blue', 0.65: 'lime', 1: 'red'},
                    minOpacity: 0.3
                });
                layersRef.current.heat.addLayer(heatLayer);
             }
        }
    } else {
        if (map.hasLayer(layersRef.current.heat)) map.removeLayer(layersRef.current.heat);
    }

    // ROADS
    if (activeLayers.has(LayerType.ROADS)) {
        if (!map.hasLayer(layersRef.current.routes)) {
            layersRef.current.routes.addTo(map);
            layersRef.current.routes.clearLayers();
            const roads = [
                [[34.07, -118.25], [34.03, -118.25], 'green'],
                [[34.05, -118.27], [34.05, -118.22], 'green'],
                [[34.055, -118.245], [34.045, -118.235], 'red'],
                [[34.06, -118.26], [34.06, -118.23], 'orange'],
                [[34.04, -118.26], [34.04, -118.23], 'green'],
                [[34.065, -118.24], [34.035, -118.24], 'green'],
            ];
            roads.forEach((road: any) => {
                const color = road[2] === 'green' ? '#10b981' : (road[2] === 'red' ? '#ef4444' : '#f97316');
                L.polyline([road[0], road[1]], {
                    color: color,
                    weight: 4,
                    opacity: 0.7,
                    lineCap: 'round'
                }).addTo(layersRef.current.routes);
            });
        }
    } else {
        if (map.hasLayer(layersRef.current.routes)) map.removeLayer(layersRef.current.routes);
    }

    // GEOJSON
    if (activeLayers.has(LayerType.GEOJSON)) {
        if (!map.hasLayer(layersRef.current.geoJson)) {
            layersRef.current.geoJson.addTo(map);
            layersRef.current.geoJson.clearLayers();
            const sampleGeoJSON = {
                "type": "FeatureCollection",
                "features": [
                    {
                        "type": "Feature",
                        "properties": { "name": "Secure Perimeter Alpha", "type": "RESTRICTED" },
                        "geometry": { "type": "Polygon", "coordinates": [[[-118.255, 34.045], [-118.235, 34.045], [-118.235, 34.060], [-118.255, 34.060], [-118.255, 34.045]]] }
                    },
                    {
                         "type": "Feature",
                         "properties": { "name": "Evacuation Zone B", "type": "ACTIVE" },
                         "geometry": { "type": "Polygon", "coordinates": [[[-118.242, 34.052], [-118.238, 34.052], [-118.238, 34.055], [-118.242, 34.055], [-118.242, 34.052]]] }
                    }
                ]
            };
            L.geoJSON(sampleGeoJSON, {
                style: (feature: any) => ({
                    color: feature.properties.type === 'RESTRICTED' ? "#d946ef" : "#f59e0b",
                    weight: 1,
                    opacity: 0.8,
                    fillColor: feature.properties.type === 'RESTRICTED' ? "#d946ef" : "#f59e0b",
                    fillOpacity: 0.15,
                    dashArray: '4, 4'
                })
            }).addTo(layersRef.current.geoJson);
        }
    } else {
        if (map.hasLayer(layersRef.current.geoJson)) map.removeLayer(layersRef.current.geoJson);
    }
  }, [activeLayers, incidents]);

  // 3. Handle Incidents (Diffing Logic)
  useEffect(() => {
     if (!mapRef.current) return;
     const L = window.L;
     const layerGroup = layersRef.current.incidents;
     const currentIds = new Set();

     incidents.forEach(inc => {
        currentIds.add(inc.id);
        const existingMarker = incidentMarkersRef.current[inc.id];
        const prevInc = prevIncidentsRef.current[inc.id];
        
        // Only update styling if severity or type changes to avoid flickering/closing popups
        const shouldUpdateIcon = !prevInc || prevInc.severity !== inc.severity || prevInc.type !== inc.type;

        const isCritical = inc.severity === 'CRITICAL';
        const color = isCritical ? '#ef4444' : (inc.severity === 'MODERATE' ? '#f97316' : '#eab308');
        const glowColor = isCritical ? 'rgba(239, 68, 68, 0.8)' : (inc.severity === 'MODERATE' ? 'rgba(249, 115, 22, 0.8)' : 'rgba(234, 179, 8, 0.8)');
        
        const svgPath = inc.type === 'DAMAGE' 
            ? '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>'
            : inc.type === 'BLOCKED'
            ? '<circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>'
            : '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>';

        const iconHtml = `
            <div class="relative group flex items-center justify-center w-14 h-14">
                ${isCritical ? `<div class="absolute inset-0 rounded-full bg-[${color}] opacity-50 animate-ping"></div>` : ''}
                <div class="relative z-10 w-12 h-12 rounded-full bg-[#0f172a] border-2 border-[${color}] flex items-center justify-center shadow-[0_0_25px_${glowColor}] hover:scale-110 transition-transform duration-200 cursor-pointer backdrop-blur-md">
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        ${svgPath}
                     </svg>
                </div>
                ${isCritical ? `<div class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-[#0f172a] shadow-[0_0_15px_#ef4444] animate-bounce"></div>` : ''}
            </div>
        `;

        const icon = L.divIcon({
            html: iconHtml,
            className: 'bg-transparent',
            iconSize: [56, 56],
            iconAnchor: [28, 28],
            popupAnchor: [0, -32]
        });

        const popupContent = `
            <div class="font-sans min-w-[280px] text-left p-1">
                <div class="flex items-center justify-between mb-3 pb-2 border-b border-white/5">
                    <span class="text-xs font-bold text-[${color}] tracking-widest uppercase flex items-center gap-2">
                        ${isCritical ? '<span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>' : ''}
                        ${inc.type}
                    </span>
                    <span class="text-[10px] font-mono text-slate-400">ID: ${inc.id.split('-').pop()}</span>
                </div>
                
                <div class="mb-4">
                    <h3 class="text-base font-bold text-white mb-1 leading-tight">${inc.label}</h3>
                    <div class="text-[10px] text-slate-400 font-mono flex items-center gap-2 mt-2">
                       <span class="px-2 py-0.5 rounded bg-[${color}]/10 text-[${color}] border border-[${color}]/20">SEVERITY: ${inc.severity}</span>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-2 mb-4">
                    <div class="bg-[#1e293b] p-2 rounded-lg shadow-[inset_2px_2px_4px_#0f172a,inset_-2px_-2px_4px_#2d3f54]">
                        <div class="text-[8px] text-slate-500 uppercase font-bold tracking-wider">AI Confidence</div>
                        <div class="text-xs font-mono text-cyan-400 font-bold">98.2%</div>
                    </div>
                    <div class="bg-[#1e293b] p-2 rounded-lg shadow-[inset_2px_2px_4px_#0f172a,inset_-2px_-2px_4px_#2d3f54]">
                        <div class="text-[8px] text-slate-500 uppercase font-bold tracking-wider">Resources</div>
                        <div class="text-xs font-mono text-slate-300">2 UNITS</div>
                    </div>
                </div>

                <div class="flex gap-2">
                    <button class="flex-1 py-2.5 rounded-lg bg-[#1e293b] text-[10px] font-bold text-cyan-400 shadow-[4px_4px_8px_#0f172a,-4px_-4px_8px_#2d3f54] hover:shadow-[inset_2px_2px_4px_#0f172a,inset_-2px_-2px_4px_#2d3f54] active:scale-95 transition-all uppercase flex items-center justify-center gap-1">
                        Dispatch
                    </button>
                    <button class="flex-1 py-2.5 rounded-lg bg-[#1e293b] text-[10px] font-bold text-slate-400 shadow-[4px_4px_8px_#0f172a,-4px_-4px_8px_#2d3f54] hover:shadow-[inset_2px_2px_4px_#0f172a,inset_-2px_-2px_4px_#2d3f54] active:scale-95 transition-all uppercase">
                        Details
                    </button>
                </div>
            </div>
        `;

        if (existingMarker) {
            existingMarker.setLatLng([inc.coordinates.lat, inc.coordinates.lng]);
            
            if (shouldUpdateIcon) {
                existingMarker.setIcon(icon);
            }
            
            // Check if popup is open before setting content to avoid closure
            if (existingMarker.getPopup().isOpen()) {
                existingMarker.getPopup().setContent(popupContent);
            } else {
                existingMarker.setPopupContent(popupContent);
            }
        } else {
            const marker = L.marker([inc.coordinates.lat, inc.coordinates.lng], { 
                icon, 
                zIndexOffset: isCritical ? 1000 : 500 
            })
                .bindPopup(popupContent, {
                    closeButton: false,
                    className: 'neumorphic-popup',
                    autoPanPadding: [50, 50]
                });
            marker.addTo(layerGroup);
            incidentMarkersRef.current[inc.id] = marker;
        }
        
        prevIncidentsRef.current[inc.id] = inc;
     });

     // Cleanup removed incidents
     Object.keys(incidentMarkersRef.current).forEach(id => {
         if (!currentIds.has(id)) {
             layerGroup.removeLayer(incidentMarkersRef.current[id]);
             delete incidentMarkersRef.current[id];
         }
     });
  }, [incidents]);

  // 4. Handle Units (Diffing Logic + DOM Manipulation)
  useEffect(() => {
    if (!mapRef.current) return;
    const L = window.L;
    const layerGroup = layersRef.current.units;
    const currentIds = new Set();

    units.forEach(unit => {
       currentIds.add(unit.id);
       const existingMarker = unitMarkersRef.current[unit.id];
       const prevUnit = prevUnitsRef.current[unit.id];

       // Determine if we need to full replace icon or just rotate
       const shouldUpdateIcon = !prevUnit || prevUnit.type !== unit.type || prevUnit.status !== unit.status;

       const color = unit.type === 'MEDICAL' ? '#ef4444' : (unit.type === 'DRONE' ? '#22d3ee' : '#f97316');
       const iconSvg = unit.type === 'MEDICAL' 
           ? '<path d="M12 2v20M2 12h20"/>'
           : unit.type === 'DRONE'
           ? '<circle cx="12" cy="12" r="3"/><path d="M12 5a7 7 0 0 0-7 7m14 0a7 7 0 0 0-7-7m0 14a7 7 0 0 0 7-7m-14 0a7 7 0 0 0 7 7"/>'
           : '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>';

       const iconHtml = `
            <div class="relative group w-16 h-16 flex items-center justify-center">
                <!-- Heading Indicator -->
                <div class="heading-indicator absolute inset-0 transition-transform duration-300 ease-linear" style="transform: rotate(${unit.heading}deg);">
                    <svg width="64" height="64" viewBox="0 0 48 48" fill="none">
                        <path d="M24 0L32 16H16L24 0Z" fill="${color}" opacity="0.6"/>
                    </svg>
                </div>
                <!-- Unit Icon -->
                <div class="relative z-10 w-10 h-10 rounded-xl bg-[#0f172a] border-2 border-[${color}]/50 flex items-center justify-center shadow-lg hover:border-[${color}] transition-colors cursor-pointer backdrop-blur-md">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        ${iconSvg}
                    </svg>
                </div>
                <!-- Label Tooltip -->
                <div class="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#0f172a]/90 border border-[${color}]/30 text-[${color}] text-[10px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none backdrop-blur-md">
                    ${unit.type}
                </div>
            </div>
       `;

       const icon = L.divIcon({
           html: iconHtml,
           className: 'bg-transparent',
           iconSize: [64, 64],
           iconAnchor: [32, 32],
           popupAnchor: [0, -24]
       });

       // Unit Popup content
       const popupContent = `
            <div class="bg-[#1e293b] p-3 rounded-xl shadow-xl border border-white/5 min-w-[220px]">
               <div class="flex items-center gap-3 mb-2">
                   <div class="p-2 rounded-lg bg-[${color}]/20">
                       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                           ${iconSvg}
                       </svg>
                   </div>
                   <div>
                       <div class="text-xs font-bold text-white">${unit.type} SQUAD</div>
                       <div class="text-[9px] text-slate-400 font-mono">ID: ${unit.id.toUpperCase()}</div>
                   </div>
               </div>
               <div class="grid grid-cols-2 gap-2 text-[9px] font-mono text-slate-300">
                   <div class="bg-[#0f172a] p-1.5 rounded border border-white/5 text-center">
                       <span class="text-slate-500 block text-[8px] uppercase">Status</span>
                       ${unit.status}
                   </div>
                   <div class="bg-[#0f172a] p-1.5 rounded border border-white/5 text-center">
                       <span class="text-slate-500 block text-[8px] uppercase">Speed</span>
                       ${unit.status === 'MOVING' ? '45 km/h' : '0 km/h'}
                   </div>
               </div>
            </div>
       `;

       if (existingMarker) {
           existingMarker.setLatLng([unit.coordinates.lat, unit.coordinates.lng]);
           
           if (shouldUpdateIcon) {
               // Full icon replacement if type/status changed
               existingMarker.setIcon(icon);
           } else {
               // Optimized: Direct DOM manipulation for rotation only to prevent popup closure/flicker
               const el = existingMarker.getElement();
               if (el) {
                   const rotationEl = el.querySelector('.heading-indicator');
                   if (rotationEl) {
                       rotationEl.style.transform = `rotate(${unit.heading}deg)`;
                   }
               }
           }

           if (existingMarker.getPopup().isOpen()) {
               existingMarker.getPopup().setContent(popupContent);
           } else {
               existingMarker.setPopupContent(popupContent);
           }

       } else {
           const marker = L.marker([unit.coordinates.lat, unit.coordinates.lng], { 
               icon,
               zIndexOffset: 800 
           })
               .bindPopup(popupContent, { 
                   closeButton: false,
                   autoPanPadding: [50, 50]
               });
           marker.addTo(layerGroup);
           unitMarkersRef.current[unit.id] = marker;
       }
       
       prevUnitsRef.current[unit.id] = unit;
    });

    // Cleanup removed units
    Object.keys(unitMarkersRef.current).forEach(id => {
        if (!currentIds.has(id)) {
            layerGroup.removeLayer(unitMarkersRef.current[id]);
            delete unitMarkersRef.current[id];
        }
    });

  }, [units]);

  return (
    <div className="w-full h-full relative group map-container bg-[#0f172a]">
      <div id="map" ref={mapContainerRef} className="w-full h-full z-0" />
      
      {/* Scanning Line Effect */}
      {analyzing && (
        <div 
            className="absolute top-0 left-0 w-full h-1 bg-cyan-400 shadow-[0_0_20px_#22d3ee] z-[1000] pointer-events-none"
            style={{ 
                top: `50%`, 
                animation: 'scan-vertical 3s linear infinite'
            }}
        />
      )}
      <style>{`
        @keyframes scan-vertical {
            0% { top: 0%; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
        }
        .neumorphic-popup .leaflet-popup-content-wrapper {
           background: #1e293b;
           box-shadow: 12px 12px 24px #0f172a, -12px -12px 24px #2d3f54;
           border: 1px solid rgba(255,255,255,0.05);
           border-radius: 16px;
        }
        .neumorphic-popup .leaflet-popup-tip {
           background: #1e293b;
        }
      `}</style>
    </div>
  );
};

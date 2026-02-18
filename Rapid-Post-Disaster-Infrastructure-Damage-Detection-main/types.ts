export enum LayerType {
  SATELLITE = 'SATELLITE',
  LIDAR = 'LIDAR',
  HEATMAP = 'HEATMAP',
  ROADS = 'ROADS',
  BUILDINGS = 'BUILDINGS',
  GEOJSON = 'GEOJSON'
}

export enum SystemStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  PROCESSING = 'PROCESSING',
  WARNING = 'WARNING'
}

export enum ViewType {
  DASHBOARD = 'DASHBOARD',
  MISSION = 'MISSION',
  RESOURCES = 'RESOURCES',
  ANALYTICS = 'ANALYTICS',
  SATELLITE = 'SATELLITE',
  ALERTS = 'ALERTS',
  SETTINGS = 'SETTINGS'
}

export interface DamageMetric {
  id: string;
  sector: string;
  confidence: number;
  severity: 'CRITICAL' | 'MODERATE' | 'LOW';
  type: 'BRIDGE' | 'ROAD' | 'GRID' | 'BUILDING';
}

export interface GeoPoint {
  lat: number;
  lng: number;
  label?: string;
  status?: string;
}

export interface SimulationState {
  isAnalyzing: boolean;
  progress: number;
  detectedIncidents: number;
}

export interface Incident {
  id: string;
  type: 'DAMAGE' | 'BLOCKED' | 'HAZARD';
  severity: 'CRITICAL' | 'MODERATE' | 'LOW';
  coordinates: { x: number; y: number; lat: number; lng: number }; 
  label: string;
  timestamp: number;
}

export interface Unit {
  id: string;
  type: 'RESCUE' | 'MEDICAL' | 'DRONE';
  status: 'MOVING' | 'IDLE' | 'BUSY';
  coordinates: { x: number; y: number; lat: number; lng: number };
  heading: number;
}
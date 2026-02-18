import React from 'react';
import { AlertTriangle, X, Activity, Zap, Building2, AlertOctagon } from 'lucide-react';

interface DamageMetrics {
  total_damage_percentage?: number;
  building_damage_percentage?: number;
  infrastructure_damage_percentage?: number;
  debris_coverage_percentage?: number;
  severity_level?: string;
  confidence_score?: number;
  damaged_zones_count?: number;
  safe_zones_count?: number;
  estimate_message?: string;
  affected_area_percentage?: number;
}

interface AggregatedMetrics {
  total_damage?: number;
  building_damage?: number;
  infrastructure_damage?: number;
  debris_coverage?: number;
  severity?: string;
  confidence?: number;
}

interface DamageAnalysisResult {
  damage_percentage?: number;
  confidence?: number;
  mask_map?: string;
  model?: string;
  status?: string;
  metrics?: DamageMetrics;
  damage_assessment?: AggregatedMetrics;
  zone_analysis?: {
    damaged_zones: number;
    safe_zones: number;
    total_zones: number;
  };
  assessment_message?: string;
  visualization?: string;
  combined_analysis?: AggregatedMetrics & {
    change_detection_damage?: number;
    estimation_damage?: number;
    combined_damage_percentage?: number;
  };
  damage_estimation?: {
    visualization?: string;
    metrics?: DamageMetrics;
  };
  change_detection?: {
    damage_map?: string;
  };
}

interface DamageAnalysisDisplayProps {
  result: DamageAnalysisResult | null;
  onClose: () => void;
}

export const DamageAnalysisDisplay: React.FC<DamageAnalysisDisplayProps> = ({ result, onClose }) => {
  if (!result) return null;

  // Extract metrics from different response formats
  const getMetrics = (): { primary: number; secondary: number; severity: string; confidence: number; message: string; zones: { damaged: number; safe: number } } => {
    let primary = 0, secondary = 0, severity = 'UNKNOWN', confidence = 0, message = '', damaged = 0, safe = 0;

    // Combined report format
    if (result.combined_analysis) {
      primary = result.combined_analysis.combined_damage_percentage || result.combined_analysis.total_damage || 0;
      secondary = result.combined_analysis.estimation_damage || 0;
      severity = result.combined_analysis.severity || 'UNKNOWN';
      confidence = result.combined_analysis.confidence || 0;
      message = result.assessment_message || '';
      if (result.damage_estimation?.metrics) {
        damaged = result.damage_estimation.metrics.damaged_zones_count || 0;
        safe = result.damage_estimation.metrics.safe_zones_count || 0;
      }
    }
    // Damage assessment format
    else if (result.damage_assessment) {
      primary = result.damage_assessment.total_damage || 0;
      secondary = result.damage_assessment.building_damage || 0;
      severity = result.damage_assessment.severity || 'UNKNOWN';
      confidence = result.damage_assessment.confidence || 0;
      message = result.assessment_message || '';
      if (result.zone_analysis) {
        damaged = result.zone_analysis.damaged_zones;
        safe = result.zone_analysis.safe_zones;
      }
    }
    // Metrics format
    else if (result.metrics) {
      primary = result.metrics.total_damage_percentage || 0;
      secondary = result.metrics.building_damage_percentage || 0;
      severity = result.metrics.severity_level || 'UNKNOWN';
      confidence = result.metrics.confidence_score || 0;
      message = result.metrics.estimate_message || '';
      damaged = result.metrics.damaged_zones_count || 0;
      safe = result.metrics.safe_zones_count || 0;
    }
    // Simple format
    else {
      primary = result.damage_percentage || 0;
      confidence = result.confidence || 0;
    }

    return { primary, secondary, severity, confidence, message, zones: { damaged, safe } };
  };

  const metrics = getMetrics();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'border-red-500/50 bg-red-500/5';
      case 'SEVERE': return 'border-orange-500/50 bg-orange-500/5';
      case 'MODERATE': return 'border-amber-500/50 bg-amber-500/5';
      case 'MINOR': return 'border-yellow-500/50 bg-yellow-500/5';
      default: return 'border-green-500/50 bg-green-500/5';
    }
  };

  const getSeverityTextColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'text-red-500';
      case 'SEVERE': return 'text-orange-500';
      case 'MODERATE': return 'text-amber-500';
      case 'MINOR': return 'text-yellow-500';
      default: return 'text-green-500';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-cyan-500/50 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-cyan-500/20 sticky top-0 bg-slate-900/95">
          <div className="flex items-center gap-3">
            {metrics.severity === 'CRITICAL' ? (
              <AlertOctagon className="w-6 h-6 text-red-500 animate-pulse" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-amber-500" />
            )}
            <div>
              <h2 className="text-xl font-bold text-white">Damage Assessment Report</h2>
              <p className="text-xs text-slate-400">Geospatial AI Analysis System</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400 hover:text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {result.status === 'ERROR' ? (
            <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
              Analysis failed. Please try again with valid satellite images.
            </div>
          ) : (
            <>
              {/* Primary Damage Assessment */}
              <div className={`border rounded-lg p-6 ${getSeverityColor(metrics.severity)}`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm text-slate-300 mb-2">PRIMARY DAMAGE ASSESSMENT</div>
                    <div className={`text-5xl font-bold ${getSeverityTextColor(metrics.severity)}`}>
                      {metrics.primary.toFixed(1)}%
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${getSeverityTextColor(metrics.severity)}`}>
                      {metrics.severity}
                    </div>
                    <div className="text-xs text-slate-400 mt-2">Severity Level</div>
                  </div>
                </div>
                <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      metrics.severity === 'CRITICAL' ? 'bg-gradient-to-r from-red-600 to-orange-500' :
                      metrics.severity === 'SEVERE' ? 'bg-gradient-to-r from-orange-600 to-amber-500' :
                      metrics.severity === 'MODERATE' ? 'bg-gradient-to-r from-amber-600 to-yellow-500' :
                      metrics.severity === 'MINOR' ? 'bg-gradient-to-r from-yellow-600 to-lime-500' :
                      'bg-gradient-to-r from-green-600 to-emerald-500'
                    }`}
                    style={{ width: `${metrics.primary}%` }}
                  />
                </div>
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Confidence Score */}
                <div className="bg-slate-800/50 border border-cyan-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm text-slate-400">Confidence</span>
                  </div>
                  <div className="text-3xl font-bold text-cyan-400">
                    {(metrics.confidence * 100).toFixed(1)}%
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden mt-2">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-600 to-blue-500"
                      style={{ width: `${metrics.confidence * 100}%` }}
                    />
                  </div>
                </div>

                {/* Secondary Metric (Building Damage if available) */}
                {metrics.secondary > 0 && (
                  <div className="bg-slate-800/50 border border-orange-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="w-4 h-4 text-orange-400" />
                      <span className="text-sm text-slate-400">Building Damage</span>
                    </div>
                    <div className="text-3xl font-bold text-orange-400">
                      {metrics.secondary.toFixed(1)}%
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden mt-2">
                      <div
                        className="h-full bg-gradient-to-r from-orange-600 to-red-500"
                        style={{ width: `${Math.min(metrics.secondary, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Zone Analysis if available */}
                {(metrics.zones.damaged || metrics.zones.safe) > 0 && (
                  <div className="bg-slate-800/50 border border-amber-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-4 h-4 text-amber-400" />
                      <span className="text-sm text-slate-400">Affected Zones</span>
                    </div>
                    <div className="text-3xl font-bold text-amber-400">
                      {metrics.zones.damaged}/{metrics.zones.damaged + metrics.zones.safe}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {metrics.zones.safe} safe, {metrics.zones.damaged} damaged
                    </div>
                  </div>
                )}
              </div>

              {/* Assessment Message */}
              {metrics.message && (
                <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
                  <p className="text-sm text-slate-200 leading-relaxed">
                    {metrics.message}
                  </p>
                </div>
              )}

              {/* Visualizations */}
              <div className="space-y-4">
                {/* Change Detection Map */}
                {result.change_detection?.damage_map && (
                  <div className="bg-slate-800/50 border border-red-500/30 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-slate-300 mb-3">Change Detection Map</h3>
                    <div className="bg-black rounded-lg overflow-hidden shadow-inner">
                      <img
                        src={result.change_detection.damage_map}
                        alt="Change Detection"
                        className="w-full h-auto"
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Red = High change | Yellow = Moderate | Dark = No change</p>
                  </div>
                )}

                {/* Damage Estimation Visualization */}
                {result.damage_estimation?.visualization && (
                  <div className="bg-slate-800/50 border border-amber-500/30 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-slate-300 mb-3">Damage Estimation Overlay</h3>
                    <div className="bg-black rounded-lg overflow-hidden shadow-inner">
                      <img
                        src={result.damage_estimation.visualization}
                        alt="Damage Estimation"
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                )}

                {/* Primary Mask */}
                {result.mask_map && !result.change_detection?.damage_map && (
                  <div className="bg-slate-800/50 border border-cyan-500/30 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-slate-300 mb-3">Damage Mask Map</h3>
                    <div className="bg-black rounded-lg overflow-hidden shadow-inner">
                      <img
                        src={result.mask_map}
                        alt="Mask Map"
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Recommendations */}
              <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg p-4">
                <h3 className="text-sm font-bold text-cyan-300 mb-2">Recommended Actions</h3>
                <ul className="text-xs text-slate-300 space-y-1">
                  {metrics.severity === 'CRITICAL' && (
                    <>
                      <li>• Immediate evacuation required</li>
                      <li>• Deploy emergency medical response</li>
                      <li>• Activate disaster management protocol</li>
                    </>
                  )}
                  {metrics.severity === 'SEVERE' && (
                    <>
                      <li>• Issue evacuation warnings</li>
                      <li>• Prepare emergency shelters</li>
                      <li>• Mobilize rescue teams</li>
                    </>
                  )}
                  {metrics.severity === 'MODERATE' && (
                    <>
                      <li>• Assess structural integrity</li>
                      <li>• Provide humanitarian assistance</li>
                      <li>• Monitor for escalation</li>
                    </>
                  )}
                  {metrics.severity === 'MINOR' && (
                    <>
                      <li>• Conduct detailed damage assessment</li>
                      <li>• Plan recovery operations</li>
                      <li>• Begin restoration efforts</li>
                    </>
                  )}
                  {metrics.severity === 'MINIMAL' && (
                    <>
                      <li>• Area deemed safe</li>
                      <li>• Continue routine monitoring</li>
                      <li>• Document for future analysis</li>
                    </>
                  )}
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-cyan-500/20 bg-slate-800/30 sticky bottom-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/50 text-cyan-400 rounded-lg hover:bg-cyan-500/20 transition-colors font-mono text-sm"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default DamageAnalysisDisplay;

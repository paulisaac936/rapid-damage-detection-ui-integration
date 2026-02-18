import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface DamageAnalysisResult {
  damage_percentage: number;
  confidence: number;
  mask_map?: string;
  model?: string;
  status?: string;
}

interface DamageAnalysisDisplayProps {
  result: DamageAnalysisResult | null;
  onClose: () => void;
}

export const DamageAnalysisDisplay: React.FC<DamageAnalysisDisplayProps> = ({ result, onClose }) => {
  if (!result) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-cyan-500/50 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-cyan-500/20">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <h2 className="text-xl font-bold text-white">Damage Detection Analysis</h2>
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
          {/* Status */}
          {result.status === 'ERROR' ? (
            <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
              Analysis failed. Please try again with valid satellite images.
            </div>
          ) : (
            <>
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                {/* Damage Percentage */}
                <div className="bg-slate-800/50 border border-red-500/30 rounded-lg p-4">
                  <div className="text-sm text-slate-400 mb-2">Damage Detected</div>
                  <div className="text-4xl font-bold text-red-500 mb-2">
                    {result.damage_percentage.toFixed(1)}%
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-600 to-orange-500 transition-all duration-500"
                      style={{ width: `${result.damage_percentage}%` }}
                    />
                  </div>
                </div>

                {/* Confidence */}
                <div className="bg-slate-800/50 border border-cyan-500/30 rounded-lg p-4">
                  <div className="text-sm text-slate-400 mb-2">Confidence Score</div>
                  <div className="text-4xl font-bold text-cyan-400 mb-2">
                    {(result.confidence * 100).toFixed(1)}%
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-600 to-blue-500 transition-all duration-500"
                      style={{ width: `${result.confidence * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Mask Map Visualization */}
              {result.mask_map && (
                <div className="bg-slate-800/50 border border-cyan-500/30 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-slate-300 mb-3">Change Detection Mask Map</h3>
                  <div className="bg-black rounded-lg overflow-hidden shadow-inner">
                    <img
                      src={result.mask_map}
                      alt="Damage Detection Mask"
                      className="w-full h-auto"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-3">
                    Red areas indicate detected changes/damage. Brighter red = higher change intensity.
                  </p>
                </div>
              )}

              {/* Damage Classification */}
              <div className="bg-slate-800/50 border border-amber-500/30 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-slate-300 mb-3">Damage Classification</h3>
                <div className="space-y-2">
                  {result.damage_percentage >= 70 && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="text-sm text-red-400">CRITICAL: Severe structural damage detected</span>
                    </div>
                  )}
                  {result.damage_percentage >= 40 && result.damage_percentage < 70 && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-500" />
                      <span className="text-sm text-orange-400">MODERATE: Significant damage detected</span>
                    </div>
                  )}
                  {result.damage_percentage >= 10 && result.damage_percentage < 40 && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      <span className="text-sm text-amber-400">MINOR: Limited damage detected</span>
                    </div>
                  )}
                  {result.damage_percentage < 10 && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-sm text-green-400">MINIMAL: No significant damage detected</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Model Info */}
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-3 text-xs text-slate-400 font-mono">
                <div>Model: {result.model || 'ChangeFormerV6'}</div>
                <div>Status: {result.status || 'COMPLETED'}</div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-cyan-500/20 bg-slate-800/30">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/50 text-cyan-400 rounded-lg hover:bg-cyan-500/20 transition-colors font-mono text-sm"
          >
            Close Analysis
          </button>
        </div>
      </div>
    </div>
  );
};

export default DamageAnalysisDisplay;

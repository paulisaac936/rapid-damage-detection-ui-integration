import React from 'react';

interface GlassCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`glass-panel border border-white/10 bg-[#13161f]/80 backdrop-blur-md rounded-xl overflow-hidden shadow-lg flex flex-col ${className}`}>
      {title && (
        <div className="px-4 py-3 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
          <h3 className="text-[11px] font-bold text-slate-300 tracking-widest uppercase font-mono">
            {title}
          </h3>
          <div className="flex gap-1">
            <div className="w-1 h-1 rounded-full bg-slate-600"></div>
            <div className="w-1 h-1 rounded-full bg-slate-600"></div>
            <div className="w-1 h-1 rounded-full bg-slate-600"></div>
          </div>
        </div>
      )}
      <div className="p-4 flex-1">
        {children}
      </div>
    </div>
  );
};
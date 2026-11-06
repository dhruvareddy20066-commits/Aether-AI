import React, { useState } from 'react';
import { HelpCircle, Info, Sparkles } from 'lucide-react';

interface FinancialTooltipProps {
  title: string;
  explanation: string;
  benchmark?: string;
  formula?: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const FinancialTooltip: React.FC<FinancialTooltipProps> = ({
  title,
  explanation,
  benchmark,
  formula,
  children,
  position = 'top',
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div
      className={`relative inline-flex items-center group ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}

      {/* Floating Info Icon Indicator */}
      <span className="ml-1 text-slate-400 hover:text-blue-600 cursor-help transition-colors">
        <Info className="w-3.5 h-3.5 inline opacity-70 group-hover:opacity-100" />
      </span>

      {/* Popover Bubble */}
      {isVisible && (
        <div
          role="tooltip"
          className={`absolute z-50 w-72 sm:w-80 p-3.5 rounded-2xl glass-panel-accent border border-white/95 shadow-xl text-left backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 pointer-events-none ${positionClasses[position]}`}
        >
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 pb-1 border-b border-slate-200/60 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>{title}</span>
          </div>

          <p className="text-[11px] text-slate-600 leading-relaxed">
            {explanation}
          </p>

          {formula && (
            <div className="mt-1.5 pt-1.5 border-t border-slate-100 font-mono text-[10px] text-blue-700 bg-blue-50/70 p-1.5 rounded-lg">
              <strong>Formula:</strong> {formula}
            </div>
          )}

          {benchmark && (
            <div className="mt-1.5 text-[10px] text-emerald-700 bg-emerald-50/70 p-1.5 rounded-lg flex items-start gap-1">
              <span className="font-bold">Rule of Thumb:</span>
              <span>{benchmark}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

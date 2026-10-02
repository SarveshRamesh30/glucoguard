import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon } from 'lucide-react';

interface RiskGaugeProps {
  score: number; // 0.0 to 1.0 (e.g. 0.74 = 74%)
  riskLevel: 'Low Risk' | 'Moderate Risk' | 'High Risk' | string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({
  score,
  riskLevel,
  size = 'md',
  showLabel = true,
}) => {
  const percentage = Math.round(score * 100);

  // SVG Gauge calculations (Semi-circle arc)
  const radius = 80;
  const circumference = Math.PI * radius; // Half circle arc length
  const strokeDashoffset = circumference - (score * circumference);

  const getColorTheme = () => {
    if (score < 0.35 || riskLevel === 'Low Risk') {
      return {
        stroke: '#10b981', // emerald-500
        bgGlow: 'from-emerald-500/10 to-teal-500/5',
        badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        text: 'text-emerald-700',
        icon: ShieldCheck,
        label: 'Low Risk',
        description: 'Optimal metabolic indicators'
      };
    } else if (score < 0.70 || riskLevel === 'Moderate Risk') {
      return {
        stroke: '#f59e0b', // amber-500
        bgGlow: 'from-amber-500/10 to-yellow-500/5',
        badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
        text: 'text-amber-700',
        icon: AlertTriangle,
        label: 'Moderate Risk',
        description: 'Lifestyle intervention recommended'
      };
    } else {
      return {
        stroke: '#ef4444', // rose-500
        bgGlow: 'from-rose-500/10 to-red-500/5',
        badgeBg: 'bg-rose-100 text-rose-800 border-rose-200',
        text: 'text-rose-700',
        icon: AlertOctagon,
        label: 'High Risk',
        description: 'Clinical consultation strongly advised'
      };
    }
  };

  const theme = getColorTheme();
  const IconComponent = theme.icon;

  const dimension = size === 'sm' ? 140 : size === 'lg' ? 260 : 200;

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`relative flex items-center justify-center p-4 rounded-3xl bg-gradient-to-b ${theme.bgGlow}`}
        style={{ width: dimension, height: dimension * 0.75 }}
      >
        <svg
          viewBox="0 0 200 120"
          className="w-full h-full overflow-visible"
        >
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>

          {/* Background Arc */}
          <path
            d="M 20 110 A 80 80 0 0 1 180 110"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Active Colored Score Arc */}
          <path
            d="M 20 110 A 80 80 0 0 1 180 110"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="14"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />

          {/* Center Indicator */}
          <circle cx="100" cy="110" r="8" fill="#1e293b" />
        </svg>

        {/* Center Score Readout */}
        <div className="absolute bottom-2 flex flex-col items-center">
          <div className="flex items-baseline">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {percentage}
            </span>
            <span className="text-base sm:text-lg font-bold text-slate-500 ml-0.5">%</span>
          </div>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 -mt-1">
            Risk Probability
          </span>
        </div>
      </div>

      {showLabel && (
        <div className="mt-3 flex flex-col items-center text-center">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${theme.badgeBg}`}>
            <IconComponent className="w-3.5 h-3.5" />
            <span>{theme.label}</span>
          </div>
          <p className="text-xs text-slate-500 mt-1.5 font-medium max-w-[200px]">
            {theme.description}
          </p>
        </div>
      )}
    </div>
  );
};

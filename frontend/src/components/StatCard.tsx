import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'teal' | 'sky' | 'emerald' | 'amber' | 'rose' | 'violet' | 'slate';
  suffix?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  color = 'teal',
  suffix = '',
}) => {
  const colorClasses = {
    teal: {
      bg: 'bg-teal-100',
      text: 'text-teal-600',
      border: 'border-teal-500',
    },
    sky: {
      bg: 'bg-sky-100',
      text: 'text-sky-600',
      border: 'border-sky-500',
    },
    emerald: {
      bg: 'bg-emerald-100',
      text: 'text-emerald-600',
      border: 'border-emerald-500',
    },
    amber: {
      bg: 'bg-amber-100',
      text: 'text-amber-600',
      border: 'border-amber-500',
    },
    rose: {
      bg: 'bg-rose-100',
      text: 'text-rose-600',
      border: 'border-rose-500',
    },
    violet: {
      bg: 'bg-violet-100',
      text: 'text-violet-600',
      border: 'border-violet-500',
    },
    slate: {
      bg: 'bg-slate-100',
      text: 'text-slate-600',
      border: 'border-slate-500',
    },
  };

  const colors = colorClasses[color];

  return (
    <div className={`card border-l-4 ${colors.border} hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 mb-2">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-slate-900">
              {value}
              {suffix && <span className="text-xl text-slate-600 ml-1">{suffix}</span>}
            </h3>
          </div>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              {trend.isPositive ? (
                <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-rose-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                </svg>
              )}
              <span className={`text-sm font-medium ${trend.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                {trend.value}%
              </span>
            </div>
          )}
        </div>
        <div className={`w-14 h-14 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0`}>
          <div className={colors.text}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;

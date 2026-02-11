import { ReactNode } from 'react';
import classNames from 'classnames';

interface Trend {
  value: string;
  label: string;
  direction: 'up' | 'down' | 'neutral';
}

interface StatsCardProps {
  title: string;
  value: string | number | ReactNode;
  icon?: ReactNode;
  trend?: Trend;
  className?: string;
  loading?: boolean;
}

export default function StatsCard({ title, value, icon, trend, className, loading }: StatsCardProps) {
  return (
    <div className={classNames('p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 group hover:border-zinc-700 hover:bg-zinc-800/60', className)}>
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-sm font-medium text-zinc-400 group-hover:text-zinc-300 transition-colors">{title}</p>
          {loading ? (
             <div className="h-8 w-24 bg-zinc-800 rounded animate-pulse" />
          ) : (
             <h3 className="text-2xl font-bold text-zinc-100 tracking-tight">{value}</h3>
          )}
        </div>
        {icon && (
          <div className="p-2.5 bg-zinc-800/50 rounded-xl text-primary-400 group-hover:bg-primary-500/10 group-hover:text-primary-300 transition-colors shadow-inner">
            {icon}
          </div>
        )}
      </div>

      {/* Optional Trend or Footer */}
      {trend && !loading && (
        <div className="mt-4 flex items-center text-xs">
          <span
            className={classNames(
              'font-medium px-1.5 py-0.5 rounded-md flex items-center',
              trend.direction === 'up' ? 'text-emerald-400 bg-emerald-400/10' :
              trend.direction === 'down' ? 'text-rose-400 bg-rose-400/10' :
              'text-zinc-400 bg-zinc-400/10'
            )}
          >
            {trend.value}
          </span>
          <span className="text-zinc-500 ml-2">{trend.label}</span>
        </div>
      )}
    </div>
  );
}

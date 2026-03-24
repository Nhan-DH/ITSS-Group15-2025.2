import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendValue, 
  trendLabel = "so với tháng trước",
  className 
}) => {
  return (
    <div className={cn("rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950 transition-all hover:shadow-md", className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{value}</h3>
        </div>
        {Icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center gap-2 text-sm">
          <span
            className={cn(
              "flex items-center gap-1 font-medium",
              trend === 'up' && "text-emerald-600 dark:text-emerald-400",
              trend === 'down' && "text-red-600 dark:text-red-400",
              trend === 'neutral' && "text-gray-600 dark:text-gray-400"
            )}
          >
            {trend === 'up' && <TrendingUp className="h-4 w-4" />}
            {trend === 'down' && <TrendingDown className="h-4 w-4" />}
            {trend === 'neutral' && <Minus className="h-4 w-4" />}
            {trendValue}
          </span>
          <span className="text-gray-500 dark:text-gray-400">{trendLabel}</span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;

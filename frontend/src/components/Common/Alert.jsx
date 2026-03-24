import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';

const Alert = React.forwardRef(({ className, variant = "info", title, children, ...props }, ref) => {
  const variants = {
    info: "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
    success: "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800",
    warning: "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
    error: "bg-red-50 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
  };

  const icons = {
    info: <Info className="h-5 w-5" />,
    success: <CheckCircle2 className="h-5 w-5" />,
    warning: <AlertCircle className="h-5 w-5" />,
    error: <XCircle className="h-5 w-5" />,
  };

  return (
    <div
      ref={ref}
      role="alert"
      className={cn("relative w-full rounded-lg border p-4 flex items-start gap-4 transition-all", variants[variant], className)}
      {...props}
    >
      <div className="mt-0.5 shrink-0 opacity-90">{icons[variant]}</div>
      <div className="flex flex-col gap-1.5 w-full">
        {title && <h5 className="font-semibold leading-none tracking-tight">{title}</h5>}
        <div className="text-sm opacity-90">{children}</div>
      </div>
    </div>
  );
});
Alert.displayName = "Alert";

export default Alert;

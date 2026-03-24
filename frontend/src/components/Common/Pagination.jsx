import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Pagination = ({ className, ...props }) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

export const PaginationContent = React.forwardRef(({ className, ...props }, ref) => (
  <ul ref={ref} className={cn("flex flex-row items-center gap-1", className)} {...props} />
));
PaginationContent.displayName = "PaginationContent";

export const PaginationItem = React.forwardRef(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

export const PaginationButton = ({ className, isActive, disabled, ...props }) => {
  return (
    <button
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 w-9 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800",
        isActive && "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 font-bold",
        className
      )}
      {...props}
    />
  );
};
PaginationButton.displayName = "PaginationButton";

export const PaginationPrevious = ({ className, ...props }) => (
  <PaginationButton
    aria-label="Trang trước"
    className={cn("gap-1 pl-2.5 w-auto px-3", className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4 mr-1" />
    <span>Trang trước</span>
  </PaginationButton>
);
PaginationPrevious.displayName = "PaginationPrevious";

export const PaginationNext = ({ className, ...props }) => (
  <PaginationButton
    aria-label="Trang tiếp"
    className={cn("gap-1 pr-2.5 w-auto px-3", className)}
    {...props}
  >
    <span>Trang tiếp</span>
    <ChevronRight className="h-4 w-4 ml-1" />
  </PaginationButton>
);
PaginationNext.displayName = "PaginationNext";

export const PaginationEllipsis = ({ className, ...props }) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center text-gray-500", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">Nhiều trang hơn</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export default Pagination;

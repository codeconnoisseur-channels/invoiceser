import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-sm border px-2 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-gray-100 text-gray-600 border-gray-200",
        draft: "bg-gray-100 text-gray-600 border-gray-200",
        sent: "bg-primary-50 text-primary-700 border-primary-100",
        paid: "bg-success-50 text-success-700 border-success-100",
        overdue: "bg-warning-50 text-warning-700 border-warning-100",
        voided: "bg-danger-50 text-danger-700 border-danger-100",
        free: "bg-gray-100 text-gray-600 border-gray-200",
        pro: "bg-primary-50 text-primary-700 border-primary-100",
        open: "bg-primary-50 text-primary-700 border-primary-100",
        in_progress: "bg-warning-50 text-warning-700 border-warning-100",
        resolved: "bg-success-50 text-success-700 border-success-100",
        closed: "bg-gray-100 text-gray-500 border-gray-200",
        info: "bg-primary-50 text-primary-700 border-primary-100",
        warning: "bg-warning-50 text-warning-700 border-warning-100",
        maintenance: "bg-danger-50 text-danger-700 border-danger-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

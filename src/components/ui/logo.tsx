import Link from "next/link";
import { Receipt } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  href?: string;
  textClassName?: string;
}

export function Logo({ className, href = "/", textClassName }: LogoProps) {
  return (
    <Link href={href} className={cn("flex items-center gap-2.5 group", className)}>
      <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center shadow-sm shadow-primary-500/20 group-hover:shadow-primary-500/40 transition-shadow duration-300 shrink-0">
        <Receipt className="w-4 h-4 text-white" />
      </div>
      <span className={cn("font-bold text-gray-900 dark:text-white text-xl tracking-tight", textClassName)}>
        Invoice<span className="text-primary-500">ser</span>
      </span>
    </Link>
  );
}

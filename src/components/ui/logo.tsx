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
    <Link href={href} className={cn("group flex min-h-11 items-center gap-2.5", className)}>
      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground transition-colors group-hover:bg-primary/90">
        <Receipt className="size-4" aria-hidden="true" />
      </div>
      <span className={cn("text-xl font-semibold tracking-[-0.03em] text-foreground", textClassName)}>
        Invoice<span className="text-primary">ser</span>
      </span>
    </Link>
  );
}

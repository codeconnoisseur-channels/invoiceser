import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  href?: string;
  textClassName?: string;
}

export function Logo({ className, href = "/", textClassName }: LogoProps) {
  return (
    <Link href={href} className={cn("flex items-center gap-2.5 group", className)}>
      <Image
        src="/invoiceser-logo.png"
        alt=""
        width={36}
        height={36}
        aria-hidden="true"
        className="h-9 w-9 shrink-0 object-contain"
      />
      <span className={cn("font-bold text-gray-900 dark:text-white text-xl tracking-tight", textClassName)}>
        Invoice<span className="text-orange-500">ser</span>
      </span>
    </Link>
  );
}

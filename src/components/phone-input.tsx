"use client";

import { useState, useEffect, useRef } from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const COUNTRIES = [
  { code: "NG", flag: "🇳🇬", name: "Nigeria",          dial: "+234" },
  { code: "GB", flag: "🇬🇧", name: "United Kingdom",   dial: "+44"  },
  { code: "US", flag: "🇺🇸", name: "United States",    dial: "+1"   },
  { code: "CA", flag: "🇨🇦", name: "Canada",           dial: "+1"   },
  { code: "AU", flag: "🇦🇺", name: "Australia",        dial: "+61"  },
  { code: "IN", flag: "🇮🇳", name: "India",            dial: "+91"  },
  { code: "GH", flag: "🇬🇭", name: "Ghana",            dial: "+233" },
  { code: "KE", flag: "🇰🇪", name: "Kenya",            dial: "+254" },
  { code: "ZA", flag: "🇿🇦", name: "South Africa",     dial: "+27"  },
  { code: "TZ", flag: "🇹🇿", name: "Tanzania",         dial: "+255" },
  { code: "UG", flag: "🇺🇬", name: "Uganda",           dial: "+256" },
  { code: "ZM", flag: "🇿🇲", name: "Zambia",           dial: "+260" },
  { code: "SN", flag: "🇸🇳", name: "Senegal",          dial: "+221" },
  { code: "CI", flag: "🇨🇮", name: "Côte d'Ivoire",   dial: "+225" },
  { code: "EG", flag: "🇪🇬", name: "Egypt",            dial: "+20"  },
  { code: "DE", flag: "🇩🇪", name: "Germany",          dial: "+49"  },
  { code: "FR", flag: "🇫🇷", name: "France",           dial: "+33"  },
  { code: "NL", flag: "🇳🇱", name: "Netherlands",      dial: "+31"  },
  { code: "SE", flag: "🇸🇪", name: "Sweden",           dial: "+46"  },
  { code: "PL", flag: "🇵🇱", name: "Poland",           dial: "+48"  },
  { code: "AE", flag: "🇦🇪", name: "UAE",              dial: "+971" },
  { code: "SA", flag: "🇸🇦", name: "Saudi Arabia",     dial: "+966" },
  { code: "SG", flag: "🇸🇬", name: "Singapore",        dial: "+65"  },
  { code: "MY", flag: "🇲🇾", name: "Malaysia",         dial: "+60"  },
  { code: "PH", flag: "🇵🇭", name: "Philippines",      dial: "+63"  },
  { code: "BR", flag: "🇧🇷", name: "Brazil",           dial: "+55"  },
  { code: "MX", flag: "🇲🇽", name: "Mexico",           dial: "+52"  },
  { code: "AR", flag: "🇦🇷", name: "Argentina",        dial: "+54"  },
  { code: "CO", flag: "🇨🇴", name: "Colombia",         dial: "+57"  },
];

interface PhoneInputProps {
  value: string;
  onChange: (v: string) => void;
  className?: string;
}

export function PhoneInput({ value, onChange, className }: PhoneInputProps) {
  const [countryCode, setCountryCode] = useState("NG");
  const [number,      setNumber]      = useState("");
  const didInit = useRef(false);

  useEffect(() => {
    if (value && !didInit.current) {
      didInit.current = true;
      const sorted  = [...COUNTRIES].sort((a, b) => b.dial.length - a.dial.length);
      const matched = sorted.find((c) => value.startsWith(c.dial));
      if (matched) {
        setCountryCode(matched.code);
        setNumber(value.slice(matched.dial.length).trim());
      } else {
        setNumber(value);
      }
    }
  }, [value]);

  function compose(code: string, num: string) {
    const country = COUNTRIES.find((c) => c.code === code);
    const dial    = country?.dial ?? "";
    onChange(num.trim() ? `${dial} ${num.trim()}` : "");
  }

  const current = COUNTRIES.find((c) => c.code === countryCode);

  return (
    <div className={`flex gap-1.5 ${className ?? ""}`}>
      <SelectPrimitive.Root
        value={countryCode}
        onValueChange={(code) => {
          setCountryCode(code);
          compose(code, number);
        }}
      >
        {/*
          Trigger: shows ONLY the dial code after selection.
          No flag, no abbreviation — this field is for numbers.
          The dropdown still shows full context (flag + abbreviation + dial).
        */}
        <SelectPrimitive.Trigger
          className={cn(
            "flex h-9 w-24 shrink-0 items-center justify-between whitespace-nowrap rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          )}
        >
          <span className="font-mono text-sm text-gray-800 dark:text-gray-200">
            {current?.dial}
          </span>
          <SelectPrimitive.Icon asChild>
            <ChevronDown className="h-3.5 w-3.5 text-gray-400 shrink-0" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            position="popper"
            className="relative z-50 max-h-64 min-w-[10rem] overflow-hidden rounded-lg border border-gray-100 bg-white dark:bg-gray-900 dark:border-gray-700 text-gray-700 dark:text-gray-200 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:translate-y-1"
          >
            <SelectPrimitive.Viewport className="p-1">
              {COUNTRIES.map((c) => (
                <SelectPrimitive.Item
                  key={c.code}
                  value={c.code}
                  className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-7 pr-3 text-sm outline-none focus:bg-blue-50 dark:focus:bg-blue-900/30 data-[state=checked]:bg-blue-50/60 dark:data-[state=checked]:bg-blue-900/20"
                >
                  {/* Check mark indicator */}
                  <span className="absolute left-1.5 flex h-3.5 w-3.5 items-center justify-center">
                    <SelectPrimitive.ItemIndicator>
                      <Check className="h-3.5 w-3.5 text-blue-600" />
                    </SelectPrimitive.ItemIndicator>
                  </span>

                  {/*
                    All dropdown-visible content is outside ItemText.
                    ItemText is sr-only (hidden) — it holds text for keyboard
                    type-ahead navigation only. Nothing from here will appear
                    in the trigger, which eliminates the duplication.
                  */}
                  <span className="flex items-center gap-2">
                    <span className="text-base leading-none">{c.flag}</span>
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300 w-7 shrink-0">{c.code}</span>
                    <span className="font-mono text-xs text-gray-500 dark:text-gray-400">{c.dial}</span>
                  </span>

                  {/* Hidden — only for Radix's internal value/a11y tracking */}
                  <SelectPrimitive.ItemText>
                    <span className="sr-only">{c.name} {c.dial}</span>
                  </SelectPrimitive.ItemText>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>

      <Input
        type="tel"
        inputMode="tel"
        className="flex-1 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
        placeholder="Phone number"
        value={number}
        onChange={(e) => {
          const n = e.target.value;
          setNumber(n);
          compose(countryCode, n);
        }}
      />
    </div>
  );
}

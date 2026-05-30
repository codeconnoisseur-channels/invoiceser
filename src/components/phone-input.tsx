"use client";

import { useState, useEffect, useRef } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

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
  const [number, setNumber] = useState("");
  const didInit = useRef(false);

  useEffect(() => {
    if (value && !didInit.current) {
      didInit.current = true;
      const sorted = [...COUNTRIES].sort((a, b) => b.dial.length - a.dial.length);
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
    const dial = country?.dial ?? "";
    onChange(num.trim() ? `${dial} ${num.trim()}` : "");
  }

  const current = COUNTRIES.find((c) => c.code === countryCode);

  return (
    <div className={`flex gap-1.5 ${className ?? ""}`}>
      <Select
        value={countryCode}
        onValueChange={(code) => {
          setCountryCode(code);
          compose(code, number);
        }}
      >
        <SelectTrigger className="w-28 shrink-0 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-sm">
          <span className="flex items-center gap-1.5 truncate">
            <span>{current?.flag}</span>
            <span className="font-mono text-xs">{current?.dial}</span>
          </span>
        </SelectTrigger>
        <SelectContent className="max-h-64">
          {COUNTRIES.map((c) => (
            <SelectItem key={c.code} value={c.code}>
              <span className="flex items-center gap-2">
                <span>{c.flag}</span>
                <span className="font-mono text-xs">{c.dial}</span>
                <span className="text-gray-500 dark:text-gray-400">{c.name}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
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

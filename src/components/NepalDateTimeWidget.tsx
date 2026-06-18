import { useEffect, useMemo, useState } from "react";
import { ADToBS } from "bikram-sambat-js";
import { Clock3 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

type CalendarMode = "AD" | "BS";

const BS_MONTHS_EN = [
  "Baisakh",
  "Jestha",
  "Ashadh",
  "Shrawan",
  "Bhadra",
  "Ashwin",
  "Kartik",
  "Mangsir",
  "Poush",
  "Magh",
  "Falgun",
  "Chaitra",
];

const BS_MONTHS_NE = [
  "बैशाख",
  "जेठ",
  "असार",
  "श्रावण",
  "भदौ",
  "असोज",
  "कार्तिक",
  "मंसिर",
  "पुष",
  "माघ",
  "फाल्गुण",
  "चैत्र",
];

function toNepaliDigits(input: string): string {
  const map: Record<string, string> = {
    "0": "०",
    "1": "१",
    "2": "२",
    "3": "३",
    "4": "४",
    "5": "५",
    "6": "६",
    "7": "७",
    "8": "८",
    "9": "९",
  };

  return input.replace(/[0-9]/g, (digit) => map[digit] || digit);
}

function formatBSDate(now: Date, isNepali: boolean): string {
  const adDate = now.toLocaleDateString("en-CA", {
    timeZone: "Asia/Kathmandu",
  });

  const bsDate = ADToBS(adDate);
  const [yearStr, monthStr, dayStr] = bsDate.split("-");
  const monthIndex = Number(monthStr) - 1;
  const monthName = isNepali ? BS_MONTHS_NE[monthIndex] : BS_MONTHS_EN[monthIndex];

  if (!monthName) {
    return isNepali ? toNepaliDigits(bsDate) : bsDate;
  }

  if (isNepali) {
    return `${toNepaliDigits(dayStr)} ${monthName} ${toNepaliDigits(yearStr)}`;
  }

  return `${dayStr} ${monthName} ${yearStr}`;
}

function formatADDate(now: Date, isNepali: boolean): string {
  const locale = isNepali ? "ne-NP" : "en-US";
  return now.toLocaleDateString(locale, {
    timeZone: "Asia/Kathmandu",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatKathmanduTime(now: Date, isNepali: boolean): string {
  const locale = isNepali ? "ne-NP" : "en-GB";
  let timeText = now.toLocaleTimeString(locale, {
    timeZone: "Asia/Kathmandu",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  if (isNepali) {
    timeText = toNepaliDigits(timeText);
  }

  return timeText;
}

const NepalDateTimeWidget = ({ compact = false }: { compact?: boolean }) => {
  const { isNepali } = useLanguage();
  const [mode, setMode] = useState<CalendarMode>("BS");
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const dateText = useMemo(() => {
    return mode === "BS" ? formatBSDate(now, isNepali) : formatADDate(now, isNepali);
  }, [mode, now, isNepali]);

  const timeText = useMemo(() => formatKathmanduTime(now, isNepali), [now, isNepali]);

  return (
    <div className={`rounded-xl border border-border/80 bg-muted/40 px-3 py-2 ${compact ? "w-full" : "min-w-[245px]"}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {isNepali ? "काठमाडौं समय" : "Kathmandu Time"}
          </p>
          <div className="mt-0.5 flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <Clock3 className="h-3.5 w-3.5 text-primary" />
            <span>{timeText}</span>
          </div>
          <p className="mt-1 truncate text-xs text-muted-foreground">{dateText}</p>
        </div>

        <div className="shrink-0 rounded-lg border border-border bg-card p-0.5">
          <Button
            size="sm"
            variant={mode === "BS" ? "default" : "ghost"}
            className="h-7 px-2 text-[11px]"
            onClick={() => setMode("BS")}
          >
            BS
          </Button>
          <Button
            size="sm"
            variant={mode === "AD" ? "default" : "ghost"}
            className="h-7 px-2 text-[11px]"
            onClick={() => setMode("AD")}
          >
            AD
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NepalDateTimeWidget;

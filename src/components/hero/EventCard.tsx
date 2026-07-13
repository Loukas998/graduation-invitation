import { Calendar, Clock, MapPin } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span
        className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground"
        aria-hidden="true"
      >
        <Icon className="size-4.5" strokeWidth={1.75} />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-medium text-foreground sm:text-base">
          {value}
        </p>
      </div>
    </div>
  );
}

export function EventCard({ className }: { className?: string }) {
  const { t } = useI18n();

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/70 p-5 sm:p-6",
        // Elevated clean card in light, glassmorphic in dark.
        "bg-card shadow-lg shadow-primary/5",
        "dark:bg-card/50 dark:shadow-black/30 dark:backdrop-blur-xl dark:supports-[backdrop-filter]:bg-card/40",
        className,
      )}
    >
      <div className="mb-4 flex items-center gap-2">
        <span className="h-4 w-1 rounded-full bg-primary" aria-hidden="true" />
        <h2 className="text-sm font-semibold tracking-wide text-foreground">
          {t("event.title")}
        </h2>
      </div>
      <div className="space-y-4">
        <DetailRow
          icon={Calendar}
          label={t("event.dateLabel")}
          value={t("event.dateValue")}
        />
        <DetailRow
          icon={Clock}
          label={t("event.timeLabel")}
          value={t("event.timeValue")}
        />
        <DetailRow
          icon={MapPin}
          label={t("event.locationLabel")}
          value={t("event.locationValue")}
        />
      </div>
    </div>
  );
}

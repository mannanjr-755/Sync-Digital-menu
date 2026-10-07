import { Check, ChefHat, Bell, UtensilsCrossed } from "lucide-react";
import { TRACK_STEPS, isStepCurrent, isStepDone } from "@/lib/order-ui";

const ICONS = [Check, ChefHat, Bell, UtensilsCrossed];

type Props = {
  status: string;
  orientation?: "horizontal" | "vertical";
  timestamps?: Partial<Record<(typeof TRACK_STEPS)[number]["key"], string>>;
};

export function OrderStatusTimeline({
  status,
  orientation = "horizontal",
  timestamps,
}: Props) {
  if (orientation === "vertical") {
    return (
      <ol className="space-y-0">
        {TRACK_STEPS.map((step, index) => {
          const done = isStepDone(index, status) || isStepCurrent(index, status);
          const current = isStepCurrent(index, status);
          const Icon = ICONS[index];
          return (
            <li key={step.key} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full ${
                    done
                      ? "bg-[var(--sync-blue)] text-white"
                      : "border-2 border-[var(--border-strong)] bg-white text-[var(--text-dim)]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                {index < TRACK_STEPS.length - 1 && (
                  <span
                    className={`my-1 w-0.5 flex-1 min-h-8 ${
                      isStepDone(index + 1, status) || current
                        ? "bg-[var(--sync-blue)]"
                        : "border-l-2 border-dashed border-[var(--border-strong)]"
                    }`}
                  />
                )}
              </div>
              <div className="pb-6 pt-1.5">
                <p className={`text-sm font-semibold ${done ? "text-[var(--text)]" : "text-[var(--text-dim)]"}`}>
                  {index === 0 ? "Order Received" : step.label}
                </p>
                {timestamps?.[step.key] && (
                  <p className="mt-0.5 text-xs text-[var(--text-muted)]">{timestamps[step.key]}</p>
                )}
                {current && !timestamps?.[step.key] && (
                  <p className="mt-0.5 text-xs text-[var(--sync-blue)]">In progress</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    );
  }

  return (
    <ol className="grid grid-cols-4 gap-1">
      {TRACK_STEPS.map((step, index) => {
        const done = isStepDone(index, status) || isStepCurrent(index, status);
        const Icon = ICONS[index];
        return (
          <li key={step.key} className="flex flex-col items-center gap-2 text-center">
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-full ${
                done
                  ? "bg-[var(--sync-blue)] text-white"
                  : "bg-[var(--bg)] text-[var(--text-dim)] ring-1 ring-[var(--border)]"
              }`}
            >
              <Icon className="h-4 w-4" />
            </span>
            <span className={`text-[11px] font-medium ${done ? "text-[var(--text)]" : "text-[var(--text-dim)]"}`}>
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

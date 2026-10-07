import type { OrderStatus } from "@/lib/utils";

export const TRACK_STEPS = [
  { key: "received", label: "Received", statuses: ["NEW", "ACCEPTED"] },
  { key: "preparing", label: "Preparing", statuses: ["PREPARING"] },
  { key: "ready", label: "Ready", statuses: ["READY"] },
  { key: "served", label: "Served", statuses: ["COMPLETED"] },
] as const;

export function stepIndexForStatus(status: string): number {
  const idx = TRACK_STEPS.findIndex((s) =>
    (s.statuses as readonly string[]).includes(status)
  );
  return idx >= 0 ? idx : 0;
}

export function isStepDone(stepIndex: number, currentStatus: string): boolean {
  return stepIndex < stepIndexForStatus(currentStatus);
}

export function isStepCurrent(stepIndex: number, currentStatus: string): boolean {
  return stepIndex === stepIndexForStatus(currentStatus);
}

export function statusHeadline(status: string): string {
  switch (status as OrderStatus) {
    case "NEW":
    case "ACCEPTED":
      return "Your order has been received.";
    case "PREPARING":
      return "Your order is being prepared.";
    case "READY":
      return "Your order is ready.";
    case "COMPLETED":
      return "Your order has been served.";
    default:
      return "Tracking your order.";
  }
}

export function paymentLabel(method: string): string {
  switch (method) {
    case "counter":
      return "Pay at Counter";
    case "cash":
      return "Cash";
    case "card":
      return "Card";
    case "digital":
      return "Digital Payment";
    default:
      return method;
  }
}

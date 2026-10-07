import type { InputHTMLAttributes, ReactNode } from "react";

export function FormField({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-[var(--text)]">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-[var(--text-muted)]">{hint}</span>}
    </label>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-white px-3.5 py-3 text-sm text-[var(--text)] outline-none placeholder:text-[var(--text-dim)] focus:border-[var(--sync-blue)] focus:ring-2 focus:ring-[var(--sync-blue)]/15 ${props.className ?? ""}`}
    />
  );
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-white px-3.5 py-3 text-sm text-[var(--text)] outline-none placeholder:text-[var(--text-dim)] focus:border-[var(--sync-blue)] focus:ring-2 focus:ring-[var(--sync-blue)]/15 ${props.className ?? ""}`}
    />
  );
}

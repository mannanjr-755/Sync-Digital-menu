import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowRight } from "lucide-react";

type Common = {
  children: ReactNode;
  className?: string;
  showArrow?: boolean;
  variant?: "primary" | "secondary" | "light";
};

type AsButton = Common &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type AsLink = Common & {
  href: string;
  disabled?: boolean;
};

export function PrimaryButton(props: AsButton | AsLink) {
  const {
    children,
    className = "",
    showArrow = false,
    variant = "primary",
  } = props;

  const base =
    "inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50";

  const styles =
    variant === "light"
      ? "bg-white text-[var(--sync-blue)] hover:bg-white/95"
      : variant === "secondary"
        ? "border border-[var(--border-strong)] bg-white text-[var(--text)] hover:bg-[var(--bg)]"
        : "bg-[var(--sync-blue)] text-white hover:bg-[var(--sync-blue-dark)] shadow-[var(--shadow-sm)]";

  const content = (
    <>
      {children}
      {showArrow && <ArrowRight className="h-4 w-4" />}
    </>
  );

  if ("href" in props && props.href) {
    if (props.disabled) {
      return (
        <span className={`${base} ${styles} ${className} opacity-50`}>{content}</span>
      );
    }
    return (
      <Link href={props.href} className={`${base} ${styles} ${className}`}>
        {content}
      </Link>
    );
  }

  const buttonProps = props as AsButton;
  return (
    <button type={buttonProps.type ?? "button"} {...buttonProps} className={`${base} ${styles} ${className}`}>
      {content}
    </button>
  );
}

import Image from "next/image";
import Link from "next/link";

const crmBase =
  (process.env.NEXT_PUBLIC_CRM_URL || "http://localhost:3001").replace(/\/$/, "");

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <div className="absolute inset-0 bg-[var(--sync-blue)]" />
      <Image
        src="/logo.png"
        alt=""
        fill
        priority
        className="object-cover opacity-30"
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(24,58,122,0.35)] via-[rgba(32,72,153,0.55)] to-[rgba(11,18,32,0.92)]" />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Sync"
            width={48}
            height={48}
            className="h-12 w-12 rounded-xl object-cover ring-1 ring-white/25"
            priority
          />
          <p className="font-display text-2xl tracking-tight">Sync.</p>
        </div>
        <a
          href={`${crmBase}/login`}
          className="rounded-lg border border-white/35 px-5 py-2 text-sm font-medium text-white transition hover:bg-white/10"
        >
          Staff login
        </a>
      </header>

      <main className="relative z-10 mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-center px-6 pb-20 pt-10">
        <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.35em] text-white/70">
          Digital menu
        </p>
        <h1 className="font-display animate-fade-up mt-4 text-6xl leading-none tracking-tight sm:text-8xl">
          Sync.
        </h1>
        <p className="animate-fade-up mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
          Scan a table QR or NFC tag, browse the menu, and place orders that appear live for kitchen
          and staff.
        </p>

        <div className="animate-fade-up mt-10 flex flex-wrap gap-3">
          <Link
            href="/r/Sync/t/12"
            className="rounded-lg bg-white px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-[var(--sync-blue)] transition hover:bg-white/90"
          >
            Try demo menu
          </Link>
          <a
            href={`${crmBase}/login`}
            className="rounded-lg border border-white/40 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Open dashboard
          </a>
        </div>
      </main>
    </div>
  );
}

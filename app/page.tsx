"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Building2,
  Users,
  FileText,
  CreditCard,
  Receipt,
  BarChart3,
  CheckCircle,
  Menu,
  X,
  ArrowRight,
  Play,
  Star,
  Zap,
} from "lucide-react";

/* ─── Scroll-triggered fade-in wrapper ──────────────────────── */
function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
    >
      {children}
    </div>
  );
}

/* ─── Sticky Navbar ──────────────────────────────────────────── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-700/50 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-400" />
            <span className="text-white font-bold text-lg tracking-tight">
              Landlord Ledger
            </span>
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-slate-300 hover:text-white text-sm transition-colors"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-slate-300 hover:text-white text-sm transition-colors"
            >
              Pricing
            </a>
            <a
              href="#about"
              className="text-slate-300 hover:text-white text-sm transition-colors"
            >
              About
            </a>
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-slate-300 hover:text-white text-sm px-4 py-2 rounded-lg border border-slate-600 hover:border-slate-400 transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded-lg font-medium transition-all shadow-lg shadow-blue-500/20"
            >
              Start Free
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-slate-300 hover:text-white p-2 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0f172a] border-b border-slate-700/50 shadow-xl">
          <div className="px-4 py-4 space-y-1">
            {["#features", "#pricing", "#about"].map((href) => (
              <a
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="block text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2.5 rounded-lg text-sm capitalize transition-colors"
              >
                {href.replace("#", "")}
              </a>
            ))}
            <div className="pt-3 space-y-2 border-t border-slate-800 mt-3">
              <Link
                href="/login"
                className="block text-center text-slate-300 border border-slate-600 rounded-lg py-2.5 text-sm transition-colors hover:border-slate-400"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="block text-center bg-blue-600 hover:bg-blue-500 text-white rounded-lg py-2.5 text-sm font-medium transition-colors"
              >
                Start Free
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div
      className="min-h-screen antialiased"
      style={{ backgroundColor: "#0f172a", color: "#f8fafc" }}
    >
      <Navbar />

      {/* ── 1. Hero ─────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-20 sm:pt-36 sm:pb-28 overflow-hidden">
        {/* Ambient glow blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-48 -right-40 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-40 w-96 h-96 bg-blue-800/8 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-blue-300 text-sm mb-8">
              <Zap className="h-3.5 w-3.5" />
              Built for independent US landlords
            </div>
          </FadeIn>

          <FadeIn delay={100}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 max-w-4xl mx-auto">
              The Simplest Way to{" "}
              <span className="text-blue-400">Manage Your Rental Properties</span>
            </h1>
          </FadeIn>

          <FadeIn delay={200}>
            <p className="text-lg sm:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Track tenants, leases, payments, and expenses — all in one place.
              Built for independent US landlords who want clarity, not complexity.
            </p>
          </FadeIn>

          <FadeIn delay={300}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
              >
                Start for Free
                <ArrowRight className="h-5 w-5" />
              </Link>
              <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-slate-300 hover:text-white border border-slate-600 hover:border-slate-400 px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:-translate-y-0.5">
                <Play className="h-5 w-5 fill-current" />
                Watch Demo
              </button>
            </div>
          </FadeIn>

          <FadeIn delay={400}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
              {[
                "No credit card required",
                "Free forever for 2 properties",
                "Setup in under 10 minutes",
              ].map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </FadeIn>

          {/* Dashboard mockup */}
          <FadeIn delay={500}>
            <div className="mt-16 max-w-5xl mx-auto">
              <div className="rounded-2xl overflow-hidden border border-slate-700/60 shadow-2xl shadow-black/50">
                {/* Browser chrome */}
                <div className="bg-[#1e293b] px-4 py-3 flex items-center gap-3 border-b border-slate-700">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/60" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                    <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  </div>
                  <div className="bg-slate-700/80 rounded-md px-3 py-1 text-xs text-slate-400">
                    app.landoraapp.com/dashboard
                  </div>
                </div>

                {/* Mock dashboard UI */}
                <div className="bg-[#0f172a] p-5 sm:p-8">
                  <div className="flex gap-4 min-h-[260px]">
                    {/* Sidebar mock */}
                    <div className="hidden sm:flex w-40 bg-[#1e293b] rounded-xl p-3 flex-col gap-1 shrink-0">
                      {[
                        { label: "Dashboard", active: true },
                        { label: "Properties", active: false },
                        { label: "Tenants", active: false },
                        { label: "Leases", active: false },
                        { label: "Payments", active: false },
                        { label: "Reports", active: false },
                      ].map(({ label, active }) => (
                        <div
                          key={label}
                          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs ${
                            active
                              ? "bg-blue-600/20 text-blue-300 font-medium"
                              : "text-slate-500"
                          }`}
                        >
                          <div
                            className={`w-2.5 h-2.5 rounded-sm ${
                              active ? "bg-blue-500" : "bg-slate-600"
                            }`}
                          />
                          {label}
                        </div>
                      ))}
                    </div>

                    {/* Main content mock */}
                    <div className="flex-1 space-y-4">
                      <p className="text-slate-400 text-sm font-medium">
                        Overview — April 2026
                      </p>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: "Expected Rent", val: "$4,200", color: "text-white" },
                          { label: "Collected", val: "$3,800", color: "text-green-400" },
                          { label: "Outstanding", val: "$400", color: "text-amber-400" },
                        ].map(({ label, val, color }) => (
                          <div
                            key={label}
                            className="bg-[#1e293b] rounded-xl p-3 sm:p-4"
                          >
                            <p className="text-slate-500 text-[10px] sm:text-xs mb-1">
                              {label}
                            </p>
                            <p className={`text-sm sm:text-lg font-bold ${color}`}>
                              {val}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="bg-[#1e293b] rounded-xl p-4">
                        <p className="text-slate-400 text-xs mb-3 font-medium">
                          Recent Payments
                        </p>
                        <div className="space-y-2.5">
                          {[
                            { name: "Sarah K.", unit: "Unit 2A", amount: "$1,200", status: "Paid", ok: true },
                            { name: "Mike T.", unit: "Unit 1B", amount: "$950", status: "Due", ok: false },
                            { name: "Lisa M.", unit: "Unit 3C", amount: "$1,100", status: "Paid", ok: true },
                          ].map(({ name, unit, amount, status, ok }) => (
                            <div
                              key={name}
                              className="flex items-center justify-between text-xs"
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center text-slate-300 text-[10px] font-bold">
                                  {name[0]}
                                </div>
                                <span className="text-slate-300 hidden sm:inline">
                                  {name}
                                </span>
                                <span className="text-slate-600 hidden sm:inline">
                                  {unit}
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-slate-300 font-medium">
                                  {amount}
                                </span>
                                <span
                                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                    ok
                                      ? "text-green-400 bg-green-500/10"
                                      : "text-amber-400 bg-amber-500/10"
                                  }`}
                                >
                                  {status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── 2. Pain Points ──────────────────────────────────────── */}
      <section className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Sound familiar?
              </h2>
              <p className="text-slate-400 text-lg">
                If you manage rentals, you know the pain.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                emoji: "📊",
                text: "Still tracking rent payments in spreadsheets or notes?",
                delay: 0,
              },
              {
                emoji: "🤔",
                text: "Forgetting which tenant owes what — or when their lease expires?",
                delay: 100,
              },
              {
                emoji: "😰",
                text: "Scrambling at tax time because your expense records are a mess?",
                delay: 200,
              },
            ].map(({ emoji, text, delay }) => (
              <FadeIn key={text} delay={delay}>
                <div className="group relative bg-slate-800/40 border border-slate-700/50 rounded-2xl p-8 hover:border-blue-500/30 hover:bg-slate-800/60 transition-all">
                  <div className="text-4xl mb-4">{emoji}</div>
                  <p className="text-lg text-slate-300 leading-relaxed font-medium">
                    &ldquo;{text}&rdquo;
                  </p>
                  <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <CheckCircle className="h-5 w-5 text-blue-400" />
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Features ─────────────────────────────────────────── */}
      <section id="features" className="py-20 sm:py-24 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Everything a landlord needs.{" "}
                <span className="text-slate-400">Nothing they don&apos;t.</span>
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                All the tools to run your rental business, in one clean dashboard.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                Icon: Building2,
                title: "Property & Unit Management",
                desc: "Add unlimited properties and units, organized your way.",
                iconColor: "text-blue-400",
                iconBg: "bg-blue-500/10 border-blue-500/20",
                delay: 0,
              },
              {
                Icon: Users,
                title: "Tenant Profiles",
                desc: "Store contact info, lease history, and notes per tenant.",
                iconColor: "text-violet-400",
                iconBg: "bg-violet-500/10 border-violet-500/20",
                delay: 80,
              },
              {
                Icon: FileText,
                title: "Lease Tracking",
                desc: "Know exactly when leases start, end, and need renewal.",
                iconColor: "text-emerald-400",
                iconBg: "bg-emerald-500/10 border-emerald-500/20",
                delay: 160,
              },
              {
                Icon: CreditCard,
                title: "Payment Logging",
                desc: "Record every rent payment. See who's paid and who hasn't.",
                iconColor: "text-amber-400",
                iconBg: "bg-amber-500/10 border-amber-500/20",
                delay: 240,
              },
              {
                Icon: Receipt,
                title: "Expense Tracking",
                desc: "Log repairs, insurance, utilities — all categorized.",
                iconColor: "text-rose-400",
                iconBg: "bg-rose-500/10 border-rose-500/20",
                delay: 320,
              },
              {
                Icon: BarChart3,
                title: "Financial Reports",
                desc: "NOI by property, rent roll, and expense summaries ready to export.",
                iconColor: "text-cyan-400",
                iconBg: "bg-cyan-500/10 border-cyan-500/20",
                delay: 400,
              },
            ].map(({ Icon, title, desc, iconColor, iconBg, delay }) => (
              <FadeIn key={title} delay={delay}>
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 transition-all">
                  <div
                    className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-5 ${iconBg}`}
                  >
                    <Icon className={`h-6 w-6 ${iconColor}`} />
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. How It Works ─────────────────────────────────────── */}
      <section className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Up and running in minutes
              </h2>
              <p className="text-slate-400 text-lg">
                No training, no onboarding call. Just sign up and go.
              </p>
            </div>
          </FadeIn>

          <div className="relative max-w-2xl mx-auto">
            {/* Connecting line */}
            <div className="absolute left-[22px] top-14 bottom-14 w-px bg-gradient-to-b from-blue-500 via-blue-500/40 to-transparent hidden sm:block" />

            <div className="space-y-10">
              {[
                {
                  step: "1",
                  title: "Add your properties and units",
                  desc: "Enter your property addresses and configure each unit. Takes about 2 minutes per property.",
                  delay: 0,
                },
                {
                  step: "2",
                  title: "Set up tenants and leases",
                  desc: "Add your tenants, attach them to units, and set lease terms and rent amounts.",
                  delay: 150,
                },
                {
                  step: "3",
                  title: "Track payments and expenses — reports update automatically",
                  desc: "Log rent payments and expenses as they happen. Your financial overview stays current with no manual work.",
                  delay: 300,
                },
              ].map(({ step, title, desc, delay }) => (
                <FadeIn key={step} delay={delay}>
                  <div className="flex gap-6">
                    <div className="shrink-0 w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/30 relative z-10">
                      {step}
                    </div>
                    <div className="pt-1">
                      <h3 className="text-white font-semibold text-lg sm:text-xl mb-2">
                        {title}
                      </h3>
                      <p className="text-slate-400 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>

          <FadeIn delay={500}>
            <div className="text-center mt-14">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
              >
                Get Started Now
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── 5. Pricing ──────────────────────────────────────────── */}
      <section id="pricing" className="py-20 sm:py-24 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Simple, transparent pricing
              </h2>
              <p className="text-slate-400 text-lg">No contracts. Cancel anytime.</p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Free tier */}
            <FadeIn delay={0}>
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-8 flex flex-col h-full">
                <div className="flex-1">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">
                    Free
                  </p>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-5xl font-bold text-white">$0</span>
                    <span className="text-slate-500 text-sm">/month</span>
                  </div>
                  <p className="text-slate-500 text-sm mb-8">
                    No credit card required
                  </p>
                  <ul className="space-y-3 mb-8">
                    {[
                      "Up to 2 properties",
                      "All core features included",
                      "Tenant & lease management",
                      "Payment & expense tracking",
                      "Basic financial overview",
                    ].map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-3 text-slate-300 text-sm"
                      >
                        <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href="/signup"
                  className="block text-center bg-slate-700 hover:bg-slate-600 text-white py-3 px-6 rounded-xl font-semibold transition-all"
                >
                  Get Started Free
                </Link>
              </div>
            </FadeIn>

            {/* Pro tier */}
            <FadeIn delay={150}>
              <div className="relative bg-gradient-to-br from-blue-600/20 to-blue-900/20 border border-blue-500/40 rounded-2xl p-8 flex flex-col h-full shadow-2xl shadow-blue-500/10">
                <div className="absolute top-5 right-5">
                  <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    Most Popular
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-3">
                    Pro
                  </p>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-5xl font-bold text-white">$9</span>
                    <span className="text-slate-500 text-sm">/month</span>
                  </div>
                  <p className="text-slate-500 text-sm mb-8">
                    Billed monthly, cancel anytime
                  </p>
                  <ul className="space-y-3 mb-8">
                    {[
                      "Unlimited properties",
                      "PDF export for reports",
                      "Priority support",
                      "Advanced financial reports",
                      "Everything in Free",
                    ].map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-3 text-slate-300 text-sm"
                      >
                        <CheckCircle className="h-4 w-4 text-blue-400 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href="/signup"
                  className="block text-center bg-blue-600 hover:bg-blue-500 text-white py-3 px-6 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/25"
                >
                  Start Pro Trial
                </Link>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={300}>
            <p className="text-center text-slate-600 text-sm mt-8">
              No contracts. Cancel anytime. Upgrade or downgrade whenever you need.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── 6. Testimonials ─────────────────────────────────────── */}
      <section id="about" className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Trusted by independent landlords
              </h2>
              <p className="text-slate-400 text-lg">
                Hear from landlords who made the switch.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* TODO: Replace with real customer testimonials when available */}
            {[
              {
                quote:
                  "Finally, a tool that doesn't feel like accounting software.",
                name: "Mike T.",
                detail: "Ohio · 3 units",
                delay: 0,
              },
              {
                quote:
                  "I replaced 4 spreadsheets with this. Took 10 minutes to set up.",
                name: "Sarah K.",
                detail: "Texas · 7 units",
                delay: 150,
              },
            ].map(({ quote, name, detail, delay }) => (
              <FadeIn key={name} delay={delay}>
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-8">
                  <div className="flex gap-1 mb-5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-amber-400 fill-amber-400"
                      />
                    ))}
                  </div>
                  <blockquote className="text-white text-lg font-medium mb-6 leading-relaxed">
                    &ldquo;{quote}&rdquo;
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-white font-bold text-sm">
                      {name[0]}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{name}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{detail}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. Final CTA ────────────────────────────────────────── */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 px-8 py-16 sm:p-20 text-center">
              <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/5 rounded-full" />
              <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-white/5 rounded-full" />
              <div className="relative">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                  Start managing smarter today
                </h2>
                <p className="text-blue-100 text-lg sm:text-xl mb-10 max-w-xl mx-auto">
                  Free forever for up to 2 properties. No credit card required.
                </p>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 bg-white hover:bg-blue-50 text-blue-700 px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-xl hover:-translate-y-0.5"
                >
                  Create Your Free Account
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── 8. Footer ───────────────────────────────────────────── */}
      <footer className="border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                <Building2 className="h-5 w-5 text-blue-400" />
                <span className="text-white font-bold">Landlord Ledger</span>
              </div>
              <p className="text-slate-500 text-sm max-w-xs">
                Simple property management for independent landlords.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
              <a href="#" className="hover:text-slate-300 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-slate-300 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-slate-300 transition-colors">
                Contact
              </a>
            </div>
          </div>
          <div className="border-t border-slate-800/80 mt-8 pt-8 text-center text-slate-600 text-sm">
            © 2026 Landlord Ledger. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

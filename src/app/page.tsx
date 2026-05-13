"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Header from "@/components/Header";
import HeroSphere from "@/components/HeroSphere";
import PlanSelector from "@/components/PlanSelector";
import FeaturesSection from "@/components/FeaturesSection";
import CTASection from "@/components/CTASection";
import { ArrowRight, CreditCard, Globe } from "lucide-react";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

function GradientBlob({
  className,
  color1,
  color2,
}: {
  className?: string;
  color1: string;
  color2: string;
}) {
  return (
    <div
      className={`absolute rounded-full blur-[120px] opacity-30 dark:opacity-20 animate-blob pointer-events-none ${className ?? ""}`}
      style={{
        background: `radial-gradient(circle, ${color1}, ${color2})`,
      }}
    />
  );
}

function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = (window.scrollY / h) * 100;
      bar.style.width = `${p}%`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="scroll-progress">
      <div ref={barRef} className="scroll-progress-bar" style={{ width: "0%" }} />
    </div>
  );
}

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaBtnRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      headingRef.current,
      { opacity: 0, y: 60, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 1.2 }
    )
      .fromTo(
        subRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.6"
      )
      .fromTo(
        ctaBtnRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.3"
      )
      .fromTo(
        statsRef.current?.children ?? [],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
        "-=0.2"
      )
      .fromTo(
        scrollHintRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6 },
        "-=0.1"
      );
  }, []);

  return (
    <>
      <ScrollProgress />
      <Header />

      <main>
        <section
          id="hero"
          ref={heroRef}
          className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-zinc-950 pt-16 md:pt-20"
        >
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-100/60 via-white to-white dark:from-indigo-950/40 dark:via-zinc-950 dark:to-zinc-950 z-10" />
            <GradientBlob
              color1="rgba(99,102,241,0.4)"
              color2="rgba(139,92,246,0.2)"
              className="top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] dark:w-[500px] dark:h-[500px]"
            />
            <GradientBlob
              color1="rgba(124,58,237,0.3)"
              color2="rgba(79,70,229,0.1)"
              className="top-1/3 -right-1/4 w-[400px] h-[400px] dark:w-[300px] dark:h-[300px]"
            />
            <GradientBlob
              color1="rgba(99,102,241,0.2)"
              color2="rgba(59,130,246,0.1)"
              className="bottom-1/4 -left-1/4 w-[350px] h-[350px]"
            />
            <HeroSphere />
          </div>

          <div className="relative z-0 flex flex-col items-center text-center px-6 max-w-4xl">
            <div className="inline-flex items-center gap-3 rounded-full bg-white/60 dark:bg-white/[0.04] backdrop-blur-xl border border-white/20 dark:border-white/[0.06] px-5 py-2 mb-8 shadow-lg dark:shadow-none">
              <Image
                src="/logo_sgf.webp"
                alt="Sisprot Global Fiber"
                width={30}
                height={30}
                className="rounded-lg shrink-0"
              />
                <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium tracking-wide">
                  <strong className="text-zinc-900 dark:text-white">Sisprot Global Fiber</strong> — Conectividad que transforma
                </span>
            </div>

            <h1
              ref={headingRef}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.04] tracking-tight"
            >
              <span className="block bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-500 dark:from-white dark:via-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent">
                Internet que
              </span>
              <span className="block bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-500 dark:from-yellow-400 dark:via-amber-300 dark:to-yellow-400 bg-clip-text text-transparent">
                conecta tu mundo
              </span>
            </h1>

            <p
              ref={subRef}
              className="mt-6 text-lg md:text-xl text-zinc-500 max-w-xl leading-relaxed"
            >
              Fibra óptica de alta velocidad para hogar y empresa. Planes flexibles,
              soporte 24/7 y la mejor experiencia de navegación.
            </p>

            <div
              ref={ctaBtnRef}
              className="mt-10 flex flex-col gap-4 items-center"
            >
              <a
                href="#planes"
                className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-full bg-linear-to-r from-blue-700 to-blue-600 hover:from-gray-800 hover:to-blue-700 text-white shadow-xl shadow-blue-700/30 hover:shadow-blue-700/50 dark:from-yellow-400 dark:to-amber-400 dark:hover:from-yellow-500 dark:hover:to-amber-500 dark:text-zinc-900 dark:shadow-yellow-400/30 hover:scale-[1.02] transition-all duration-300 overflow-hidden"
                aria-label="Ver planes"
              >
                <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <Globe size={18} className="shrink-0 mr-2" />
                <span className="inline-flex items-center gap-2">
                  <span>Ver planes</span>
                  <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </a>
              <div className="flex gap-3">
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-full border border-zinc-300 dark:border-zinc-700 px-5 py-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:border-red-400 dark:hover:border-red-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-300"
                  aria-label="YouTube"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  <span className="hidden sm:inline">YouTube</span>
                </a>
                <a
                  href="https://pagos.sisprotglobalfiber.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-full border border-zinc-300 dark:border-zinc-700 px-5 py-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:border-yellow-400 dark:hover:border-yellow-500 hover:text-yellow-600 dark:hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-950/20 transition-all duration-300"
                  aria-label="Portal de pagos"
                >
                  <CreditCard size={18} />
                  <span className="hidden sm:inline">Ir al portal</span>
                </a>
              </div>
            </div>

            <div
              ref={statsRef}
              className="mt-16 grid grid-cols-3 gap-x-12 gap-y-4 text-center"
            >
              {[
                { value: "200+", label: "Localidades" },
                { value: "50K+", label: "Clientes" },
                { value: "99.9%", label: "Disponibilidad" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-b from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
                    {s.value}
                  </p>
                  <p className="text-xs text-zinc-600 mt-1 tracking-wide uppercase">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <PlanSelector />
        <FeaturesSection />
        <CTASection />
      </main>

      <footer className="relative border-t border-zinc-200 dark:border-zinc-800/50 py-8 bg-white dark:bg-zinc-950 overflow-hidden">
        <div className="absolute inset-0 iridescent opacity-50 dark:opacity-100" />
        <div className="relative mx-auto max-w-6xl px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Image
              src="/logo_sgf.webp"
              alt="Sisprot Global Fiber"
              width={24}
              height={24}
              className="rounded"
            />
            <p className="text-sm text-zinc-500 dark:text-zinc-500">
              © 2026 Sisprot Global Fiber. Todos los derechos reservados.
            </p>
          </div>
          <div className="flex gap-6 text-sm text-zinc-500 dark:text-zinc-500">
            <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors duration-300">
              Términos
            </a>
            <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors duration-300">
              Privacidad
            </a>
            <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors duration-300">
              Contacto
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}

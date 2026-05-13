"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Header from "@/components/Header";
import HeroSphere from "@/components/HeroSphere";
import PlanSelector from "@/components/PlanSelector";
import FeaturesSection from "@/components/FeaturesSection";
import CTASection from "@/components/CTASection";
import { ArrowRight } from "lucide-react";

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
          className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-zinc-950"
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

          <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/60 dark:bg-white/[0.04] backdrop-blur-xl border border-white/20 dark:border-white/[0.06] px-4 py-1.5 mb-8 shadow-lg dark:shadow-none">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 animate-ping opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium tracking-wide uppercase">
                Red con 99.9% de disponibilidad
              </span>
            </div>

            <h1
              ref={headingRef}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold leading-[1.02] tracking-tight"
            >
              <span className="block bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-500 dark:from-white dark:via-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent">
                Internet que
              </span>
              <span className="block bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 dark:from-indigo-400 dark:via-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
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
              className="mt-10 flex flex-col sm:flex-row gap-4"
            >
              <a
                href="#planes"
                className="group relative inline-flex items-center gap-2 rounded-full bg-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-indigo-600/30 hover:bg-indigo-500 hover:shadow-indigo-600/50 transition-all duration-300 overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                Ver planes
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a
                href="#features"
                className="group inline-flex items-center gap-2 rounded-full border border-zinc-300 dark:border-zinc-800 px-8 py-4 text-base font-semibold text-zinc-700 dark:text-zinc-300 hover:border-zinc-500 dark:hover:border-zinc-700 hover:text-zinc-900 dark:hover:text-white transition-all duration-300"
              >
                Conocer más
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0" />
              </a>
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

          <div
            ref={scrollHintRef}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
          >
            <span className="text-[10px] text-zinc-400 dark:text-zinc-600 tracking-widest uppercase">
              Scroll
            </span>
            <div className="h-10 w-6 rounded-full border-2 border-zinc-300 dark:border-zinc-700 flex justify-center">
              <div className="h-2.5 w-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500 mt-2 animate-bounce" />
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
          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            © 2026 NetPortal. Todos los derechos reservados.
          </p>
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

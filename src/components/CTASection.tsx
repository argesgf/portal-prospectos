"use client";

import { useEffect, useRef } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { ShineBorder } from "@/components/ui/shine-border";

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
      className={`absolute rounded-full blur-[100px] opacity-25 dark:opacity-15 animate-blob pointer-events-none ${className ?? ""}`}
      style={{
        background: `radial-gradient(circle, ${color1}, ${color2})`,
      }}
    />
  );
}

function MagneticButton({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  const btnRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;

    const onMove = (e: PointerEvent) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const dist = Math.sqrt(x * x + y * y);
      const maxDist = 200;
      const strength = Math.max(0, 1 - dist / maxDist);
      btn.style.transform = `translate(${x * 0.25 * strength}px, ${y * 0.25 * strength}px)`;
    };

    const onLeave = () => {
      btn.style.transform = "translate(0, 0)";
    };

    btn.addEventListener("pointermove", onMove);
    btn.addEventListener("pointerleave", onLeave);
    return () => {
      btn.removeEventListener("pointermove", onMove);
      btn.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <a
      ref={btnRef}
      href={href}
      className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-indigo-600/30 transition-shadow hover:shadow-indigo-600/50 will-change-transform overflow-hidden"
      style={{ transition: "box-shadow 0.3s, transform 0.1s" }}
    >
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      {children}
    </a>
  );
}

export default function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const gsapCleanup = useRef<(() => void) | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      gsap.registerPlugin(ScrollTrigger);
      if (cancelled) return;

      const ctx = gsap.context(() => {
        if (contentRef.current) {
          gsap.fromTo(
            contentRef.current,
            { opacity: 0, y: 60 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: contentRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      });

      gsapCleanup.current = () => ctx.revert();
    })();

    return () => {
      cancelled = true;
      gsapCleanup.current?.();
    };
  }, []);

  return (
    <section
      id="cta"
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-zinc-50 dark:bg-zinc-950 overflow-hidden"
      style={{ contentVisibility: "auto" }}
    >
      <GradientBlob
        color1="rgba(99,102,241,0.3)"
        color2="rgba(124,58,237,0.15)"
        className="top-1/2 left-1/3 w-[500px] h-[500px]"
      />
      <GradientBlob
        color1="rgba(139,92,246,0.2)"
        color2="rgba(79,70,229,0.1)"
        className="bottom-1/3 right-1/4 w-[400px] h-[400px]"
      />

      <div className="relative mx-auto max-w-4xl px-6">
        <div
          ref={contentRef}
          className="transition-all duration-700 ease-out"
        >
          <ShineBorder
            borderWidth={2}
            className="bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl border border-white/20 dark:border-zinc-800/60 shadow-xl dark:shadow-2xl dark:shadow-black/20"
            color={["#4f46e5", "#7c3aed", "#6366f1"]}
          >
            <div className="flex flex-col items-center text-center py-12 px-8 md:py-16 md:px-12">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-600/10 text-indigo-600 dark:text-indigo-400">
                <Sparkles size={28} />
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white leading-tight">
                ¿Listo para navegar sin límites?
              </h2>
              <p className="mt-3 text-zinc-600 dark:text-zinc-400 max-w-md text-base md:text-lg">
                Contratá hoy y recibí el primer mes con 50% de descuento. Sin permanencia.
              </p>
              <div className="mt-8">
                <MagneticButton href="#planes">
                  Ver planes disponibles
                  <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                </MagneticButton>
              </div>
              <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-600 tracking-wide">
                Instalación sin cargo · SIN permanencia · Soporte 24/7
              </p>
            </div>
          </ShineBorder>
        </div>
      </div>
    </section>
  );
}

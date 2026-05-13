"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { usePlan } from "@/lib/context/plan-context";
import type { TipoUsuario } from "@/lib/mock/data";
import { planesPersonas, planesEmpresas, type Plan } from "@/lib/mock/data";
import { Check, Wifi, Building2 } from "lucide-react";
import { ShineBorder } from "@/components/ui/shine-border";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type PlanTier = "personas" | "empresas";

const tabs = [
  { value: "personas", label: "Para tu hogar", icon: Wifi },
  { value: "empresas", label: "Para tu empresa", icon: Building2 },
] as const;

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
      className={`absolute rounded-full blur-[120px] opacity-25 dark:opacity-15 animate-blob3 pointer-events-none ${className ?? ""}`}
      style={{
        background: `radial-gradient(circle, ${color1}, ${color2})`,
      }}
    />
  );
}

export default function PlanSelector() {
  const router = useRouter();
  const { setTipoUsuario, setSelectedPlan, resetFlow } = usePlan();
  const [tier, setTier] = useState<PlanTier>("personas");
  const [isDark, setIsDark] = useState(false);
  const plans = tier === "personas" ? planesPersonas : planesEmpresas;

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const handleContratar = (plan: Plan) => {
    const tipo: TipoUsuario = tier === "personas" ? "persona" : "empresa";
    resetFlow();
    setTipoUsuario(tipo);
    setSelectedPlan(plan);
    router.push("/contacto");
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
      if (tabsRef.current) {
        gsap.fromTo(
          tabsRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: tabsRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    });

    const cards = cardsRef.current?.children;
    if (cards) {
      const ctx2 = gsap.context(() => {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
      return () => { ctx.revert(); ctx2.revert(); };
    }

    return () => ctx.revert();
  }, []);

  return (
    <section id="planes" ref={sectionRef} className="relative py-24 md:py-32 bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
      <GradientBlob
        color1="rgba(79,70,229,0.3)"
        color2="rgba(124,58,237,0.15)"
        className="top-1/3 left-1/4 w-[500px] h-[500px]"
      />
      <GradientBlob
        color1="rgba(99,102,241,0.2)"
        color2="rgba(139,92,246,0.1)"
        className="bottom-1/4 right-1/3 w-[400px] h-[400px]"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div ref={headingRef} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white leading-tight">
            Elegí el plan{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
              perfecto
            </span>
          </h2>
          <p className="mt-4 text-zinc-500 max-w-lg mx-auto text-base md:text-lg">
            Seleccioná la categoría que mejor se adapte a tus necesidades
          </p>
        </div>

        <div ref={tabsRef} className="flex justify-center mb-12">
          <div className="inline-flex rounded-full bg-white/60 dark:bg-white/[0.04] backdrop-blur-xl border border-white/20 dark:border-white/[0.06] p-1 shadow-lg dark:shadow-none">
            {tabs.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setTier(value)}
                className={cn(
                  "flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300",
                  tier === value
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                )}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div
          ref={cardsRef}
          key={tier}
          className="grid md:grid-cols-3 gap-6"
        >
          {plans.map((plan) => (
              <ShineBorder
                key={plan.name}
                borderWidth={1.2}
                color={isDark ? ["#facc15", "#f59e0b", "#facc15"] : ["#1d4ed8", "#6366f1", "#1d4ed8"]}
                className="bg-white/60 dark:bg-white/[0.04] backdrop-blur-xl border border-white/20 dark:border-white/[0.06] shadow-xl dark:shadow-2xl dark:shadow-black/20"
              >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-lg bg-gradient-to-r from-pink-500 to-cyan-500 px-4 py-1 text-xs font-semibold text-white shadow-lg z-10">
                  Más popular
                </span>
              )}

              <div className="p-6 flex flex-col h-full w-full">
                <div className="mb-2">
                  <p className="text-sm text-zinc-500 uppercase tracking-wider">{plan.speed}</p>
                  <h3 className="mt-1 text-xl font-bold text-zinc-900 dark:text-white">{plan.name}</h3>
                </div>

                <div className="mt-4 mb-6">
                  <span className="text-3xl font-bold text-zinc-900 dark:text-white">{plan.price}</span>
                </div>

                <ul className="space-y-3 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                      <Check size={16} className="mt-0.5 shrink-0 text-indigo-500 dark:text-indigo-400" />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleContratar(plan)}
                  className={cn(
                    "mt-8 w-full rounded-xl py-3 text-sm font-semibold transition-all duration-300",
                    plan.popular
                      ? "bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-lg shadow-blue-700/25 hover:shadow-blue-700/40 hover:scale-[1.02] dark:from-yellow-400 dark:to-amber-400 dark:text-zinc-900 dark:shadow-yellow-400/25 dark:hover:shadow-yellow-400/40"
                      : "border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-blue-600 hover:text-blue-700 dark:hover:text-white hover:scale-[1.02]"
                  )}
                >
                  Contratar
                </button>
              </div>
            </ShineBorder>
          ))}
        </div>
      </div>
    </section>
  );
}

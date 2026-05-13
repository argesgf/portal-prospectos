"use client";

import { useEffect, useRef } from "react";
import { Zap, Shield, Gauge, Globe, Headphones, Wifi } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Fibra Óptica",
    desc: "Conexión simétrica de alta velocidad con la tecnología más avanzada del mercado.",
  },
  {
    icon: Shield,
    title: "Seguridad Total",
    desc: "Protección antivirus, firewall y control parental incluidos en todos los planes.",
  },
  {
    icon: Gauge,
    title: "Baja Latencia",
    desc: "Ideal para gaming, streaming 4K y videoconferencias sin cortes ni demoras.",
  },
  {
    icon: Globe,
    title: "Cobertura Nacional",
    desc: "Presentes en más de 200 localidades con infraestructura de última generación.",
  },
  {
    icon: Headphones,
    title: "Soporte 24/7",
    desc: "Atención al cliente todos los días del año con técnicos especializados.",
  },
  {
    icon: Wifi,
    title: "WiFi Mesh",
    desc: "Cobertura total en cada rincón de tu hogar u oficina sin puntos muertos.",
  },
];

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
      className={`absolute rounded-full blur-[100px] opacity-25 dark:opacity-15 animate-blob2 pointer-events-none ${className ?? ""}`}
      style={{
        background: `radial-gradient(circle, ${color1}, ${color2})`,
      }}
    />
  );
}

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
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

        const cards = cardsRef.current?.children;
        if (cards) {
          gsap.fromTo(
            cards,
            { opacity: 0, y: 60 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: cardsRef.current,
                start: "top 75%",
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
      id="features"
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden bg-white dark:bg-zinc-950"
      style={{ contentVisibility: "auto" }}
    >
      <GradientBlob
        color1="rgba(99,102,241,0.3)"
        color2="rgba(139,92,246,0.1)"
        className="top-1/4 -left-1/3 w-[500px] h-[500px]"
      />
      <GradientBlob
        color1="rgba(124,58,237,0.2)"
        color2="rgba(79,70,229,0.1)"
        className="bottom-1/3 -right-1/4 w-[400px] h-[400px]"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div ref={headingRef} className="text-center mb-16 md:mb-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white leading-tight">
            Todo lo que{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
              necesitás
            </span>
          </h2>
          <p className="mt-4 text-zinc-500 max-w-lg mx-auto text-base md:text-lg">
            Tecnología de punta pensada para hogares y empresas que exigen lo mejor
          </p>
        </div>

        <div
          ref={cardsRef}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="group rounded-2xl bg-white/50 dark:bg-white/[0.03] backdrop-blur-xl border border-white/20 dark:border-white/[0.06] shadow-lg dark:shadow-none p-6 hover:border-indigo-400/60 dark:hover:border-indigo-500/40 hover:shadow-xl dark:hover:shadow-indigo-500/5 transition-all duration-500"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100/80 dark:bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-600/20 group-hover:scale-110 transition-all duration-300">
                  <Icon size={22} />
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{f.title}</h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-500 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

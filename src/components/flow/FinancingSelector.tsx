"use client";

import { usePlan } from "@/lib/context/plan-context";
import { cn } from "@/lib/utils";
import { RECARGO_FINANCIAMIENTO } from "@/lib/mock/data";
import { CreditCard, CalendarClock, Percent } from "lucide-react";
import type { TipoFinanciamiento } from "@/lib/mock/data";

export default function FinancingSelector() {
  const { tipoFinanciamiento, setTipoFinanciamiento, selectedPlan } = usePlan();

  if (!selectedPlan || selectedPlan.price === 0) return null;

  const options: {
    value: TipoFinanciamiento;
    label: string;
    desc: string;
    icon: typeof CreditCard;
    multiplier: number;
  }[] = [
    {
      value: "contado",
      label: "Pago único",
      desc: "Pago mensual sin recargos adicionales",
      icon: CreditCard,
      multiplier: 1,
    },
    {
      value: "financiamiento",
      label: "Financiamiento",
      desc: "Paga en cuotas con un pequeño recargo del 15%",
      icon: CalendarClock,
      multiplier: 1 + RECARGO_FINANCIAMIENTO,
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
          Modalidad de pago
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Elige cómo prefieres pagar tu plan mensual
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {options.map((opt) => {
          const selected = tipoFinanciamiento === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => setTipoFinanciamiento(opt.value)}
              className={cn(
                "relative flex flex-col items-start gap-3 rounded-2xl border-2 p-5 text-left transition-[border-color,background-color,box-shadow] duration-300 active:scale-[0.98]",
                selected
                  ? "border-yellow-400 bg-yellow-50 dark:bg-yellow-950/20 shadow-lg shadow-yellow-400/10"
                  : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700"
              )}
            >
              {selected && (
                <div className="absolute top-3 right-3 h-3 w-3 rounded-full bg-yellow-500 anim-fade-in" />
              )}

              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl",
                  selected
                    ? "bg-yellow-400 text-zinc-900"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                )}
              >
                <opt.icon size={20} />
              </div>

              <div>
                <p className="font-bold text-zinc-900 dark:text-white">
                  {opt.label}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {opt.desc}
                </p>
              </div>

              <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-lg p-3">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Pago mensual estimado
                </p>
                <p
                  className={cn(
                    "text-xl font-bold",
                    selected
                      ? "text-yellow-600 dark:text-yellow-400"
                      : "text-zinc-600 dark:text-zinc-400"
                  )}
                >
                  ${Math.round(selectedPlan.price * opt.multiplier).toLocaleString("es-VE")}
                  <span className="text-xs font-normal text-zinc-500">
                    /mes
                  </span>
                </p>
              </div>

              {opt.value === "financiamiento" && (
                <div className="flex items-center gap-1.5 text-xs text-yellow-600 dark:text-yellow-400">
                  <Percent size={12} />
                  Recargo del {RECARGO_FINANCIAMIENTO * 100}% sobre el precio base
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

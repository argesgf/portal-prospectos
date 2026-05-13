"use client";

import { usePlan } from "@/lib/context/plan-context";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  COSTO_INSTALACION_WIFI,
  COSTO_INSTALACION_NO_WIFI,
  RECARGO_FINANCIAMIENTO,
  planesPersonas,
  planesEmpresas,
} from "@/lib/mock/data";
import { Check, ChevronDown, Wifi, WifiOff, CalendarClock } from "lucide-react";
import { ShineBorder } from "@/components/ui/shine-border";

export default function PlanSummaryCard() {
  const {
    tipoUsuario,
    selectedPlan,
    tipoInstalacion,
    tipoFinanciamiento,
    setSelectedPlan,
  } = usePlan();
  const [showPlanPicker, setShowPlanPicker] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  if (!selectedPlan || !tipoUsuario) return null;

  const planesDisponibles = tipoUsuario === "persona" ? planesPersonas : planesEmpresas;
  const costoInstalacion = tipoInstalacion === "wifi" ? COSTO_INSTALACION_WIFI : COSTO_INSTALACION_NO_WIFI;
  const recargoFinanciamiento = tipoFinanciamiento === "financiamiento" ? RECARGO_FINANCIAMIENTO : 0;
  const recargoMonto = Math.round(selectedPlan.price * recargoFinanciamiento);
  const totalMensual = selectedPlan.price + recargoMonto;
  const totalAPagar = totalMensual + costoInstalacion;

  return (
    <div>
      <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">Resumen del plan</h3>
      <ShineBorder
        borderWidth={1.5}
        color={isDark ? ["#facc15", "#fbbf24", "#facc15"] : ["#1d4ed8", "#facc15", "#1d4ed8"]}
        className="bg-white dark:bg-zinc-900 border border-blue-200/60 dark:border-yellow-900/50"
      >
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Plan seleccionado</h4>
            <button
              onClick={() => setShowPlanPicker(!showPlanPicker)}
              className="flex items-center gap-1 text-xs font-medium text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 transition-colors"
            >
              Cambiar plan
              <ChevronDown size={14} className={cn("transition-transform", showPlanPicker && "rotate-180")} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-yellow-50/50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900/30">
            <div>
              <p className="font-bold text-zinc-900 dark:text-white">{selectedPlan.name}</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{selectedPlan.speed} · {tipoUsuario === "persona" ? "Hogar" : "Empresa"}</p>
            </div>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              ${selectedPlan.price.toLocaleString("es-VE")}
              <span className="text-sm font-normal">/mes</span>
            </p>
          </div>

          <AnimatePresence>
            {showPlanPicker && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="grid sm:grid-cols-3 gap-3">
                  {planesDisponibles.map((plan) => {
                    const active = plan.id === selectedPlan.id;
                    return (
                      <button
                        key={plan.id}
                        onClick={() => { setSelectedPlan(plan); setShowPlanPicker(false); }}
                        disabled={active || plan.price === 0}
                        className={cn(
                          "rounded-xl border-2 p-4 text-left transition-all duration-200",
                          active ? "border-yellow-400 bg-yellow-50 dark:bg-yellow-950/30" : "border-zinc-200 dark:border-zinc-800 hover:border-yellow-400",
                          plan.price === 0 && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-sm text-zinc-900 dark:text-white">{plan.name}</span>
                              {active && <Check size={16} className="text-yellow-600 dark:text-yellow-400" />}
                        </div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">{plan.speed}</p>
                                                  <p className="mt-2 font-bold text-yellow-600 dark:text-yellow-400">{plan.priceLabel}</p>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <hr className="border-zinc-200 dark:border-zinc-800" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              {tipoInstalacion === "wifi" ? <Wifi size={16} /> : <WifiOff size={16} />}
              Instalación {tipoInstalacion === "wifi" ? "con WiFi" : "sin WiFi"}
            </div>
            <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">${costoInstalacion.toLocaleString("es-VE")}</p>
          </div>

          {tipoFinanciamiento === "financiamiento" && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <CalendarClock size={16} />
                Recargo por financiamiento ({RECARGO_FINANCIAMIENTO * 100}%)
              </div>
              <p className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">+${recargoMonto.toLocaleString("es-VE")}/mes</p>
            </div>
          )}

          <hr className="border-zinc-200 dark:border-zinc-800" />

          <div className="flex items-center justify-between">
            <p className="font-bold text-zinc-900 dark:text-white">Total mensual</p>
            <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
              ${totalMensual.toLocaleString("es-VE")}
              <span className="text-sm font-normal">/mes</span>
            </p>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-blue-50/70 dark:bg-yellow-950/25 border border-blue-200/70 dark:border-yellow-900/40 px-4 py-3">
            <div>
              <p className="font-bold text-zinc-900 dark:text-white">Total a pagar</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Incluye instalación + primer mes</p>
            </div>
            <p className="text-xl font-bold text-blue-700 dark:text-yellow-400">
              ${totalAPagar.toLocaleString("es-VE")}
            </p>
          </div>
        </div>
      </ShineBorder>
    </div>
  );
}

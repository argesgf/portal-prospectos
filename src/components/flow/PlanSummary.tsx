"use client";

import { usePlan } from "@/lib/context/plan-context";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  COSTO_INSTALACION_WIFI,
  COSTO_INSTALACION_NO_WIFI,
  RECARGO_FINANCIAMIENTO,
  planesPersonas,
  planesEmpresas,
  type Plan,
} from "@/lib/mock/data";
import {
  Check,
  ChevronDown,
  Wifi,
  WifiOff,
  CalendarClock,
  User,
  Building2,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  FileText,
} from "lucide-react";
import InstallationToggle from "@/components/flow/InstallationToggle";
import FinancingSelector from "@/components/flow/FinancingSelector";
import { ShineBorder } from "@/components/ui/shine-border";

export default function PlanSummary() {
  const {
    tipoUsuario,
    selectedPlan,
    coverageData,
    contactData,
    tipoInstalacion,
    tipoFinanciamiento,
    setSelectedPlan,
    resetFlow,
  } = usePlan();
  const router = useRouter();
  const [showPlanPicker, setShowPlanPicker] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  if (!selectedPlan || !contactData || !tipoUsuario) {
    return null;
  }

  const planesDisponibles =
    tipoUsuario === "persona" ? planesPersonas : planesEmpresas;

  const costoInstalacion =
    tipoInstalacion === "wifi"
      ? COSTO_INSTALACION_WIFI
      : COSTO_INSTALACION_NO_WIFI;

  const recargoFinanciamiento =
    tipoFinanciamiento === "financiamiento" ? RECARGO_FINANCIAMIENTO : 0;

  const subtotalMensual = selectedPlan.price;
  const recargoMonto = Math.round(subtotalMensual * recargoFinanciamiento);
  const totalMensual = subtotalMensual + recargoMonto;
  const totalUnico = costoInstalacion;
  const granTotal = totalUnico + totalMensual;

  const handleConfirm = () => {
    setConfirmed(true);
  };

  const handleChangePlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setShowPlanPicker(false);
  };

  if (confirmed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center text-center py-12 px-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-yellow-400 text-white shadow-2xl shadow-blue-600/30 mb-6"
        >
          <CheckCircle2 size={42} />
        </motion.div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-amber-500 bg-clip-text text-transparent">
          Contratación confirmada
        </h2>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400 max-w-md">
          Tu solicitud ha sido registrada con éxito. Un asesor se comunicará
          contigo en las próximas 24 horas para coordinar la instalación.
        </p>
        <div className="mt-6 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 rounded-xl px-4 py-2">
          <ShieldCheck size={16} className="text-green-500" />
          Tus datos están protegidos y encriptados
        </div>
        <button
          onClick={() => {
            resetFlow();
            router.push("/");
          }}
          className="mt-8 px-8 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm transition-colors shadow-lg shadow-blue-700/30"
        >
          Volver al inicio
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">
          Resumen de contratación
        </h3>

        <ShineBorder
          borderWidth={1.5}
          color={["#1d4ed8", "#facc15", "#1d4ed8"]}
          className="bg-white dark:bg-zinc-900 border border-blue-200 dark:border-blue-900/40"
        >
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                Plan seleccionado
              </h4>
              <button
                onClick={() => setShowPlanPicker(!showPlanPicker)}
                className="flex items-center gap-1 text-xs font-medium text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                Cambiar plan
                <ChevronDown
                  size={14}
                  className={cn(
                    "transition-transform",
                    showPlanPicker && "rotate-180"
                  )}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30">
              <div>
                <p className="font-bold text-zinc-900 dark:text-white">
                  {selectedPlan.name}
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {selectedPlan.speed} · {tipoUsuario === "persona" ? "Hogar" : "Empresa"}
                </p>
              </div>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
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
                          onClick={() => handleChangePlan(plan)}
                          disabled={active || plan.price === 0}
                          className={cn(
                            "rounded-xl border-2 p-4 text-left transition-all duration-200",
                            active
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                              : "border-zinc-200 dark:border-zinc-800 hover:border-yellow-400",
                            plan.price === 0 && "opacity-50 cursor-not-allowed"
                          )}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-sm text-zinc-900 dark:text-white">
                              {plan.name}
                            </span>
                            {active && (
                              <Check
                                size={16}
                                className="text-blue-600 dark:text-blue-400"
                              />
                            )}
                          </div>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            {plan.speed}
                          </p>
                          <p className="mt-2 font-bold text-blue-700 dark:text-blue-400">
                            {plan.priceLabel}
                          </p>
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
                {tipoInstalacion === "wifi" ? (
                  <Wifi size={16} />
                ) : (
                  <WifiOff size={16} />
                )}
                Instalación {tipoInstalacion === "wifi" ? "con WiFi" : "sin WiFi"}
              </div>
              <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                ${costoInstalacion.toLocaleString("es-VE")}
              </p>
            </div>

            {tipoFinanciamiento === "financiamiento" && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <CalendarClock size={16} />
                  Recargo por financiamiento ({RECARGO_FINANCIAMIENTO * 100}%)
                </div>
                <p className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                  +${recargoMonto.toLocaleString("es-VE")}/mes
                </p>
              </div>
            )}

            <hr className="border-zinc-200 dark:border-zinc-800" />

            <div className="flex items-center justify-between">
              <p className="font-bold text-zinc-900 dark:text-white">Total mensual</p>
              <p className="text-xl font-bold text-blue-700 dark:text-blue-400">
                ${totalMensual.toLocaleString("es-VE")}
                <span className="text-sm font-normal">/mes</span>
              </p>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Pago único de instalación</p>
              <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                ${totalUnico.toLocaleString("es-VE")}
              </p>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-400/30">
              <p className="font-bold text-zinc-900 dark:text-white">Primer mes + instalación</p>
              <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                ${granTotal.toLocaleString("es-VE")}
              </p>
            </div>
          </div>
        </ShineBorder>
      </div>

      <InstallationToggle />

      <FinancingSelector />

      <div>
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">
          Datos de contacto
        </h3>
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-3">
          <div className="flex items-center gap-3 text-sm">
            {tipoUsuario === "persona" ? (
              <User size={16} className="text-blue-600 dark:text-blue-400 shrink-0" />
            ) : (
              <Building2 size={16} className="text-blue-600 dark:text-blue-400 shrink-0" />
            )}
            <span className="text-zinc-900 dark:text-white font-medium">
              {contactData.nombres} {contactData.apellidos}
            </span>
          </div>
          {contactData.nombreEmpresa && (
            <div className="flex items-center gap-3 text-sm">
              <Building2 size={16} className="text-blue-600 dark:text-blue-400 shrink-0" />
              <span className="text-zinc-600 dark:text-zinc-400">
                {contactData.nombreEmpresa} — {contactData.rif}
              </span>
            </div>
          )}
          <div className="flex items-center gap-3 text-sm">
            <Mail size={16} className="text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="text-zinc-600 dark:text-zinc-400">{contactData.correo}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Phone size={16} className="text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="text-zinc-600 dark:text-zinc-400">{contactData.telefono}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <MapPin size={16} className="text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="text-zinc-600 dark:text-zinc-400">
              {contactData.direccion}
            </span>
          </div>
          {contactData.cedula && (
            <div className="flex items-center gap-3 text-sm">
              <FileText size={16} className="text-blue-600 dark:text-blue-400 shrink-0" />
              <span className="text-zinc-600 dark:text-zinc-400">
                CI/RIF: {contactData.cedula}
              </span>
            </div>
          )}
          {coverageData && (
            <div className="flex items-center gap-3 text-sm">
              <ShieldCheck size={16} className="text-green-500 shrink-0" />
              <span className="text-zinc-600 dark:text-zinc-400">
                Zona {coverageData.codigoZona} · {coverageData.velocidadMaxima} máxima
              </span>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={handleConfirm}
        className={cn(
          "w-full py-4 rounded-xl text-base font-bold transition-all duration-300 flex items-center justify-center gap-2",
          "bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white dark:from-yellow-400 dark:to-amber-400 dark:hover:from-yellow-500 dark:hover:to-amber-500 dark:text-zinc-900",
          "dark:from-blue-600 dark:to-blue-500 dark:hover:from-blue-700 dark:hover:to-blue-600",
          "shadow-xl shadow-blue-700/30 hover:shadow-blue-700/50 hover:scale-[1.01]"
        )}
      >
        Confirmar contratación
        <ArrowRight size={18} />
      </button>

      <p className="text-center text-xs text-zinc-400 dark:text-zinc-600">
        Al confirmar, aceptas nuestros términos y condiciones. Sin permanencia
        forzosa.
      </p>
    </div>
  );
}

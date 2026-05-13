"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { usePlan } from "@/lib/context/plan-context";
import FlowHeader from "@/components/flow/FlowHeader";
import StepIndicator from "@/components/flow/StepIndicator";
import ContactForm from "@/components/flow/ContactForm";
import { motion } from "framer-motion";
import { User, Building2 } from "lucide-react";

const steps = [
  { label: "Plan", number: 1 },
  { label: "Cobertura", number: 2 },
  { label: "Datos", number: 3 },
  { label: "Resumen", number: 4 },
];

export default function RegistroPage() {
  const router = useRouter();
  const {
    tipoUsuario,
    selectedPlan,
    coverageData,
    contactData,
    resetFlow,
  } = usePlan();

  useEffect(() => {
    if (!tipoUsuario || !selectedPlan || !coverageData?.available) {
      router.replace("/");
    }
  }, [tipoUsuario, selectedPlan, coverageData, router]);

  const handleGoHome = useCallback(() => {
    resetFlow();
    router.push("/");
  }, [resetFlow, router]);

  const showNext = !!contactData;

  if (!tipoUsuario || !selectedPlan || !coverageData?.available) {
    return <div className="flex items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950" />;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <FlowHeader
        title={tipoUsuario === "empresa" ? "Datos empresariales" : "Datos personales"}
        subtitle={selectedPlan.name}
        backHref="/cobertura"
        onHome={handleGoHome}
      />

      <div className="pt-16">
        <div className="mx-auto max-w-2xl px-6 pt-6">
          <StepIndicator steps={steps} currentStep={3} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-4"
          >
            <div className="flex items-center gap-3 mb-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30">
              {tipoUsuario === "empresa" ? (
                <Building2 size={20} className="text-blue-600 dark:text-blue-400 shrink-0" />
              ) : (
                <User size={20} className="text-blue-600 dark:text-blue-400 shrink-0" />
              )}
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                  {tipoUsuario === "empresa"
                    ? "Registro de empresa"
                    : "Registro de persona natural"}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {tipoUsuario === "empresa"
                    ? "Necesitamos los datos del representante legal y de la empresa"
                    : "Necesitamos tus datos de contacto para continuar"}
                </p>
              </div>
            </div>

            <ContactForm />
          </motion.div>

          {showNext && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 pb-12 flex justify-center"
            >
              <button
                onClick={() => router.push("/resumen")}
                className="px-10 py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white shadow-xl shadow-blue-700/30 hover:shadow-blue-700/50 transition-all duration-300 hover:scale-[1.02]"
              >
                Continuar al resumen
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

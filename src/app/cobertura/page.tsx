"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { usePlan } from "@/lib/context/plan-context";
import FlowHeader from "@/components/flow/FlowHeader";
import StepIndicator from "@/components/flow/StepIndicator";
import { motion } from "framer-motion";

const CoverageMap = dynamic(
  () => import("@/components/flow/CoverageMap"),
  { ssr: false, loading: () => <MapLoadingSkeleton /> }
);

function MapLoadingSkeleton() {
  return (
    <div className="relative flex flex-col lg:flex-row gap-8">
      <div className="flex-1 flex flex-col gap-6">
        <div className="h-[420px] sm:h-[500px] rounded-2xl bg-blue-50 dark:bg-zinc-900 border-2 border-blue-200 dark:border-blue-900/30 animate-pulse flex items-center justify-center">
          <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">
            Cargando mapa...
          </span>
        </div>
      </div>
    </div>
  );
}

const steps = [
  { label: "Plan", number: 1 },
  { label: "Cobertura", number: 2 },
  { label: "Datos", number: 3 },
  { label: "Resumen", number: 4 },
];

export default function CoberturaPage() {
  const router = useRouter();
  const { tipoUsuario, selectedPlan, coverageData, resetFlow } = usePlan();

  useEffect(() => {
    if (!tipoUsuario || !selectedPlan) {
      router.replace("/");
    }
  }, [tipoUsuario, selectedPlan, router]);

  const handleGoHome = useCallback(() => {
    resetFlow();
    router.push("/");
  }, [resetFlow, router]);

  if (!tipoUsuario || !selectedPlan) {
    return <div className="flex items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950" />;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <FlowHeader
        title="Verificar cobertura"
        subtitle={selectedPlan.name}
        backHref="/"
        onBack={handleGoHome}
        onHome={handleGoHome}
      />

      <div className="pt-16">
        <div className="mx-auto max-w-6xl px-6 pt-6">
          <StepIndicator steps={steps} currentStep={2} />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <CoverageMap />
          </motion.div>

          {coverageData?.available && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 pb-12 flex justify-center"
            >
              <button
                onClick={() => router.push("/registro")}
                className="px-10 py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white shadow-xl shadow-blue-700/30 hover:shadow-blue-700/50 transition-all duration-300 hover:scale-[1.02]"
              >
                Continuar al registro
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { usePlan } from "@/lib/context/plan-context";
import FlowHeader from "@/components/flow/FlowHeader";
import StepIndicator from "@/components/flow/StepIndicator";
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
  { label: "Contacto", number: 1 },
  { label: "Cobertura", number: 2 },
  { label: "Plan", number: 3 },
  { label: "Datos", number: 4 },
  { label: "Dirección", number: 5 },
  { label: "Resumen", number: 6 },
];

export default function CoberturaPage() {
  const router = useRouter();
  const { tipoUsuario, selectedPlan, coverageData, contactStepData, resetFlow } = usePlan();

  useEffect(() => {
    if (!tipoUsuario || !selectedPlan || !contactStepData) {
      router.replace("/");
    }
  }, [tipoUsuario, selectedPlan, contactStepData, router]);

  const handleGoHome = useCallback(() => {
    resetFlow();
    router.push("/");
  }, [resetFlow, router]);

  if (!tipoUsuario || !selectedPlan || !contactStepData) {
    return <div className="flex items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950" />;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <FlowHeader
        title="Verificar cobertura"
        subtitle={selectedPlan.name}
        backHref="/contacto"
        onHome={handleGoHome}
      />

      <div className="pt-16">
        <div className="mx-auto max-w-6xl px-6 pt-6">
          <StepIndicator steps={steps} currentStep={2} />
          <div className="anim-fade-in-up">
            <CoverageMap />
          </div>

          {coverageData?.available && (
            <div className="anim-fade-in-up-delayed mt-8 pb-12 flex justify-center">
              <button
                onClick={() => router.push("/resumen-plan")}
                className="px-10 py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white shadow-xl shadow-blue-700/30 hover:shadow-blue-700/50 transition-all duration-300 hover:scale-[1.02] dark:from-yellow-400 dark:to-amber-400 dark:hover:from-yellow-500 dark:hover:to-amber-500 dark:text-zinc-900 dark:shadow-yellow-400/30"
              >
                Continuar al resumen del plan
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

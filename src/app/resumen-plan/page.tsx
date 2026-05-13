"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { usePlan } from "@/lib/context/plan-context";
import FlowHeader from "@/components/flow/FlowHeader";
import StepIndicator from "@/components/flow/StepIndicator";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import PlanSummaryCard from "@/components/flow/PlanSummaryCard";
import InstallationToggle from "@/components/flow/InstallationToggle";
import FinancingSelector from "@/components/flow/FinancingSelector";

const steps = [
  { label: "Contacto", number: 1 },
  { label: "Cobertura", number: 2 },
  { label: "Plan", number: 3 },
  { label: "Datos", number: 4 },
  { label: "Dirección", number: 5 },
  { label: "Resumen", number: 6 },
];

export default function ResumenPlanPage() {
  const router = useRouter();
  const { tipoUsuario, selectedPlan, coverageData, contactStepData, resetFlow } = usePlan();

  useEffect(() => {
    if (!tipoUsuario || !selectedPlan || !coverageData?.available || !contactStepData) {
      router.replace("/");
    }
  }, [tipoUsuario, selectedPlan, coverageData, contactStepData, router]);

  const handleGoHome = useCallback(() => {
    resetFlow();
    router.push("/");
  }, [resetFlow, router]);

  if (!tipoUsuario || !selectedPlan || !coverageData?.available || !contactStepData) {
    return <div className="flex items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950" />;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <FlowHeader
        title="Confirma tu plan"
        subtitle={selectedPlan.name}
        backHref="/cobertura"
        onHome={handleGoHome}
      />
      <div className="pt-16">
        <div className="mx-auto max-w-2xl px-6 pt-6 pb-16">
          <StepIndicator steps={steps} currentStep={3} />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mt-4 space-y-8"
          >
            <PlanSummaryCard />
            <InstallationToggle />
            <FinancingSelector />
            <button
              onClick={() => router.push("/datos")}
              className="w-full py-4 rounded-xl text-base font-bold transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white shadow-xl shadow-blue-700/30 hover:shadow-blue-700/50 dark:from-yellow-400 dark:to-amber-400 dark:hover:from-yellow-500 dark:hover:to-amber-500 dark:text-zinc-900 dark:shadow-yellow-400/30"
            >
              Continuar con mis datos
              <ArrowRight size={18} />
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

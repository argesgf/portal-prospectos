"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { usePlan } from "@/lib/context/plan-context";
import FlowHeader from "@/components/flow/FlowHeader";
import StepIndicator from "@/components/flow/StepIndicator";
import PlanSummary from "@/components/flow/PlanSummary";
import { motion } from "framer-motion";

const steps = [
  { label: "Plan", number: 1 },
  { label: "Cobertura", number: 2 },
  { label: "Datos", number: 3 },
  { label: "Resumen", number: 4 },
];

export default function ResumenPage() {
  const router = useRouter();
  const {
    tipoUsuario,
    selectedPlan,
    coverageData,
    contactData,
    resetFlow,
  } = usePlan();

  useEffect(() => {
    if (!tipoUsuario || !selectedPlan || !coverageData?.available || !contactData) {
      router.replace("/");
    }
  }, [tipoUsuario, selectedPlan, coverageData, contactData, router]);

  const handleGoHome = useCallback(() => {
    resetFlow();
    router.push("/");
  }, [resetFlow, router]);

  if (!tipoUsuario || !selectedPlan || !coverageData?.available || !contactData) {
    return <div className="flex items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950" />;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <FlowHeader
        title="Resumen de contratación"
        subtitle={selectedPlan.name}
        backHref="/registro"
        onHome={handleGoHome}
      />

      <div className="pt-16">
        <div className="mx-auto max-w-2xl px-6 pt-6 pb-16">
          <StepIndicator steps={steps} currentStep={4} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-4"
          >
            <PlanSummary />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

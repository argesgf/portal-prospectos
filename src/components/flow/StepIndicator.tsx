"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Step {
  label: string;
  number: number;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-1 px-4 py-4">
      {steps.map((step, i) => {
        const isCompleted = step.number < currentStep;
        const isCurrent = step.number === currentStep;
        const isLast = i === steps.length - 1;

        return (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300",
                  isCompleted &&
                    "bg-blue-600 text-white shadow-lg shadow-blue-600/30",
                  isCurrent &&
                    "bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-4 ring-blue-100 dark:ring-blue-900/40",
                  !isCompleted &&
                    !isCurrent &&
                    "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500"
                )}
              >
                {isCompleted ? <Check size={14} /> : step.number}
              </div>
              <span
                className={cn(
                  "mt-1.5 text-[10px] font-medium whitespace-nowrap transition-colors duration-300",
                  isCurrent
                    ? "text-blue-600 dark:text-blue-400"
                    : isCompleted
                      ? "text-blue-500 dark:text-blue-500"
                      : "text-zinc-400 dark:text-zinc-600"
                )}
              >
                {step.label}
              </span>
            </div>

            {!isLast && (
              <div
                className={cn(
                  "h-0.5 w-8 sm:w-12 mx-1 mt-[-18px] rounded-full transition-colors duration-300",
                  isCompleted
                    ? "bg-blue-600"
                    : "bg-zinc-200 dark:bg-zinc-800"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

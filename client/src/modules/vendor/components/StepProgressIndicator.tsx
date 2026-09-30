import React from "react";
import { CheckCircle2 } from "lucide-react";
import { LISTING_STEPS } from "./listing-form.types";

export interface StepProgressIndicatorProps {
  currentStep: number;
  onSelectStep: (stepId: number) => void;
}

export default function StepProgressIndicator({
  currentStep,
  onSelectStep,
}: StepProgressIndicatorProps) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 overflow-x-auto">
      <div className="flex items-center justify-between min-w-[700px]">
        {LISTING_STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <React.Fragment key={step.id}>
              <div
                onClick={() => {
                  if (isCompleted) onSelectStep(step.id);
                }}
                className={`flex items-center gap-3 cursor-pointer ${
                  isCurrent
                    ? "text-[#1E5BFF] font-bold"
                    : isCompleted
                    ? "text-emerald-600 font-semibold"
                    : "text-slate-400 font-medium"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs transition-all shadow-xs ${
                    isCurrent
                      ? "bg-[#1E5BFF] text-white ring-4 ring-blue-100"
                      : isCompleted
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">
                    Step {step.id}
                  </p>
                  <p className="text-xs font-semibold whitespace-nowrap">
                    {step.name}
                  </p>
                </div>
              </div>

              {idx < LISTING_STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-3 transition-colors ${
                    currentStep > step.id ? "bg-emerald-500" : "bg-slate-200"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

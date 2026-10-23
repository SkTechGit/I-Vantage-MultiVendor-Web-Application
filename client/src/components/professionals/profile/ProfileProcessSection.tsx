"use client";

import React from "react";
import { ArrowRight, CheckCircle2, ShieldCheck, FileText, Zap, Award } from "lucide-react";
import type { ProfessionalProfileItem } from "@/lib/professionals.api";

interface Props {
  professional: ProfessionalProfileItem;
}

export default function ProfileProcessSection({ professional }: Props) {
  const p = professional;
  const firstName = p.fullName ? p.fullName.split(" ")[0] : "the Professional";

  const defaultSteps = [
    {
      stepNumber: 1,
      title: "Initial Briefing & Intake",
      description:
        "Understand your exact corporate or financial requirement, discuss timelines, and review existing documentation under NDA.",
    },
    {
      stepNumber: 2,
      title: "Regulatory & Tax Assessment",
      description:
        "Conduct structured statutory analysis, identify potential tax efficiencies, compliance risks, or regulatory prerequisites.",
    },
    {
      stepNumber: 3,
      title: "Strategy Formulation & Filing",
      description:
        "Deliver customized advisory, prepare statutory filings, or represent before relevant authorities (MCA, GST, ITD, or Courts).",
    },
    {
      stepNumber: 4,
      title: "Ongoing Compliance & Review",
      description:
        "Provide proactive regulatory updates, annual compliance calendars, and ongoing strategic advisory as your business scales.",
    },
  ];

  const steps =
    Array.isArray(p.processSteps) && p.processSteps.length > 0
      ? p.processSteps
      : defaultSteps;

  return (
    <section id="process-section" className="space-y-6 pt-6 border-t border-slate-200">
      <div className="space-y-1">
        <span className="text-[11px] font-black uppercase tracking-wider text-[#1E5BFF]">
          Structured Workflow
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-[#0A1F66] tracking-tight">
          How {firstName} Works
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          A predictable, transparent engagement model engineered for complete peace of mind.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="relative rounded-2xl bg-white border border-[#DCE5F5] p-5 shadow-2xs space-y-3"
          >
            {/* Step Number Badge */}
            <div className="flex items-center justify-between">
              <span className="flex items-center justify-center w-7 h-7 rounded-xl bg-[#0A1F66] text-white text-xs font-black">
                0{step.stepNumber || idx + 1}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Step 0{step.stepNumber || idx + 1}
              </span>
            </div>

            <h3 className="text-sm font-black text-[#0A1F66] leading-snug">
              {step.title}
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

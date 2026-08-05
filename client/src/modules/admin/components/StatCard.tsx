import { ReactNode } from "react";

interface Props {
  title: string;
  value: number;
  icon: ReactNode;
}

export default function StatCard({
  title,
  value,
  icon,
}: Props) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-slate-500">
            {title}
          </p>

          <h2 className="mt-3 text-4xl font-bold text-[#0A1F66]">
            {value}
          </h2>

        </div>

        <div className="rounded-xl bg-blue-100 p-4 text-[#1E5BFF]">
          {icon}
        </div>

      </div>

    </div>
  );
}
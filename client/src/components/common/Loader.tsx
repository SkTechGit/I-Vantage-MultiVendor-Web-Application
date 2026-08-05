import Logo from "../common/Logo";

export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="animate-pulse">
        <Logo width={90} />
      </div>

      <div className="mt-6 h-1.5 w-40 overflow-hidden rounded-full bg-[#E5ECF8]">
        <div className="h-full w-1/2 animate-[loading_1.2s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-[#0A1F66] via-[#1E5BFF] to-[#C8942C]" />
      </div>

      <p className="mt-4 text-sm font-medium tracking-wide text-slate-600">
        Loading i-VANTAGE Business Hub...
      </p>
    </div>
  );
}
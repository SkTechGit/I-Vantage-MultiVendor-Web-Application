"use client";

import { Search } from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchInput({
  value,
  onChange,
}: Props) {
  return (
    <div className="relative">
      <Search
        size={20}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder="Search services..."
        className="w-full rounded-full border border-gray-300 py-4 pl-12 pr-5 outline-none transition-all focus:border-[#1E5BFF] focus:ring-4 focus:ring-blue-100"
      />
    </div>
  );
}
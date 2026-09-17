"use client";

import dynamic from "next/dynamic";

const VikiBot = dynamic(() => import("./VikiBot"), {
  ssr: false,
});

export default function VikiClientWrapper() {
  return <VikiBot />;
}

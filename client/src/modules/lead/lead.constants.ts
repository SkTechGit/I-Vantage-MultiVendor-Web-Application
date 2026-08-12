export const LEAD_STATUS = [
  "NEW",
  "CONTACTED",
  "FOLLOW_UP",
  "QUALIFIED",
  "CONVERTED",
  "WON",
  "LOST",
] as const;

export const STATUS_COLOR = {
  NEW: "bg-blue-100 text-blue-700",

  CONTACTED:
    "bg-yellow-100 text-yellow-700",

  FOLLOW_UP:
    "bg-orange-100 text-orange-700",

  QUALIFIED:
    "bg-purple-100 text-purple-700",

  CONVERTED:
    "bg-indigo-100 text-indigo-700",

  WON:
    "bg-green-100 text-green-700",

  LOST:
    "bg-red-100 text-red-700",
};
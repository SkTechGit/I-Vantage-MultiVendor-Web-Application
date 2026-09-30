import { LucideIcon, Building2, Tag, Layers, Sparkles, Camera, IndianRupee, CheckCircle2 } from "lucide-react";

export interface CategoryItem {
  _id: string;
  name: string;
  slug: string;
}

export interface AmenityItem {
  _id: string;
  name: string;
  icon?: string;
}

export interface MediaUploadItem {
  mediaId: string;
  secureUrl: string;
  order: number;
}

export type PricingUnit = "per-month" | "per-day" | "per-hour" | "per-seat";

export interface StepItem {
  id: number;
  name: string;
  icon: LucideIcon;
}

export const LISTING_STEPS: StepItem[] = [
  { id: 1, name: "Details", icon: Building2 },
  { id: 2, name: "Category", icon: Tag },
  { id: 3, name: "Services", icon: Layers },
  { id: 4, name: "Amenities", icon: Sparkles },
  { id: 5, name: "Media", icon: Camera },
  { id: 6, name: "Pricing", icon: IndianRupee },
  { id: 7, name: "Review & Submit", icon: CheckCircle2 },
];

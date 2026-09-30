export type MarketplaceLeadStatus = "new" | "contacted" | "converted" | "lost";

export interface MarketplaceLeadNote {
  authorName?: string;
  text: string;
  createdAt: string;
}

export interface MarketplaceLeadItem {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  message?: string;
  status: MarketplaceLeadStatus;
  source: string;
  spaceTitle?: string;
  spaceLocation?: string;
  listingId?: {
    _id: string;
    title: string;
    slug: string;
    location?: { area: string; city: string };
  };
  vendorId?: {
    _id: string;
    name: string;
    businessName?: string;
    email: string;
    phone?: string;
  };
  notes?: MarketplaceLeadNote[];
  createdAt: string;
}

export const STATUS_CONFIG: Record<
  MarketplaceLeadStatus,
  { label: string; badge: string; dot: string; border: string }
> = {
  new: {
    label: "New",
    badge: "bg-amber-50 text-amber-800",
    dot: "bg-amber-500",
    border: "border-amber-200",
  },
  contacted: {
    label: "Contacted",
    badge: "bg-blue-50 text-blue-800",
    dot: "bg-blue-500",
    border: "border-blue-200",
  },
  converted: {
    label: "Converted",
    badge: "bg-emerald-50 text-emerald-800",
    dot: "bg-emerald-500",
    border: "border-emerald-200",
  },
  lost: {
    label: "Lost",
    badge: "bg-rose-50 text-rose-800",
    dot: "bg-rose-500",
    border: "border-rose-200",
  },
};

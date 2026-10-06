export type Role = "super_admin" | "vendor" | "user";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  passwordHash?: string;
  role: Role;
  businessName?: string; // vendor only
  status: "active" | "suspended";
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string; // "Private Cabin" | "Meeting Room" | "Conference Room" | "Day Pass" | "Coworking Seat"
  slug: string;
  icon?: string;
  isActive: boolean;
  sortOrder: number;
}

export interface Amenity {
  id: string;
  name: string;
  icon?: string;
  isActive: boolean;
}

export interface Service {
  id: string;
  name: string;
  size: string; // free text on purpose — "size" means different things per category
  price: number;
  description?: string;
  isGlobal: boolean; // true = SuperAdmin-created, visible to all vendors
  vendorId?: string; // set only when isGlobal is false
  isActive: boolean;
  createdBy: string; // userId, for audit
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MediaAsset {
  id: string;
  cloudinaryPublicId: string;
  secureUrl: string;
  uploadedBy: string; // userId
  width: number;
  height: number;
  format: string;
  createdAt: Date;
}

export type ListingStatus =
  | "draft"
  | "pending_review"
  | "approved"
  | "rejected"
  | "deleted";

export interface ListingLocation {
  city: string;
  area: string;
  address: string;
  lat?: number;
  lng?: number;
}

export interface ListingPricing {
  basePrice: number;
  currency: string;
  unit: "per-day" | "per-hour" | "per-month" | "per-seat";
}

export interface ListingMediaItem {
  mediaId: string;
  order: number;
}

export interface Listing {
  id: string;
  vendorId: string;
  title: string;
  slug: string;
  description: string;
  categoryId: string;
  location: ListingLocation;
  pricing: ListingPricing;
  capacity?: number;
  serviceIds: string[];
  amenityIds: string[];
  customAmenities: string[];
  media: ListingMediaItem[];
  status: ListingStatus;
  isLive: boolean; // default false — SuperAdmin toggle independent of `status`
  rejectionReason?: string;
  approvedBy?: string;
  approvedAt?: Date;
  publishedAt?: Date;
  lastEditedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LeadNote {
  authorId: string;
  text: string;
  createdAt: Date;
}

export type LeadSource =
  | "listing_enquiry"
  | "contact_form"
  | "callback_request";

export type LeadStatus = "new" | "contacted" | "converted" | "lost";

export interface Lead {
  id: string;
  listingId?: string;
  vendorId?: string; // denormalized for fast vendor-scoped queries
  name: string;
  phone: string;
  email?: string;
  message?: string;
  source: LeadSource;
  status: LeadStatus;
  notes: LeadNote[];
  createdAt: Date;
  updatedAt: Date;
}

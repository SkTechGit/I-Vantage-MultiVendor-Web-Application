export interface Member {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  status: string;
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
}

export interface Invitation {
  _id: string;
  email: string;
  role: string;
  status: string;
  expiresAt: string;
  createdAt: string;
  invitedBy?: {
    fullName: string;
    email: string;
  };
}

export interface AccessRequest {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

export interface PlatformUser {
  _id: string;
  name: string;
  fullName: string;
  email: string;
  phone?: string;
  businessName?: string;
  role: string;
  portal: string;
  status: string;
  isActive: boolean;
  lastLogin: string | null;
  lastLoginIp?: string | null;
  loginCount?: number;
  createdAt: string;
  sourceCollection: "Auth" | "MarketplaceUser";
}

export interface SecurityAuditItem {
  _id: string;
  action: string;
  portal: string;
  targetEmail: string;
  targetRole?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export type TeamTab =
  | "members"
  | "vendors"
  | "audit"
  | "invite"
  | "requests"
  | "invitations";

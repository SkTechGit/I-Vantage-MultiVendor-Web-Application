export interface DashboardStats {
  totalCategories: number;
  totalServices: number;
  totalLeads: number;
  recentLeads: {
    _id: string;
    fullName: string;
    mobile: string;
    status: string;
    createdAt: string;

    services: {
      _id: string;
      name: string;
    }[];
  }[];
}
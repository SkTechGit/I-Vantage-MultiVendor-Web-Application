export interface Lead {
  _id: string;

  fullName: string;

  email: string;

  mobile: string;

  companyName: string;
  location: string;

  message: string;

  status: string;

  source: string;

  services: {
  _id: string;
  name: string;
  slug: string;

  category: {
    _id: string;
    name: string;
    slug: string;
  };
}[];

  notes: LeadNote[];

 followUps: FollowUp[];
  createdAt: string;

  updatedAt: string;
}

export interface LeadNote {
  _id?: string;

  note: string;

  createdAt: string;
}

export interface FollowUp {
  _id?: string;

  followUpDate: string;

  remark: string;

  completed: boolean;

  completedAt?: string;

  createdAt: string;
}
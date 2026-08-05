export interface CRMLead {
  _id: string;

  fullName: string;

  email: string;

  mobile: string;

  companyName: string;

  message: string;

  status: string;

  services: {
    _id: string;
    name: string;
    category: {
      _id: string;
      name: string;
    };
  }[];

  notes: {
    _id?: string;
    note: string;
    createdAt: string;
  }[];

  followUps: {
    _id?: string;
    followUpDate: string;
    remark: string;
    completed: boolean;
    completedAt?: string;
    createdAt: string;
  }[];

  createdAt: string;

  updatedAt: string;
}
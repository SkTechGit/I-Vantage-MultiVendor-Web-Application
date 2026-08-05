export interface Service {
  _id: string;

  category: {
    _id: string;
    name: string;
  };

  name: string;

  slug: string;

  shortDescription: string;

  sortOrder: number;

  isActive: boolean;

  createdAt: string;
}
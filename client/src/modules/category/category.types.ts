export interface Category {
  _id: string;

  name: string;

  slug: string;

  description: string;

  image: {
    url: string;
    publicId: string;
  };

  sortOrder: number;

  isActive: boolean;

  createdAt: string;

  updatedAt: string;
}
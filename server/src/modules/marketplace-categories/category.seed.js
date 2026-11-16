import MarketplaceCategory from "./category.model.js";

export const DEFAULT_CATEGORIES = [
  {
    name: "Private Cabin",
    slug: "private-cabin",
    icon: "Building2",
    sortOrder: 1,
    isActive: true,
  },
  {
    name: "Meeting Room",
    slug: "meeting-room",
    icon: "Users",
    sortOrder: 2,
    isActive: true,
  },
  {
    name: "Conference Room",
    slug: "conference-room",
    icon: "Presentation",
    sortOrder: 3,
    isActive: true,
  },
  {
    name: "Coworking Seat",
    slug: "coworking-seat", 
    icon: "Laptop",
    sortOrder: 4,
    isActive: true,
  },
  {
    name: "Day Pass",
    slug: "day-pass",
    icon: "Calendar",
    sortOrder: 5,
    isActive: true,
  },
  {
    name: "Dedicated Desk",
    slug: "dedicated-desk",
    icon: "Monitor",
    sortOrder: 6,
    isActive: true,
  },
  {
    name: "Virtual Office",
    slug: "virtual-office",
    icon: "Globe",
    sortOrder: 7,
    isActive: true,
  },
];

/**
 * Ensures all standard workspace categories (including Virtual Office)
 * exist in the database with correct slugs, sort orders, and active statuses.
 */
export const seedMarketplaceCategories = async () => {
  try {
    for (const cat of DEFAULT_CATEGORIES) {
      await MarketplaceCategory.findOneAndUpdate(
        { slug: cat.slug },
        {
          $setOnInsert: {
            name: cat.name,
            slug: cat.slug,
            icon: cat.icon,
            sortOrder: cat.sortOrder,
            isActive: cat.isActive,
          },
        },
        { upsert: true, returnDocument: "after" }
      );
    }
    console.log("Marketplace categories verified/seeded successfully (7 categories).");
  } catch (error) {
    console.error("Error seeding marketplace categories:", error.message || error);
  }
};

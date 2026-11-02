import { MetadataRoute } from "next";
import { getPublicBlogs } from "@/modules/blog/blog.api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://i-vantage.in";
  const internalApi = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api/v1").replace(
    "//localhost",
    "//127.0.0.1"
  );

  // Static site pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/gurugram`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/professionals`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.95,
    },
  ];

  // Dynamic published blogs, professionals & listings
  try {
    const [blogData, proData, listingData] = await Promise.all([
      getPublicBlogs({ limit: 500 }).catch(() => ({ blogs: [] })),
      fetch(`${internalApi}/professionals?limit=500`)
        .then((r) => r.json())
        .catch(() => ({ data: [] })),
      fetch(`${internalApi}/listings?limit=500`)
        .then((r) => r.json())
        .catch(() => ({ data: [] })),
    ]);

    const blogRoutes: MetadataRoute.Sitemap = (blogData.blogs || []).map((blog) => ({
      url: `${baseUrl}/blogs/${blog.slug}`,
      lastModified: blog.updatedAt ? new Date(blog.updatedAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    const proRoutes: MetadataRoute.Sitemap = ((proData?.data as any[]) || []).map((pro) => ({
      url: `${baseUrl}/professionals/${pro.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    const listingRoutes: MetadataRoute.Sitemap = (
      Array.isArray(listingData?.data) ? listingData.data : (listingData?.data?.listings || [])
    ).map((item: any) => ({
      url: `${baseUrl}/${item.location?.city || "gurugram"}/${item.category?.slug || item.categoryId?.slug || "spaces"}/${item.slug}`,
      lastModified: item.updatedAt ? new Date(item.updatedAt) : new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    }));

    return [...staticRoutes, ...listingRoutes, ...blogRoutes, ...proRoutes];
  } catch {
    return staticRoutes;
  }
}

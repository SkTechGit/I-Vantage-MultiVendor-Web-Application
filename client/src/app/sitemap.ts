import { MetadataRoute } from "next";
import { getPublicBlogs } from "@/modules/blog/blog.api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://i-vantage.in";

  // Static site pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
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

  // Dynamic published blogs and professionals
  try {
    const [blogData, proData] = await Promise.all([
      getPublicBlogs({ limit: 500 }).catch(() => ({ blogs: [] })),
      fetch(`${baseUrl}/api/v1/professionals?limit=500`).then((r) => r.json()).catch(() => ({ data: [] })),
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

    return [...staticRoutes, ...blogRoutes, ...proRoutes];
  } catch {
    return staticRoutes;
  }
}

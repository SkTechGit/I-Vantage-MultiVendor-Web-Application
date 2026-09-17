import { Metadata } from "next";
import Container from "@/components/common/Container";
import BlogHero from "@/modules/blog/components/BlogHero";
import FeaturedBlogCard from "@/modules/blog/components/FeaturedBlogCard";
import BlogGrid from "@/modules/blog/components/BlogGrid";
import BlogCTA from "@/modules/blog/components/BlogCTA";
import {
  getPublicBlogs,
  getFeaturedBlog,
  getBlogCategories,
} from "@/modules/blog/blog.api";

export const revalidate = 60; // ISR revalidate every 60 seconds

export const metadata: Metadata = {
  title: "Business Insights & Workspace Intelligence | i-VANTAGE",
  description:
    "Explore authoritative insights on virtual offices, business setup, company registration, coworking spaces, and regulatory compliance in Gurgaon and India.",
  alternates: {
    canonical: "https://i-vantage.in/blogs",
  },
  openGraph: {
    title: "Business Insights & Workspace Intelligence | i-VANTAGE",
    description:
      "Explore authoritative insights on virtual offices, business setup, company registration, coworking spaces, and regulatory compliance in Gurgaon and India.",
    url: "https://i-vantage.in/blogs",
    siteName: "i-VANTAGE Business Hub",
    locale: "en_US",
    type: "website",
  },
};

export default async function BlogsPage() {
  // Fetch initial data concurrently on server
  const [blogsData, featuredBlog, categories] = await Promise.all([
    getPublicBlogs({ page: 1, limit: 9 }).catch(() => ({
      blogs: [],
      total: 0,
      page: 1,
      totalPages: 1,
    })),
    getFeaturedBlog().catch(() => null),
    getBlogCategories().catch(() => []),
  ]);

  return (
    <div className="bg-slate-50/50 pb-20">
      {/* Editorial Hero */}
      <BlogHero />

      <Container className="mt-12 space-y-16">
        {/* Featured Article Section */}
        {featuredBlog && (
          <section aria-label="Featured Article">
            <FeaturedBlogCard blog={featuredBlog} />
          </section>
        )}

        {/* Dynamic Blog Grid & Interactive Search */}
        <section aria-label="Latest Insights">
          <BlogGrid
            initialBlogs={blogsData.blogs}
            initialTotal={blogsData.total}
            initialPage={blogsData.page}
            initialTotalPages={blogsData.totalPages}
            categories={categories}
          />
        </section>

        {/* Conversion CTA Block */}
        <BlogCTA />
      </Container>
    </div>
  );
}

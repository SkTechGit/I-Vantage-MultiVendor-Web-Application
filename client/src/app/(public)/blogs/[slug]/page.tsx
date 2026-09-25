import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Container from "@/components/common/Container";
import ArticleHeader from "@/modules/blog/components/ArticleHeader";
import ArticleBody from "@/modules/blog/components/ArticleBody";
import ArticleShare from "@/modules/blog/components/ArticleShare";
import TableOfContents from "@/modules/blog/components/TableOfContents";
import ReadingProgress from "@/modules/blog/components/ReadingProgress";
import RelatedBlogs from "@/modules/blog/components/RelatedBlogs";
import BlogCTA from "@/modules/blog/components/BlogCTA";
import BlogViewTracker from "@/modules/blog/components/BlogViewTracker";
import {
  getPublicBlogBySlug,
  getRelatedBlogs,
} from "@/modules/blog/blog.api";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const data = await getPublicBlogBySlug(slug);
    const blog = data.blog;

    return {
      title: `${blog.seoTitle || blog.title} | i-VANTAGE`,
      description: blog.seoDescription || blog.excerpt,
      alternates: {
        canonical: blog.canonicalUrl || `https://i-vantage.in/blogs/${blog.slug}`,
      },
      openGraph: {
        title: blog.ogTitle || blog.title,
        description: blog.ogDescription || blog.excerpt,
        url: `https://i-vantage.in/blogs/${blog.slug}`,
        type: "article",
        publishedTime: blog.publishedAt || undefined,
        modifiedTime: blog.updatedAt || undefined,
        authors: [blog.author?.fullName || "i-VANTAGE Editorial"],
        images: [
          {
            url: blog.ogImage?.url || blog.coverImage.url,
            alt: blog.coverImage.alt || blog.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: blog.ogTitle || blog.title,
        description: blog.ogDescription || blog.excerpt,
        images: [blog.ogImage?.url || blog.coverImage.url],
      },
    };
  } catch {
    return {
      title: "Article Not Found | i-VANTAGE",
    };
  }
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;

  let blogData;
  try {
    blogData = await getPublicBlogBySlug(slug);
  } catch {
    notFound();
  }

  if (blogData.redirected && blogData.newSlug) {
    redirect(`/blogs/${blogData.newSlug}`);
  }

  const blog = blogData.blog;

  // Fetch related articles
  const relatedBlogs = await getRelatedBlogs(
    blog._id,
    blog.category?._id,
    blog.tags
  ).catch(() => []);

  // JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.excerpt,
    image: [blog.coverImage.url],
    datePublished: blog.publishedAt,
    dateModified: blog.updatedAt,
    author: {
      "@type": "Person",
      name: blog.author?.fullName || "i-VANTAGE Editorial Team",
    },
    publisher: {
      "@type": "Organization",
      name: "i-VANTAGE Business Hub",
      logo: {
        "@type": "ImageObject",
        url: "https://i-vantage.in/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://i-vantage.in/blogs/${blog.slug}`,
    },
  };

  return (
    <>
      {/* JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Reading Progress Indicator */}
      <ReadingProgress />

      {/* Genuine Client-Side View Tracker */}
      <BlogViewTracker slug={blog.slug} />

      <article className="bg-white pb-20 pt-8 sm:pt-12">
        <Container>
          {/* Header Section */}
          <div className="mx-auto max-w-4xl">
            <ArticleHeader blog={blog} />
          </div>

          {/* Main Layout: Editorial Content + Sticky TOC */}
          <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Left/Center Reading Column */}
            <div className="lg:col-span-8">
              <ArticleBody content={blog.content} />

              {/* Tags Section */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Tags:
                  </span>
                  {blog.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Social Share Box */}
              <div className="mt-8">
                <ArticleShare title={blog.title} slug={blog.slug} />
              </div>

              {/* Inline Conversion CTA */}
              <div className="mt-14">
                <BlogCTA />
              </div>
            </div>

            {/* Right Aside: Sticky Table of Contents on Desktop */}
            <div className="hidden lg:col-span-4 lg:block">
              <TableOfContents content={blog.content} />
            </div>
          </div>

          {/* Continue Reading / Related Intelligence */}
          {relatedBlogs.length > 0 && (
            <div className="mt-20 border-t border-slate-200 pt-16">
              <RelatedBlogs blogs={relatedBlogs} />
            </div>
          )}
        </Container>
      </article>
    </>
  );
}

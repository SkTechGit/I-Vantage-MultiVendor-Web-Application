import BlogManagement from "@/modules/admin/components/blog/BlogManagement";

export const metadata = {
  title: "My Articles & Blogs | Professional Portal",
  description: "Create, edit, and publish verified articles and guides for the i-VANTAGE network.",
};

export default function ProfessionalBlogsPage() {
  return (
    <BlogManagement
      basePath="/dashboard/professional/blogs"
      portalTitle="My Articles & Insights"
      portalSubtitle="Write, publish, and manage thought leadership insights and regulatory guides for your public profile."
    />
  );
}

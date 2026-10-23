import AdminBlogPreview from "@/modules/admin/components/blog/AdminBlogPreview";

export const metadata = {
  title: "Article Preview | Professional Portal",
  description: "Live preview of your article as it appears to readers on the i-VANTAGE platform.",
};

export default function ProfessionalPreviewBlogPage() {
  return <AdminBlogPreview basePath="/dashboard/professional/blogs" />;
}

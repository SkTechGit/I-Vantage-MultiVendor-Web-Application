import EditBlogContainer from "@/modules/admin/components/blog/EditBlogContainer";

export const metadata = {
  title: "Edit Article | Professional Portal",
  description: "Update and manage your article content, SEO, and publication status.",
};

export default function ProfessionalEditBlogPage() {
  return <EditBlogContainer basePath="/dashboard/professional/blogs" />;
}

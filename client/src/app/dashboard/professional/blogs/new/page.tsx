import NewBlogContainer from "@/modules/admin/components/blog/NewBlogContainer";

export const metadata = {
  title: "Write New Article | Professional Portal",
  description: "Draft and publish a new thought leadership article or guide.",
};

export default function ProfessionalNewBlogPage() {
  return <NewBlogContainer basePath="/dashboard/professional/blogs" />;
}

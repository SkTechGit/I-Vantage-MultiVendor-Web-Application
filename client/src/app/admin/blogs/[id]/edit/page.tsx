import EditBlogContainer from "@/modules/admin/components/blog/EditBlogContainer";

export const metadata = {
  title: "Edit Blog Article | i-VANTAGE Admin",
  description: "Edit and update blog content.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <EditBlogContainer />;
}

import AdminBlogPreview from "@/modules/admin/components/blog/AdminBlogPreview";

export const metadata = {
  title: "Preview Blog Article | i-VANTAGE Admin",
  description: "Preview exact public article rendering.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <AdminBlogPreview />;
}

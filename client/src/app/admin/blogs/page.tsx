import BlogManagement from "@/modules/admin/components/blog/BlogManagement";

export const metadata = {
  title: "Blog Management | i-VANTAGE Admin",
  description: "Manage, publish, and schedule blog articles.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <BlogManagement />;
}

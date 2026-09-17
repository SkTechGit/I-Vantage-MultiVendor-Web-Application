import NewBlogContainer from "@/modules/admin/components/blog/NewBlogContainer";

export const metadata = {
  title: "Create New Blog | i-VANTAGE Admin",
  description: "Write and publish a new business article or insight.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <NewBlogContainer />;
}

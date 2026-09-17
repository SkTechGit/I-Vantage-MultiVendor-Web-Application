import MediaLibrary from "@/modules/admin/components/blog/MediaLibrary";

export const metadata = {
  title: "Media Asset Library | i-VANTAGE Admin",
  description: "Upload and manage high-resolution images on Cloudinary.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <MediaLibrary />;
}

import { Blog } from "../blog.types";
import BlogCard from "./BlogCard";

interface Props {
  blogs: Blog[];
}

export default function RelatedBlogs({ blogs }: Props) {
  if (!blogs || blogs.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#C8942C]">
            Recommended Intelligence
          </span>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#0A1F66] sm:text-3xl">
            Continue Reading
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-8">
        {blogs.slice(0, 3).map((blog) => (
          <BlogCard key={blog._id} blog={blog} />
        ))}
      </div>
    </section>
  );
}

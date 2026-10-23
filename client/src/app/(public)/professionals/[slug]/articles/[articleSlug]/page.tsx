import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/common/Container";
import { professionalsApi } from "@/lib/professionals.api";
import {
  ChevronRight,
  Clock,
  Calendar,
  Eye,
  ShieldCheck,
  User,
  ArrowLeft,
  CalendarCheck,
  Building,
} from "lucide-react";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string; articleSlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, articleSlug } = await params;
  try {
    const data = await professionalsApi.getArticleBySlug(slug, articleSlug);
    if (!data?.article) return { title: "Article Not Found | i-VANTAGE" };
    return {
      title: `${data.article.title} - by ${data.professional.fullName} | i-VANTAGE`,
      description: data.article.excerpt || `${data.article.title} authored by verified professional ${data.professional.fullName}.`,
    };
  } catch {
    return { title: "Article | i-VANTAGE" };
  }
}

export default async function ProfessionalArticleDetailPage({ params }: Props) {
  const { slug, articleSlug } = await params;

  let professional: any = null;
  let article: any = null;

  try {
    const res = await professionalsApi.getArticleBySlug(slug, articleSlug);
    if (res) {
      professional = res.professional;
      article = res.article;
    }
  } catch (err) {
    console.error("Failed to load article details:", err);
  }

  if (!professional || !article) {
    notFound();
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-24">
      {/* Header */}
      <section className="bg-white border-b border-slate-200/80 pt-8 pb-10">
        <Container>
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <li>
                <Link href="/" className="hover:text-[#1E5BFF] transition-colors">
                  Home
                </Link>
              </li>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <li>
                <Link href="/professionals" className="hover:text-[#1E5BFF] transition-colors">
                  Professionals
                </Link>
              </li>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <li>
                <Link
                  href={`/professionals/${slug}`}
                  className="hover:text-[#1E5BFF] transition-colors truncate max-w-[150px]"
                >
                  {professional.fullName}
                </Link>
              </li>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <li>
                <Link
                  href={`/professionals/${slug}/articles`}
                  className="hover:text-[#1E5BFF] transition-colors"
                >
                  Articles
                </Link>
              </li>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <li className="text-[#0A1F66] font-bold truncate max-w-[180px]">
                {article.title}
              </li>
            </ol>
          </nav>

          {/* Article Title & Metadata */}
          <div className="max-w-4xl space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
              {article.publishedAt && (
                <div className="flex items-center gap-1 font-semibold">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {new Date(article.publishedAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              )}
              {article.readingTimeMinutes && (
                <div className="flex items-center gap-1 font-semibold">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{article.readingTimeMinutes} min read</span>
                </div>
              )}
              {article.viewsCount > 0 && (
                <div className="flex items-center gap-1 font-semibold text-slate-400">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{article.viewsCount} views</span>
                </div>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0A1F66] tracking-tight leading-tight">
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                {article.excerpt}
              </p>
            )}

            {/* Author Byline */}
            <div className="pt-2 flex items-center justify-between gap-4 border-t border-slate-100">
              <Link
                href={`/professionals/${slug}`}
                className="group flex items-center gap-3"
              >
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
                  {professional.photoUrl ? (
                    <Image
                      src={professional.photoUrl}
                      alt={professional.fullName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#0A1F66] text-white font-bold text-sm">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-[#0A1F66] group-hover:text-[#1E5BFF] transition-colors">
                      {professional.fullName}
                    </span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {professional.headline}
                  </span>
                </div>
              </Link>

              <Link
                href={`/professionals/${slug}#consultation-section`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0A1F66] text-white text-xs font-bold hover:bg-[#1E5BFF] transition-colors cursor-pointer"
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Book Consultation</span>
                <span className="sm:hidden">Consult</span>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Main Content Area */}
      <Container className="mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Article Body (Span 8) */}
          <article className="lg:col-span-8 rounded-3xl bg-white border border-[#DCE5F5] p-6 sm:p-10 shadow-2xs space-y-6">
            {article.coverImageUrl && (
              <div className="relative aspect-video rounded-2xl overflow-hidden mb-6">
                <Image
                  src={article.coverImageUrl}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line space-y-4">
              {article.contentMd || article.contentHtml}
            </div>

            {Array.isArray(article.tags) && article.tags.length > 0 && (
              <div className="pt-6 border-t border-slate-100 flex flex-wrap gap-2">
                {article.tags.map((tag: string, i: number) => (
                  <span
                    key={i}
                    className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </article>

          {/* Right Sidebar: Author Card & Booking CTA (Span 4) */}
          <aside className="lg:col-span-4 sticky top-24 space-y-6">
            <div className="rounded-3xl bg-white border border-[#DCE5F5] p-6 shadow-2xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                  {professional.photoUrl ? (
                    <Image
                      src={professional.photoUrl}
                      alt={professional.fullName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#0A1F66] text-white font-bold text-lg">
                      <User className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#1E5BFF]">
                    Authored by
                  </span>
                  <h3 className="text-base font-black text-[#0A1F66] truncate">
                    {professional.fullName}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium truncate">
                    {professional.city}, India
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Need tailored advice or assistance on this regulatory matter? Schedule a direct consultation with {professional.fullName}.
              </p>

              <div className="space-y-2 pt-1">
                <Link
                  href={`/professionals/${slug}#consultation-section`}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#0A1F66] text-white text-xs font-bold hover:bg-[#1E5BFF] transition-colors shadow-2xs"
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>Book Consultation</span>
                </Link>

                <Link
                  href={`/professionals/${slug}`}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors"
                >
                  <span>View Full Profile</span>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
}

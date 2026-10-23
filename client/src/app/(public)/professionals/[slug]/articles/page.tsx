import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/common/Container";
import { professionalsApi } from "@/lib/professionals.api";
import {
  ChevronRight,
  BookOpen,
  Clock,
  Calendar,
  ArrowRight,
  ArrowLeft,
  User,
  ShieldCheck,
} from "lucide-react";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const data = await professionalsApi.getArticles(slug);
    if (!data?.professional) return { title: "Articles Not Found | i-VANTAGE" };
    return {
      title: `Articles & Legal Insights by ${data.professional.fullName} | i-VANTAGE`,
      description: `Read statutory analyses, corporate compliance guides, and tax strategies authored by ${data.professional.fullName}.`,
    };
  } catch {
    return { title: "Articles | i-VANTAGE Professionals" };
  }
}

export default async function ProfessionalArticlesPage({ params }: Props) {
  const { slug } = await params;

  let professional: any = null;
  let articles: any[] = [];

  try {
    const res = await professionalsApi.getArticles(slug);
    if (res) {
      professional = res.professional;
      articles = res.articles || [];
    }
  } catch (err) {
    console.error("Failed to load professional articles:", err);
  }

  if (!professional) {
    notFound();
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-24">
      {/* Header */}
      <section className="bg-white border-b border-slate-200/80 pt-8 pb-10">
        <Container>
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-4">
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
              <li className="text-[#0A1F66] font-bold">Articles</li>
            </ol>
          </nav>

          {/* Author Mini Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 shadow-2xs">
                {professional.photoUrl ? (
                  <Image
                    src={professional.photoUrl}
                    alt={professional.fullName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#0A1F66] text-white font-bold text-xl">
                    <User className="w-6 h-6" />
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#1E5BFF]">
                  Author Profile
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-[#0A1F66]">
                  {professional.fullName}
                </h1>
                <p className="text-xs text-slate-500 font-medium truncate">
                  {professional.headline}
                </p>
              </div>
            </div>

            <Link
              href={`/professionals/${slug}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors self-start sm:self-auto cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Full Profile</span>
            </Link>
          </div>
        </Container>
      </section>

      {/* Main Content */}
      <Container className="mt-10">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#1E5BFF]" />
              <h2 className="text-lg font-black text-[#0A1F66]">
                Published Articles &amp; Analysis ({articles.length})
              </h2>
            </div>
          </div>

          {articles.length > 0 ? (
            <div className="space-y-4">
              {articles.map((art) => (
                <Link
                  key={art.slug}
                  href={`/professionals/${slug}/articles/${art.slug}`}
                  className="group block rounded-2xl bg-white border border-[#DCE5F5] p-6 shadow-2xs hover:shadow-md hover:border-blue-200 transition-all duration-200"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      {art.publishedAt && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{new Date(art.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                        </div>
                      )}
                      {art.readingTimeMinutes && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{art.readingTimeMinutes} min read</span>
                        </div>
                      )}
                    </div>

                    <h3 className="text-lg font-black text-[#0A1F66] group-hover:text-[#1E5BFF] transition-colors leading-snug">
                      {art.title}
                    </h3>

                    {art.excerpt && (
                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                        {art.excerpt}
                      </p>
                    )}

                    {Array.isArray(art.tags) && art.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {art.tags.map((tag: string, i: number) => (
                          <span
                            key={i}
                            className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#1E5BFF]">
                      <span>Read Full Analysis</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-4 rounded-3xl bg-white border border-slate-200/80">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-700">No articles published yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                {professional.fullName} has not published standalone articles yet. You can still consult directly.
              </p>
              <Link
                href={`/professionals/${slug}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0A1F66] text-white text-xs font-bold hover:bg-[#1E5BFF]"
              >
                <span>View Full Profile</span>
              </Link>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | undefined>>;
}

export default async function CategoryProfessionalsRedirectPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sParams = searchParams ? await searchParams : {};

  const query = new URLSearchParams();
  Object.entries(sParams).forEach(([k, v]) => {
    if (v) query.set(k, v);
  });

  const queryString = query.toString();
  redirect(`/professionals/${slug}${queryString ? `?${queryString}` : ""}`);
}

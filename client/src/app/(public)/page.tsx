import HomePage from "@/modules/home/components/HomePage";
import { getPublicCategories } from "@/modules/category/category.api";

export const revalidate = 300;

export default async function Page() {
  const categories = await getPublicCategories();

  return <HomePage categories={categories} />;
}
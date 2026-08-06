import HomePage from "@/modules/home/components/HomePage";
import { getPublicCategories } from "@/modules/category/category.api";
import { getPublicServices } from "@/modules/service/service.api";

export const revalidate = 300;
export default async function Page() {
  const categories = await getPublicCategories();
  const services = await getPublicServices();

  return (
    <HomePage
      categories={categories}
      services={services}
    />
  );
}
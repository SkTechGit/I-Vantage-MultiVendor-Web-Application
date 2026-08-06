import { Category } from "../category/category.types";
import { Service } from "../service/service.types";

export interface HomePageProps {
  categories: Category[];
  services: Service[];
}
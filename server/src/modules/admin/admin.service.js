import Category from "../category/category.model.js";
import Service  from "../services/service.model.js";
import Lead from "../leads/lead.model.js";


export const getDashboardStats = async () => {
  const [
    totalCategories,
    totalServices,
    totalLeads,
    recentLeads,
  ] = await Promise.all([
    Category.countDocuments(),
    Service.countDocuments(),
    Lead.countDocuments(),
    

    Lead.find()
      .populate("services", "name")
      .sort({ createdAt: -1 })
      .limit(5),
  ]);

  return {
    totalCategories,
    totalServices,
    totalLeads,
    recentLeads,
  };
};
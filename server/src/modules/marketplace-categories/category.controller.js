import MarketplaceCategory from "./category.model.js";
import slugify from "slugify";

export const getMarketplaceCategories = async (req, res, next) => {
  try {
    const categories = await MarketplaceCategory.find({ isActive: true }).sort("sortOrder name");
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllMarketplaceCategoriesAdmin = async (req, res, next) => {
  try {
    const categories = await MarketplaceCategory.find().sort("sortOrder name");
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

export const createMarketplaceCategory = async (req, res, next) => {
  try {
    const { name, icon, sortOrder } = req.body;
    const slug = slugify(name, { lower: true, strict: true });
    const category = await MarketplaceCategory.create({ name, slug, icon, sortOrder });
    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMarketplaceCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.body.name) {
      req.body.slug = slugify(req.body.name, { lower: true, strict: true });
    }
    const category = await MarketplaceCategory.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMarketplaceCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    await MarketplaceCategory.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Category deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

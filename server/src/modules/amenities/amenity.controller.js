import Amenity from "./amenity.model.js";

export const getAmenities = async (req, res, next) => {
  try {
    const amenities = await Amenity.find({ isActive: true }).sort("name");
    res.status(200).json({
      success: true,
      data: amenities,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllAmenitiesAdmin = async (req, res, next) => {
  try {
    const amenities = await Amenity.find().sort("-createdAt");
    res.status(200).json({
      success: true,
      data: amenities,
    });
  } catch (error) {
    next(error);
  }
};

export const createAmenity = async (req, res, next) => {
  try {
    const { name, icon } = req.body;
    const amenity = await Amenity.create({ name, icon });
    res.status(201).json({
      success: true,
      data: amenity,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAmenity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const amenity = await Amenity.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({
      success: true,
      data: amenity,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAmenity = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Amenity.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Amenity deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

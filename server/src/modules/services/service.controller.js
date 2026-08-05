import asyncHandler from "../../utils/asyncHandler.js";
import * as serviceService from "./service.service.js";
import { SERVICE_MESSAGES } from "./service.constants.js";
import {
  createServiceSchema,
  updateServiceSchema,
} from "./service.schema.js";
import { searchServices as searchServicesService } from "./service.service.js";
import { getServicesByCategory as getServicesByCategoryService } from "./service.service.js";

export const createService = asyncHandler(async (req, res) => {
  const validatedData = createServiceSchema.parse(req.body);

const service = await serviceService.createService(validatedData);
  res.status(201).json({
    success: true,
    message: SERVICE_MESSAGES.CREATED,
    data: service,
  });
});

export const getAllServices = asyncHandler(async (req, res) => {
  const services = await serviceService.getAllServices();

  res.status(200).json({
    success: true,
    message: SERVICE_MESSAGES.FETCHED,
    data: services,
  });
});

export const searchServices = asyncHandler(async (req, res) => {
  const { q = "" } = req.query;

  const services = await searchServicesService(q);

  res.status(200).json({
    success: true,
    data: services,
  });
});

export const getServicesByCategory = asyncHandler(async (req, res) => {
  const services = await getServicesByCategoryService(
    req.params.slug
  );

  res.status(200).json({
    success: true,
    data: services,
  });
});

export const getServiceById = asyncHandler(async (req, res) => {
  const service = await serviceService.getServiceById(req.params.id);

  res.status(200).json({
    success: true,
    message: SERVICE_MESSAGES.FETCHED_ONE,
    data: service,
  });
});

export const updateService = asyncHandler(async (req, res) => {
  const validatedData = updateServiceSchema.parse(req.body);

const service = await serviceService.updateService(
  req.params.id,
  validatedData
);

  res.status(200).json({
    success: true,
    message: SERVICE_MESSAGES.UPDATED,
    data: service,
  });
});

export const deleteService = asyncHandler(async (req, res) => {
  await serviceService.deleteService(req.params.id);

  res.status(200).json({
    success: true,
    message: SERVICE_MESSAGES.DELETED,
  });
});
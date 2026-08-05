import axiosInstance from "@/lib/axios";

import { CRMLead } from "./crm.types";

export const getCRMLeads = async (): Promise<CRMLead[]> => {
  const { data } = await axiosInstance.get("/crm");

  return data.data;
};

export const getCRMLead = async (
  id: string
): Promise<CRMLead> => {
  const { data } = await axiosInstance.get(
    `/crm/${id}`
  );

  return data.data;
};

export const updateCRMLead = async (
  id: string,
  payload: Partial<CRMLead>
) => {
  const { data } = await axiosInstance.patch(
    `/crm/${id}`,
    payload
  );

  return data.data;
};
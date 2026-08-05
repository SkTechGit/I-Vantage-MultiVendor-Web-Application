import axiosInstance from "@/lib/axios";
import { Lead } from "./lead.types";
export const createLead = async (payload: unknown) => {
  const { data } = await axiosInstance.post(
    "/leads",
    payload
  );

  return data;
};

export const getLeads = async (): Promise<Lead[]> => {
  const { data } = await axiosInstance.get("/leads");

  return data.data;
};

export const getLeadById = async (
  id: string
): Promise<Lead> => {
  const { data } = await axiosInstance.get(
    `/leads/${id}`
  );

  return data.data;
};

export const updateLead = async (
  id: string,
  payload: Partial<Lead>
) => {
  const { data } = await axiosInstance.patch(
    `/leads/${id}`,
    payload
  );

  return data.data;
};

export const updateLeadStatus = async (
  id: string,
  status: string
) => {
  const { data } = await axiosInstance.patch(
    `/leads/${id}/status`,
    { status }
  );

  return data.data;
};

export const addLeadNote = async (
  id: string,
  note: string
) => {
  const { data } = await axiosInstance.post(
    `/leads/${id}/notes`,
    { note }
  );

  return data.data;
};

export const addFollowUp = async (
  id: string,
  followUpDate: string,
  remark: string
) => {
  const { data } = await axiosInstance.post(
    `/leads/${id}/follow-ups`,
    {
      followUpDate,
      remark,
    }
  );

  return data.data;
};

export const completeFollowUp = async (
  leadId: string,
  followUpId: string
) => {
  const { data } = await axiosInstance.patch(
    `/leads/${leadId}/follow-ups/${followUpId}`
  );

  return data.data;
};

export const deleteLead = async (id: string) => {
  const { data } = await axiosInstance.delete(
    `/leads/${id}`
  );

  return data.data;
};
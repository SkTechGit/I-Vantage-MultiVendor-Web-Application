import axiosInstance from "@/lib/axios";

export const getPublicServices = async () => {
  try {
    const { data } = await axiosInstance.get("/services");
    return Array.isArray(data?.data) ? data.data : [];
  } catch (err: any) {
    console.warn("Notice: Services endpoint temporarily unavailable:", err?.message || err);
    return [];
  }
};



export const searchServices = async (query: string) => {
  const { data } = await axiosInstance.get(
    `/services/search?q=${query}`
  );

  return data.data;
};

export const getServices = async () => {
  const { data } = await axiosInstance.get(
    "/services"
  );

  return data.data;
};
export const createService = async (payload: unknown) => {
  const { data } = await axiosInstance.post(
    "/services",
    payload
  );

  return data;
};

export const updateService = async (
  id: string,
  payload: unknown
) => {
  const { data } = await axiosInstance.patch(
    `/services/${id}`,
    payload
  );

  return data;
};

export const deleteService = async (id: string) => {
  const { data } = await axiosInstance.delete(
    `/services/${id}`
  );

  return data;
};

export const getServiceById = async (
  id: string
) => {
  const { data } = await axiosInstance.get(
    `/services/${id}`
  );

  return data.data;
};
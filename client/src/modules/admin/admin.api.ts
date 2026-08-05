import axiosInstance from "@/lib/axios";

export const getDashboard = async () => {
  const { data } = await axiosInstance.get(
    "/admin/dashboard"
  );

  return data.data;
};
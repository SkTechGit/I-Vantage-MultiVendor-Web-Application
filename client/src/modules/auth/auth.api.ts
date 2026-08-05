import axiosInstance from "@/lib/axios";

export const login = async (payload: unknown) => {
  const { data } = await axiosInstance.post(
    "/auth/login",
    payload,
    {
      withCredentials: true,
    }
  );

  return data;
};

export const getCurrentUser = async () => {
  const { data } = await axiosInstance.get(
    "/auth/me",
    {
      withCredentials: true,
    }
  );

  return data;
};

export const logout = async () => {
  const { data } = await axiosInstance.post(
    "/auth/logout",
    {},
    {
      withCredentials: true,
    }
  );

  return data;
};
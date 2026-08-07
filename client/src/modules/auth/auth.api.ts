import axiosInstance from "@/lib/axios";

export const login = async (payload: unknown) => {
  const { data } = await axiosInstance.post(
    "/auth/login",
    payload,
    {
      withCredentials: true,
    }
  );
 console.log("login data", data);
  return data;
};

export const getCurrentUser = async () => {
  const { data } = await axiosInstance.get(
    "/auth/me",
    {
      withCredentials: true,
    }
  );
console.log("getCurrentUser data", data);
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
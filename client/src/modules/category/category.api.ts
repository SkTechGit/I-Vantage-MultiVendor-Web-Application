import axiosInstance from "@/lib/axios";

export const getPublicCategories = async () => {
  const { data } = await axiosInstance.get("/categories/public");

  return data.data;
};

export const getCategories = async () => {
  const { data } = await axiosInstance.get("/categories");

  return data.data;
};

export const createCategory = async (payload: FormData) => {
  const { data } = await axiosInstance.post(
    "/categories",
    payload,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        
      },
    }
  );

  return data;
};

export const updateCategory = async (
  id: string,
  payload: FormData
) => {
  const { data } = await axiosInstance.patch(
    `/categories/${id}`,
    payload,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};

export const deleteCategory = async (id: string) => {
  const { data } = await axiosInstance.delete(
    `/categories/${id}`
  );

  return data;
};
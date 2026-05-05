import { toast } from "react-toastify";
import axiosInstance from "./axiosintercepter";

export const createUser = async (data: any): Promise<any | null> => {
  try {
    const response = await axiosInstance.post(`/users`, data);
    toast.success(response.data.message);
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};
export const getUsers = async (params: {
  searchQuery?: string;
  limit?: number;
  page?: number;
  type?: string;
  user?:string;
}): Promise<any | null> => {
  try {
    const response = await axiosInstance.get(`/users/list`, {
      params,
    });
    return response.data;
  } catch (error) {
    return null;
  }
};
export const getUserById = async (id: string): Promise<any | null> => {
  try {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    return null;
  }
};
export const updateUser = async (
  id: string,
  data: any
): Promise<any | null> => {
  try {
    const response = await axiosInstance.put(`/users/${id}`, data);
    toast.success(response.data.message);
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};
export const deleteUser = async (id: string): Promise<any | null> => {
  try {
    const response = await axiosInstance.delete(`/users/${id}`);
    toast.success(response.data.message);
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};
export const getUserByStudent = async (id: string): Promise<any | null> => {
  try {
    const response = await axiosInstance.get(`/users/student/${id}`);
    return response.data;
  } catch (error) {
    return null;
  }
};
export const getCounsellors = async (params: {
  counsellorType?: string;
  counsellor?: string;
}): Promise<any | null> => {
  try {
    const response = await axiosInstance.get(`/users/counsellors`, {
      params,
    });
    return response.data;
  } catch (error) {
    return null;
  }
};

export const upload = async (file: File): Promise<any | null> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axiosInstance.post(`/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error: any) {
    const errorMsg =
      error.response?.data?.message || "An error occurred during file upload";
    toast.error(errorMsg);
    return null;
  }
};
export const getUser = async (): Promise<any | null> => {
  try {
    const response = await axiosInstance.get(`/users`);
    return response.data;
  } catch (error) {
    return null;
  }
};

export const importUsersCSV = async (file: File): Promise<any | null> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axiosInstance.post(`/users/import-users-csv`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    toast.success(response.data.message);
    return response.data;
  } catch (error: any) {
    const errorMsg =
      error.response?.data?.message || "An error occurred during CSV upload";
    toast.error(errorMsg);
    throw error;
  }
};

export const exportUsersCSV = async (): Promise<void> => {
  try {
    const response = await axiosInstance.get(`/users/export-users-csv`, {
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "student.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("successfully exported");
  } catch (error: any) {
    toast.error("Failed to export users");
    throw error;
  }
};

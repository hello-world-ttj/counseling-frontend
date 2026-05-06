import { toast } from "react-toastify";
import axiosInstance from "./axiosintercepter";

function normalizeAxiosError(
  error: any,
  fallbackMessage = "Something went wrong. Please try again."
): { message: string } {
  const payload = error?.response?.data;
  if (
    payload &&
    typeof payload.message === "string" &&
    payload.message.trim()
  ) {
    return { message: payload.message.trim() };
  }
  if (typeof payload === "string" && payload.trim()) {
    return { message: payload.trim() };
  }
  if (
    error?.code === "ERR_NETWORK" ||
    error?.message === "Network Error"
  ) {
    return {
      message:
        "Network error. Please check your connection and try again.",
    };
  }
  return { message: fallbackMessage };
}

export const resetPassword = async (data: any): Promise<any | null> => {
  try {
    const response = await axiosInstance.post(`/auth/reset-password`, data);
    toast.success(response.data.message);
    return response.data;
  } catch (error: any) {
    throw normalizeAxiosError(
      error,
      "Unable to update password. Please try again."
    );
  }
};
export const login = async (data: any): Promise<any | null> => {
  try {
    const response = await axiosInstance.post(`/auth/login`, data);
    toast.success(response.data.message);
    return response.data;
  } catch (error: any) {
    throw normalizeAxiosError(
      error,
      "Unable to sign in. Please check your email and password."
    );
  }
};
export const getDashboard = async (): Promise<any | null> => {
  try {
    const response = await axiosInstance.get(`/dashboard`);
    return response.data;
  } catch (error) {
    return null;
  }
};
export const sendOtp = async (data: any): Promise<any | null> => {
  try {
    const response = await axiosInstance.post(`/auth/send-otp`, data);
    toast.success(response.data.message);
    return response.data;
  } catch (error: any) {
    throw normalizeAxiosError(
      error,
      "Unable to send OTP. Please try again."
    );
  }
};
export const verifyOtp = async (data: any): Promise<any | null> => {
  try {
    const response = await axiosInstance.post(`/auth/verify-otp`, data);
    toast.success(response.data.message);
    return response.data;
  } catch (error: any) {
    throw normalizeAxiosError(
      error,
      "Unable to verify OTP. Please try again."
    );
  }
};

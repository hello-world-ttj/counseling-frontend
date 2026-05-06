import axios from "axios";
import { toast } from "react-toastify";
import axiosInstance from "./axiosintercepter";

export type BackupFormat = "json" | "csv";

export const downloadBackup = async (
  backupFormat: BackupFormat = "json"
): Promise<void> => {
  try {
    const response = await axiosInstance.get(`/backup`, {
      params: { format: backupFormat },
      responseType: "blob",
    });

    const contentType = response.headers["content-type"] || "";
    if (contentType.includes("application/json")) {
      const text = await response.data.text();
      const parsed = JSON.parse(text);
      throw new Error(parsed?.message || "Backup failed");
    }

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    const date = new Date().toISOString().split("T")[0];
    link.href = url;
    link.setAttribute(
      "download",
      `cbs-backup-${backupFormat}-${date}.zip`
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    toast.success("Backup downloaded successfully");
  } catch (error: unknown) {
    let message = "Failed to download backup";

    if (axios.isAxiosError(error) && error.response?.data instanceof Blob) {
      try {
        const text = await error.response.data.text();
        const parsed = JSON.parse(text);
        message = typeof parsed?.message === "string" ? parsed.message : message;
      } catch {
        // keep default message
      }
    } else if (error instanceof Error) {
      message = error.message;
    }

    toast.error(message);
    throw error;
  }
};

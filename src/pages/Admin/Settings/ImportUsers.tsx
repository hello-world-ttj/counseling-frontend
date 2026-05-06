import React, { useState } from "react";
import { toast } from "react-toastify";
import { importUsersCSV, exportUsersCSV } from "../../../api/userApi";
import { AiOutlineCloudUpload, AiOutlineCloudDownload } from "react-icons/ai";

const ImportUsers = () => {
  const [loading, setLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith('.csv')) {
        toast.error("Please upload a valid CSV file");
        setFile(null);
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }
    
    setLoading(true);
    try {
      await importUsersCSV(file);
      setFile(null);
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await exportUsersCSV();
    } catch (error) {
      console.error(error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col gap-9">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Import Users (CSV)
        </h2>
        <button
          onClick={handleDownload}
          type="button"
          disabled={isDownloading}
          className={`flex items-center gap-2 rounded py-2 px-4 font-medium ${
            isDownloading ? "bg-stroke text-black cursor-not-allowed dark:bg-strokedark dark:text-white" : "bg-primary text-white hover:bg-opacity-90"
          }`}
        >
          <AiOutlineCloudDownload size={20} />
          {isDownloading ? "Downloading..." : "Download students (CSV)"}
        </button>
      </div>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <p className="border-b border-stroke px-6.5 py-4 text-sm text-gray-600 dark:border-strokedark dark:text-gray-400">
          Bulk CSV import only updates <strong className="text-black dark:text-white">students</strong>.
          Rows are always imported as <strong className="text-black dark:text-white">student</strong> accounts;
          counsellor and admin accounts are not created via CSV—use Add Counselor or add admins in the database.
          Students not present in the uploaded file are marked inactive.
          The CSV does not need a userType column; extra columns are ignored.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="p-6.5">
            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Upload CSV File
              </label>
              <div
                className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5"
              >
                <input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileChange}
                  className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                />
                <div className="flex flex-col items-center justify-center space-y-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                    <AiOutlineCloudUpload size={24} className="text-primary" />
                  </span>
                  <p>
                    <span className="text-primary">Click to select file</span> or drag and drop
                  </p>
                  <p className="mt-1.5">CSV format only</p>
                  {file && (
                    <p className="mt-1.5 font-bold text-black dark:text-white">Selected: {file.name}</p>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !file}
              className={`flex w-full justify-center rounded p-3 font-medium text-gray ${
                loading || !file ? "bg-stroke text-black cursor-not-allowed dark:bg-strokedark dark:text-white" : "bg-[#0072bc] hover:bg-opacity-90 text-white"
              }`}
            >
              {loading ? "Uploading..." : "Upload & Import"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ImportUsers;

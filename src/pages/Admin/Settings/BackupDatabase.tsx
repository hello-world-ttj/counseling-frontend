import React, { useState } from "react";
import { AiOutlineCloudDownload } from "react-icons/ai";
import { downloadBackup } from "../../../api/backupApi";

const BackupDatabase = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadBackup();
    } catch {
      // toast handled in backupApi
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col gap-9">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Database Backup
        </h2>
        <button
          onClick={handleDownload}
          type="button"
          disabled={isDownloading}
          className={`flex items-center gap-2 rounded py-2 px-4 font-medium ${
            isDownloading
              ? "cursor-not-allowed bg-stroke text-black dark:bg-strokedark dark:text-white"
              : "bg-primary text-white hover:bg-opacity-90"
          }`}
        >
          <AiOutlineCloudDownload size={20} />
          {isDownloading ? "Downloading..." : "Download Database Backup"}
        </button>
      </div>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="p-6.5">
          <p className="mb-4 text-black dark:text-white">
            Download a compressed ZIP file containing JSON exports of all
            application collections: users, counseling types, events, times,
            cases, sessions, forms, notifications, and time removal logs.
          </p>
          <p className="text-sm text-body dark:text-bodydark">
            This backup is for archival and recovery purposes. Store the file
            securely; it may include personal and sensitive data.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BackupDatabase;

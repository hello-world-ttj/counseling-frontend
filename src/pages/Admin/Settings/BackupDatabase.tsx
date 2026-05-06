import React, { useState } from "react";
import { AiOutlineCloudDownload } from "react-icons/ai";
import {
  downloadBackup,
  type BackupFormat,
} from "../../../api/backupApi";

const BackupDatabase = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [format, setFormat] = useState<BackupFormat>("json");

  const handleConfirmDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadBackup(format);
      setModalOpen(false);
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
          onClick={() => setModalOpen(true)}
          type="button"
          disabled={isDownloading}
          className={`flex items-center gap-2 rounded py-2 px-4 font-medium ${
            isDownloading
              ? "cursor-not-allowed bg-stroke text-black dark:bg-strokedark dark:text-white"
              : "bg-primary text-white hover:bg-opacity-90"
          }`}
        >
          <AiOutlineCloudDownload size={20} />
          Download Database Backup
        </button>
      </div>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="p-6.5">
          <p className="mb-4 text-black dark:text-white">
            Download a compressed ZIP of all application collections: users,
            counseling types, events, times, cases, sessions, forms,
            notifications, and time removal logs. You can choose{" "}
            <strong>JSON</strong> (full structure, best for restore) or{" "}
            <strong>CSV</strong> (flattened columns, better for spreadsheets).
          </p>
          <p className="text-sm text-body dark:text-bodydark">
            This backup is for archival and recovery purposes. Store the file
            securely; it may include personal and sensitive data.
          </p>
        </div>
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-99999 flex items-center justify-center bg-black/60 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="backup-format-title"
        >
          <div className="w-full max-w-md rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h3
              id="backup-format-title"
              className="mb-4 text-lg font-semibold text-black dark:text-white"
            >
              Choose export format
            </h3>
            <p className="mb-4 text-sm text-body dark:text-bodydark">
              The ZIP will contain one file per collection, using either JSON
              or CSV inside the archive.
            </p>
            <div className="mb-6 flex flex-col gap-4">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="radio"
                  name="backup-format"
                  className="mt-1"
                  checked={format === "json"}
                  onChange={() => setFormat("json")}
                />
                <span>
                  <span className="font-medium text-black dark:text-white">
                    JSON
                  </span>
                  <span className="block text-sm text-body dark:text-bodydark">
                    Keeps nested data and types; suited for backups and
                    re-import tooling.
                  </span>
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="radio"
                  name="backup-format"
                  className="mt-1"
                  checked={format === "csv"}
                  onChange={() => setFormat("csv")}
                />
                <span>
                  <span className="font-medium text-black dark:text-white">
                    CSV
                  </span>
                  <span className="block text-sm text-body dark:text-bodydark">
                    Flattened rows/columns for Excel or reporting. Complex nested
                    values become dotted column names where possible.
                  </span>
                </span>
              </label>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                disabled={isDownloading}
                onClick={() => setModalOpen(false)}
                className="rounded border border-stroke px-5 py-2 text-sm font-medium text-black hover:shadow-sm dark:border-strokedark dark:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDownloading}
                onClick={handleConfirmDownload}
                className="rounded bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDownloading ? "Downloading..." : "Download ZIP"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BackupDatabase;

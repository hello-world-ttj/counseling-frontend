import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import AdminCounselorTable from "./AdminCounselorTable";
import { getStaffUserCount } from "../../../api/userApi";

const AdminCounselorList = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [staffCount, setStaffCount] = useState<number | null>(null);
  const [maxStaff, setMaxStaff] = useState<number>(10);

  useEffect(() => {
    const load = async () => {
      const res = await getStaffUserCount();
      if (res?.data) {
        setStaffCount(res.data.currentCount);
        setMaxStaff(res.data.maxCount);
      }
    };
    load();
  }, []);

  const isAtLimit = staffCount !== null && staffCount >= maxStaff;

  return (
    <>
      <div className="mb-7.5 flex flex-wrap gap-5 xl:gap-7.5 justify-between items-start">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-start flex-1 min-w-0">
          <h2 className="text-title-md2 font-semibold text-black dark:text-white ">
            Counselors
          </h2>
          {staffCount !== null && (
            <span className="inline-flex items-center rounded-full bg-meta-2 px-4 py-1.5 text-sm font-medium text-black dark:text-white dark:bg-meta-4 shrink-0">
              {staffCount} / {maxStaff} users created
            </span>
          )}
        </div>
        <div className="relative w-full max-w-xs">
          <div className="relative flex items-center bg-white dark:bg-graydark  rounded-lg shadow-md">
            <button type="button" className="absolute left-3 top-1/2 -translate-y-1/2">
              <svg
                className="fill-gray-500 fill-primary"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9.16666 3.33332C5.945 3.33332 3.33332 5.945 3.33332 9.16666C3.33332 12.3883 5.945 15 9.16666 15C12.3883 15 15 12.3883 15 9.16666C15 5.945 12.3883 3.33332 9.16666 3.33332ZM1.66666 9.16666C1.66666 5.02452 5.02452 1.66666 9.16666 1.66666C13.3088 1.66666 16.6667 5.02452 16.6667 9.16666C16.6667 13.3088 13.3088 16.6667 9.16666 16.6667C5.02452 16.6667 1.66666 13.3088 1.66666 9.16666Z"
                  fill=""
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M13.2857 13.2857C13.6112 12.9603 14.1388 12.9603 14.4642 13.2857L18.0892 16.9107C18.4147 17.2362 18.4147 17.7638 18.0892 18.0892C17.7638 18.4147 17.2362 18.4147 16.9107 18.0892L13.2857 14.4642C12.9603 14.1388 12.9603 13.6112 13.2857 13.2857Z"
                  fill=""
                />
              </svg>
            </button>

            <input
              type="text"
              placeholder="Type to search..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full bg-white pl-10 pr-4 py-2.5 text-black dark:bg-graydark dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        {isAtLimit ? (
          <span
            className="inline-flex items-center justify-center gap-2.5 bg-gray-400 py-4 px-10 text-center font-medium text-white cursor-not-allowed opacity-90 lg:px-8 xl:px-10"
            title="User limit reached"
          >
            <span>
              <svg
                className="fill-current"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 0C9.44772 0 9 0.44772 9 1V9H1C0.44772 9 0 9.44772 0 10C0 10.5523 0.44772 11 1 11H9V19C9 19.5523 9.44772 20 10 20C10.5523 20 11 19.5523 11 19V11H19C19.5523 11 20 10.5523 20 10C20 9.44772 19.5523 9 19 9H11V1C11 0.44772 10.5523 0 10 0Z"
                  fill=""
                />
              </svg>
            </span>
            Add Counselor
          </span>
        ) : (
          <Link
            to="/add-counselor"
            className="inline-flex items-center justify-center gap-2.5 bg-[#0072bc] py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          >
            <span>
              <svg
                className="fill-current"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 0C9.44772 0 9 0.44772 9 1V9H1C0.44772 9 0 9.44772 0 10C0 10.5523 0.44772 11 1 11H9V19C9 19.5523 9.44772 20 10 20C10.5523 20 11 19.5523 11 19V11H19C19.5523 11 20 10.5523 20 10C20 9.44772 19.5523 9 19 9H11V1C11 0.44772 10.5523 0 10 0Z"
                  fill=""
                />
              </svg>
            </span>
            Add Counselor
          </Link>
        )}
      </div>

      {isAtLimit && (
        <p className="mb-4 text-sm text-amber-600 dark:text-amber-400">
          For creating any more users, please contact your IT Admin
        </p>
      )}

      <AdminCounselorTable searchValue={searchValue} />
    </>
  );
};

export default AdminCounselorList;

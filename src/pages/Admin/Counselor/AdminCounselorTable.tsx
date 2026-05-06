import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { User } from "../../../types/user";
import { deleteUser, getUsers, updateUser } from "../../../api/userApi";
import Loader from "../../../components/Loader";

type ListMode = "active" | "inactive";

interface CounselorTableProps {
  searchValue: string;
  listMode: ListMode;
  onRosterChange?: () => void;
}

const AdminCounselorTable: React.FC<CounselorTableProps> = ({
  searchValue,
  listMode,
  onRosterChange,
}) => {
  const [packageData, setPackageData] = useState<User[]>([]);
  const [isChange, setIsChange] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const handleOpen = (id: string) => {
    setSelectedId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedId(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getUsers({
          searchQuery: searchValue,
          page: currentPage,
          limit: itemsPerPage,
          type: "counsellor",
          activeOnly: listMode === "active",
          inactiveOnly: listMode === "inactive",
        });
        setTotalCount(response.totalCount);
        if (response?.data) {
          setPackageData(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isChange, searchValue, currentPage, itemsPerPage, listMode]);

  useEffect(() => {
    if (searchValue && searchValue.trim() !== "") {
      setCurrentPage(1);
    }
  }, [searchValue]);

  const handleDeactivate = async () => {
    try {
      await deleteUser(selectedId!);
      setIsChange((prevState) => !prevState);
      onRosterChange?.();
      handleClose();
    } catch (error: any) {
      const msg =
        typeof error?.message === "string"
          ? error.message
          : "Could not deactivate counselor.";
      toast.error(msg);
    }
  };

  const handleActivate = async (id: string) => {
    try {
      await updateUser(id, { status: true });
      setIsChange((prevState) => !prevState);
      onRosterChange?.();
    } catch (error: any) {
      const msg =
        typeof error?.message === "string"
          ? error.message
          : "Could not reactivate counselor.";
      toast.error(msg);
    }
  };

  const navigate = useNavigate();
  const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const colCount = 7;

  return (
    <div className="rounded-sm border border-stroke bg-white  px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="max-w-full overflow-x-auto">
            <table className={`w-full table-auto ${open ? "blur-sm" : ""}`}>
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="min-w-[56px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                    SL
                  </th>
                  <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white">
                    Name
                  </th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                    Email
                  </th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                    Contact
                  </th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                    Designation
                  </th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                    Counseling Type
                  </th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {packageData.length > 0 ? (
                  packageData.map((packageItem, key) => {
                    const sl =
                      (currentPage - 1) * itemsPerPage + key + 1;
                    return (
                      <tr key={packageItem._id}>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark xl:pl-11">
                          <p className="text-black dark:text-white">{sl}</p>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <div
                            className="font-medium text-blue-600  cursor-pointer"
                            onClick={() => {
                              navigate(`/counselor/${packageItem._id}`, {
                                state: {
                                  name: packageItem.name,
                                },
                              });
                            }}
                          >
                            <h5 className="font-medium text-blue-600  hover:underline  dark:text-blue-300">
                              {packageItem.name}
                            </h5>
                          </div>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <p className="text-black dark:text-white">
                            {packageItem.email}
                          </p>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <p className="text-black dark:text-white">
                            {packageItem.mobile}
                          </p>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <p className="text-black dark:text-white">
                            {packageItem.designation}
                          </p>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <p className="text-black dark:text-white">
                            {(packageItem.counsellorType ?? []).join(", ")}
                          </p>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <div className="flex flex-wrap items-center gap-3">
                            {listMode === "active" && (
                              <button
                                type="button"
                                onClick={() => handleOpen(packageItem._id)}
                                className="hover:text-danger dark:text-danger"
                                title="Deactivate"
                              >
                                <svg
                                  className="fill-current"
                                  width="18"
                                  height="18"
                                  viewBox="0 0 18 18"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                                    fill=""
                                  />
                                  <path
                                    d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                                    fill=""
                                  />
                                  <path
                                    d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                                    fill=""
                                  />
                                  <path
                                    d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                                    fill=""
                                  />
                                </svg>
                              </button>
                            )}
                            {listMode === "inactive" && (
                              <button
                                type="button"
                                onClick={() => handleActivate(packageItem._id)}
                                className="rounded bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700"
                              >
                                Reactivate
                              </button>
                            )}
                            <button
                              type="button"
                              className="hover:text-primary dark:text-green-700"
                              onClick={() =>
                                navigate("/add-counselor", {
                                  state: {
                                    id: packageItem._id,
                                    editMode: true,
                                  },
                                })
                              }
                              title="Edit"
                            >
                              <svg
                                className="fill-current"
                                width="18"
                                height="18"
                                viewBox="0 0 18 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M13.232 2.768a1 1 0 0 1 1.416 0l2.5 2.5a1 1 0 0 1 0 1.416L6.865 13.571a1 1 0 0 1-.366.211l-2.142.643a1 1 0 0 1-1.224-1.224l.643-2.142a1 1 0 0 1 .211-.366L13.232 2.768z" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={colCount}
                      className="text-center py-5 text-gray-500 dark:text-gray-300 dark:text-white"
                    >
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {open && listMode === "active" && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                <div className="bg-white rounded-lg shadow-lg w-96 p-6 dark:bg-graydark">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    Deactivate counselor
                  </h2>
                  <p className="mt-4 text-gray-600 dark:text-gray-300">
                    This will deactivate the account (soft delete). They cannot
                    sign in until an administrator reactivates them. Case and
                    session history stays linked to this profile.
                  </p>
                  <div className="mt-6 flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleDeactivate}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Deactivate
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div
            className={`mt-4 flex justify-between items-center ${
              open ? "blur-sm" : ""
            }`}
          >
            <div className="flex items-center space-x-2">
              <span className="text-gray-700 dark:text-blue-100">
                Items per page:
              </span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="px-2 py-1 border rounded text-gray-700 dark:bg-transparent dark:text-blue-100"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="flex items-center space-x-4 dark:text-blue-100">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded transition ${
                  currentPage === 1
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                Previous
              </button>

              <span className="text-gray-800 dark:text-gray-200">
                Page <strong>{currentPage}</strong> of{" "}
                <strong>{totalPages}</strong>
              </span>

              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded transition ${
                  currentPage === totalPages
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                Next
              </button>
            </div>
          </div>{" "}
        </>
      )}
    </div>
  );
};

export default AdminCounselorTable;

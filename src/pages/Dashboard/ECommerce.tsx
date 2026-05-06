import React, { useEffect, useState } from "react";
import CardDataStats from "../../components/CardDataStats";
import Calendar from "../Calendar";
import { getDashboard } from "../../api/authApi";
import Loader from "../../components/Loader";

const ECommerce: React.FC = () => {
  const userType = localStorage.getItem("hgyywgywgdydwgy");
  const [loading, setLoading] = useState(false);
  const [dashboard, setDashboard] = useState<{
    student_count: string;
    case_count: string;
    counsellor_count: string;
    admin_count?: string;
    session_count: string;
    event_count: string;
  }>({
    student_count: "0",
    case_count: "0",
    counsellor_count: "0",
    admin_count: "0",
    session_count: "0",
    event_count: "0",
  });
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getDashboard();

        if (response?.data) {
          setDashboard(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          {userType === "admin" && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-6 2xl:gap-7.5">
              <CardDataStats
                title="Student Count"
                total={dashboard?.student_count}
              >
                <svg
                  className="fill-primary dark:fill-white"
                  width="22"
                  height="16"
                  viewBox="0 0 22 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M11 2.5L2 6.5L11 10.5L20 6.5L11 2.5Z" fill="" />
                  <path
                    d="M5.5 8.2V12C5.5 12 8 14 11 14C14 14 16.5 12 16.5 12V8.2L11 11L5.5 8.2Z"
                    fill=""
                  />
                  <path
                    d="M11 11.5V13.5"
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                </svg>
              </CardDataStats>{" "}
              <CardDataStats
                title="Counselor Count"
                total={dashboard?.counsellor_count}
              >
                {" "}
                <svg
                  className="fill-primary dark:fill-white"
                  width="22"
                  height="18"
                  viewBox="0 0 22 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.5 8C9.5 8 11 6.5 11 4.5C11 2.5 9.5 1 7.5 1C5.5 1 4 2.5 4 4.5C4 6.5 5.5 8 7.5 8Z"
                    fill=""
                  />
                  <path
                    d="M15.5 9.5C17 9.5 18.2 8.3 18.2 6.8C18.2 5.3 17 4.1 15.5 4.1C14 4.1 12.8 5.3 12.8 6.8C12.8 8.3 14 9.5 15.5 9.5Z"
                    fill=""
                  />
                  <path
                    d="M16 10H15.7C14.7 10 13.8 10.3 13 10.8C12.1 9.6 10.7 8.8 9.1 8.8H6.1C3.3 8.8 1 11.1 1 13.8V16.3C1 17 1.5 17.5 2.2 17.5H20.2C20.9 17.5 21.4 17 21.4 16.3V15.5C21.4 12.5 19 10 16 10ZM2.5 16V13.8C2.5 11.9 4.1 10.3 6 10.3H9.1C11 10.3 12.6 11.9 12.6 13.8V16H2.5ZM20 16H14V13.8C14 13.3 13.9 12.7 13.7 12.2C14.3 11.8 15.1 11.6 15.9 11.6H16.2C18.3 11.6 20.1 13.3 20.1 15.5V16H20Z"
                    fill=""
                  />
                </svg>
              </CardDataStats>
              <CardDataStats
                title="Admin accounts"
                total={dashboard?.admin_count ?? "0"}
              >
                <svg
                  className="fill-primary dark:fill-white"
                  width="22"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 12C14.21 12 16 10.21 16 8C16 5.03 13.44 3 12 3C10.56 3 8 5.03 8 8C8 10.21 9.79 12 12 12Z"
                    fill=""
                  />
                  <path
                    d="M4 18.5C4 15.46 7.13 13 12 13C16.87 13 20 15.46 20 18.5V20H4V18.5Z"
                    fill=""
                  />
                </svg>
              </CardDataStats>
              <CardDataStats title="Cases" total={`${dashboard?.case_count}`}>
                <svg
                  className="fill-primary dark:fill-white"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
                    fill=""
                  />
                  <path
                    d="M16 8H15V7C15 6.45 14.55 6 14 6H10C9.45 6 9 6.45 9 7V8H8C7.45 8 7 8.45 7 9V16C7 16.55 7.45 17 8 17H16C16.55 17 17 16.55 17 16V9C17 8.45 16.55 8 16 8ZM11 8V7H13V8H11Z"
                    fill=""
                  />
                </svg>
              </CardDataStats>
              <CardDataStats title="Sessions" total={dashboard?.session_count}>
                <svg
                  className="fill-primary dark:fill-white"
                  width="20"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z"
                    fill=""
                  />
                  <path
                    d="M12.5 7V12.25L16 14.33L15.28 15.54L11 13V7H12.5Z"
                    fill=""
                  />
                </svg>
              </CardDataStats>
              <CardDataStats title="Events" total={dashboard?.event_count}>
                <svg
                  className="fill-primary dark:fill-white"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 4H18V3C18 2.45 17.55 2 17 2C16.45 2 16 2.45 16 3V4H8V3C8 2.45 7.55 2 7 2C6.45 2 6 2.45 6 3V4H5C3.89 4 3 4.9 3 6V20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V9H19V20Z"
                    fill=""
                  />
                  <path
                    d="M12 17C13.1046 17 14 16.1046 14 15C14 13.8954 13.1046 13 12 13C10.8954 13 10 13.8954 10 15C10 16.1046 10.8954 17 12 17Z"
                    fill=""
                  />
                </svg>
              </CardDataStats>
            </div>
          )}

          <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
            <div className="col-span-12 xl:col-span-12">
              <h2 className="text-title-md2 font-semibold text-black dark:text-white mb-4">
                Upcoming Events
              </h2>
              <Calendar />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ECommerce;

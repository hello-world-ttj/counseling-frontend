import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import image from "../../images/schoolLogo.png";
import logo from "../../images/logo.jpg";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );
  const userType = localStorage.getItem("hgyywgywgdydwgy");
  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [settingDropdownOpen, setSettingDropdownOpen] = useState(false);
  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const toggleDropdownSetting = () => {
    setSettingDropdownOpen(!settingDropdownOpen);
  };
  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-white duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center justify-center gap-2 px-6 py-5.5 lg:py-0 ">
        <NavLink
          to="/dashboard"
          className="flex items-center  gap-2 pt-8 font-semibold text-xl text-[#333] hover:text-[#0072bc] transition-colors duration-300 ease-in-out dark:text-white"
        >
          <img src={image} alt="Logo" className="w-26 h-24" />
        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>
      <div className="flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200 hover:scrollbar-thumb-blue-700 scrollbar-thumb-rounded-full scrollbar-track-rounded-lg duration-300 ease-linear">

        <nav className="mt-5 py-4 px-4 lg:mt-0 lg:px-6">
          <div>
            <ul className="mb-6 flex flex-col gap-4.5">
              <li>
                <NavLink
                  to="/dashboard"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium  duration-300 ease-in-out hover:bg-[#0072bc]  hover:text-white dark:hover:bg-meta-4 dark:text-blue-200 ${
                    (pathname === "/dashboard" ||
                      pathname.includes("dashboard")) &&
                    "bg-[#0072bc] text-white"
                  }`}
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
                      d="M6.10322 0.956299H2.53135C1.5751 0.956299 0.787598 1.7438 0.787598 2.70005V6.27192C0.787598 7.22817 1.5751 8.01567 2.53135 8.01567H6.10322C7.05947 8.01567 7.84697 7.22817 7.84697 6.27192V2.72817C7.8751 1.7438 7.0876 0.956299 6.10322 0.956299ZM6.60947 6.30005C6.60947 6.5813 6.38447 6.8063 6.10322 6.8063H2.53135C2.2501 6.8063 2.0251 6.5813 2.0251 6.30005V2.72817C2.0251 2.44692 2.2501 2.22192 2.53135 2.22192H6.10322C6.38447 2.22192 6.60947 2.44692 6.60947 2.72817V6.30005Z"
                      fill=""
                    />
                    <path
                      d="M15.4689 0.956299H11.8971C10.9408 0.956299 10.1533 1.7438 10.1533 2.70005V6.27192C10.1533 7.22817 10.9408 8.01567 11.8971 8.01567H15.4689C16.4252 8.01567 17.2127 7.22817 17.2127 6.27192V2.72817C17.2127 1.7438 16.4252 0.956299 15.4689 0.956299ZM15.9752 6.30005C15.9752 6.5813 15.7502 6.8063 15.4689 6.8063H11.8971C11.6158 6.8063 11.3908 6.5813 11.3908 6.30005V2.72817C11.3908 2.44692 11.6158 2.22192 11.8971 2.22192H15.4689C15.7502 2.22192 15.9752 2.44692 15.9752 2.72817V6.30005Z"
                      fill=""
                    />
                    <path
                      d="M6.10322 9.92822H2.53135C1.5751 9.92822 0.787598 10.7157 0.787598 11.672V15.2438C0.787598 16.2001 1.5751 16.9876 2.53135 16.9876H6.10322C7.05947 16.9876 7.84697 16.2001 7.84697 15.2438V11.7001C7.8751 10.7157 7.0876 9.92822 6.10322 9.92822ZM6.60947 15.272C6.60947 15.5532 6.38447 15.7782 6.10322 15.7782H2.53135C2.2501 15.7782 2.0251 15.5532 2.0251 15.272V11.7001C2.0251 11.4188 2.2501 11.1938 2.53135 11.1938H6.10322C6.38447 11.1938 6.60947 11.4188 6.60947 11.7001V15.272Z"
                      fill=""
                    />
                    <path
                      d="M15.4689 9.92822H11.8971C10.9408 9.92822 10.1533 10.7157 10.1533 11.672V15.2438C10.1533 16.2001 10.9408 16.9876 11.8971 16.9876H15.4689C16.4252 16.9876 17.2127 16.2001 17.2127 15.2438V11.7001C17.2127 10.7157 16.4252 9.92822 15.4689 9.92822ZM15.9752 15.272C15.9752 15.5532 15.7502 15.7782 15.4689 15.7782H11.8971C11.6158 15.7782 11.3908 15.5532 11.3908 15.272V11.7001C11.3908 11.4188 11.6158 11.1938 11.8971 11.1938H15.4689C15.7502 11.1938 15.9752 11.4188 15.9752 11.7001V15.272Z"
                      fill=""
                    />
                  </svg>
                  Dashboard
                </NavLink>
              </li>
              {userType === "counsellor" && (
                <li className="relative">
                  <div
                    onClick={toggleDropdown}
                    className={`group relative flex items-center justify-between dark:text-blue-200 gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:bg-[#0072bc] hover:text-white dark:hover:bg-meta-4 cursor-pointer ${
                      pathname.includes("counselor") &&
                      "bg-[#0072bc] text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 2C9.243 2 7 4.243 7 7C7 9.757 9.243 12 12 12C14.757 12 17 9.757 17 7C17 4.243 14.757 2 12 2ZM12 10C10.346 10 9 8.654 9 7C9 5.346 10.346 4 12 4C13.654 4 15 5.346 15 7C15 8.654 13.654 10 12 10Z"
                          fill=""
                        />
                        <path
                          d="M12 14C9.347 14 4 15.347 4 18V20C4 20.553 4.447 21 5 21H19C19.553 21 20 20.553 20 20V18C20 15.347 14.653 14 12 14ZM6 18C6.217 17.147 9.417 16 12 16C14.583 16 17.783 17.147 18 18H6Z"
                          fill=""
                        />
                      </svg>
                      Case Management
                    </div>
                    {isDropdownOpen ? (
                      <BsChevronUp size={18} />
                    ) : (
                      <BsChevronDown size={18} />
                    )}
                  </div>

                  {isDropdownOpen && (
                    <ul className="pl-8 mt-2 space-y-2">
                      <li>
                        <NavLink
                          to="/counselor-session"
                          className={`group relative flex items-center gap-2.5 py-2 px-4 rounded-sm duration-300 ease-in-out dark:text-blue-200 hover:bg-[#0072bc] hover:text-white ${
                            pathname.includes("session") &&
                            "bg-[#0072bc] text-white"
                          }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 3c4.418 0 8 3.134 8 7 0 2.136-.932 4.05-2.45 5.45L20 21l-4.55-2.45A9.824 9.824 0 0112 18c-4.418 0-8-3.134-8-7s3.582-7 8-7zm0 4a2 2 0 11.001 3.999A2 2 0 0112 7zm-4 6c0-1.5 2-2.5 4-2.5s4 1 4 2.5"
                            />
                          </svg>
                          Sessions
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/counselor-case"
                          className={`group relative flex items-center gap-2.5 py-2 dark:text-blue-200 px-4 rounded-sm duration-300 ease-in-out hover:bg-[#0072bc] hover:text-white ${
                            pathname.includes("counselor") &&
                            pathname.includes("case")
                              ? "bg-[#0072bc] text-white"
                              : ""
                          }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5 mr-2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.893 1.254 50.595 50.595 0 0 0-2.658.813m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675a3 3 0 0 1 3-3h1.5m-.75 3a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75Zm3 3h1.5a3 3 0 0 0 3-3v-3.375c0-.621-.504-1.125-1.125-1.125H9.375c-.621 0-1.125.504-1.125 1.125v3.375Z"
                            />
                          </svg>
                          Cases
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/counselors-remark"
                          className={`group relative flex items-center gap-2.5 py-2 dark:text-blue-200 px-4 rounded-sm duration-300 ease-in-out hover:bg-[#0072bc] hover:text-white ${
                            pathname.includes("remark") &&
                            "bg-[#0072bc] text-white"
                          }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5 mr-2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M8 10h8M8 14h4m-4-8h8a4 4 0 014 4v6a4 4 0 01-4 4h-8a4 4 0 01-4-4V10a4 4 0 014-4z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 18v2m-8-8v4"
                            />
                          </svg>
                          Refered Cases
                        </NavLink>
                      </li>
                    </ul>
                  )}
                </li>
              )}
              {userType === "counsellor" && (
                <li>
                  <NavLink
                    to="/availability"
                    className={`group relative flex items-center gap-2.5 dark:text-blue-200  rounded-sm py-2 px-4 font-medium  duration-300 ease-in-out hover:bg-[#0072bc] hover:text-white dark:hover:bg-meta-4 ${
                      pathname.includes("availability") &&
                      "bg-[#0072bc] text-white"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 3c4.418 0 8 3.134 8 7 0 2.136-.932 4.05-2.45 5.45L20 21l-4.55-2.45A9.824 9.824 0 0112 18c-4.418 0-8-3.134-8-7s3.582-7 8-7zm0 4a2 2 0 11.001 3.999A2 2 0 0112 7zm-4 6c0-1.5 2-2.5 4-2.5s4 1 4 2.5"
                      />
                    </svg>
                    Add Availability
                  </NavLink>
                </li>
              )}
              {userType === "admin" && (
                <li className="relative">
                  <div
                    onClick={toggleUserDropdown}
                    className={`group relative flex items-center justify-between dark:text-blue-200 gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:bg-[#0072bc] hover:text-white dark:hover:bg-meta-4 cursor-pointer ${
                      (pathname.includes("counselor") ||
                        pathname.includes("student")) &&
                      "bg-[#0072bc] text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 2C9.243 2 7 4.243 7 7C7 9.757 9.243 12 12 12C14.757 12 17 9.757 17 7C17 4.243 14.757 2 12 2ZM12 10C10.346 10 9 8.654 9 7C9 5.346 10.346 4 12 4C13.654 4 15 5.346 15 7C15 8.654 13.654 10 12 10Z"
                          fill=""
                        />
                        <path
                          d="M12 14C9.347 14 4 15.347 4 18V20C4 20.553 4.447 21 5 21H19C19.553 21 20 20.553 20 20V18C20 15.347 14.653 14 12 14ZM6 18C6.217 17.147 9.417 16 12 16C14.583 16 17.783 17.147 18 18H6Z"
                          fill=""
                        />
                      </svg>
                      User
                    </div>
                    {isUserDropdownOpen ? (
                      <BsChevronUp size={18} />
                    ) : (
                      <BsChevronDown size={18} />
                    )}
                  </div>

                  {isUserDropdownOpen && (
                    <ul className="pl-8 mt-2 space-y-2">
                      <li>
                        <NavLink
                          to="/counselor"
                          className={`group relative flex items-center gap-2.5 py-2 px-4 rounded-sm duration-300 ease-in-out dark:text-blue-200 hover:bg-[#0072bc] hover:text-white ${
                            pathname.includes("counselor") &&
                            "bg-[#0072bc] text-white"
                          }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5 mr-2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                            />
                          </svg>
                          Counselor
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/student"
                          className={`group relative flex items-center gap-2.5 py-2 dark:text-blue-200 px-4 rounded-sm duration-300 ease-in-out hover:bg-[#0072bc] hover:text-white ${
                            pathname.includes("student") &&
                            "bg-[#0072bc] text-white"
                          }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5 mr-2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.893 1.254 50.595 50.595 0 0 0-2.658.813m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675a3 3 0 0 1 3-3h1.5m-.75 3a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75Zm3 3h1.5a3 3 0 0 0 3-3v-3.375c0-.621-.504-1.125-1.125-1.125H9.375c-.621 0-1.125.504-1.125 1.125v3.375Z"
                            />
                          </svg>
                          Student
                        </NavLink>
                      </li>
                    </ul>
                  )}
                </li>
              )}
              {userType === "admin" && (
                <li>
                  <NavLink
                    to="/case-session"
                    className={`group relative flex dark:text-blue-200 items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:bg-[#0072bc] hover:text-white dark:hover:bg-meta-4 ${
                      (pathname.includes("case") ||
                        pathname.includes("session")) &&
                      "bg-[#0072bc] text-white"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 6.75V18c0 1.242 1.008 2.25 2.25 2.25h13.5c1.242 0 2.25-1.008 2.25-2.25V6.75M3 6.75L6.75 3h10.5L21 6.75M3 6.75h18"
                      />
                    </svg>
                    Cases and Sessions
                  </NavLink>
                </li>
              )}
              <li>
                <NavLink
                  to="/admin-event"
                  className={`group relative flex items-center dark:text-blue-200  gap-2.5 rounded-sm py-2 px-4 font-medium  duration-300 ease-in-out hover:bg-[#0072bc] hover:text-white dark:hover:bg-meta-4 ${
                    pathname.includes("event") && "bg-[#0072bc] text-white"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 2v4M16 2v4M4 8h16M4 6a2 2 0 012-2h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM12 11l1.5 3 3.5.5-2.5 2.5.5 3.5-3-1.5-3 1.5.5-3.5-2.5-2.5 3.5-.5L12 11z"
                    />
                  </svg>
                  Events
                </NavLink>
              </li>{" "}
              {userType === "admin" && (
                <li>
                  <NavLink
                    to="/admin-type"
                    className={`group relative flex items-center gap-2.5 dark:text-blue-200  rounded-sm py-2 px-4 font-medium  duration-300 ease-in-out hover:bg-[#0072bc] hover:text-white dark:hover:bg-meta-4 ${
                      pathname.includes("type") && "bg-[#0072bc] text-white"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 3c4.418 0 8 3.134 8 7 0 2.136-.932 4.05-2.45 5.45L20 21l-4.55-2.45A9.824 9.824 0 0112 18c-4.418 0-8-3.134-8-7s3.582-7 8-7zm0 4a2 2 0 11.001 3.999A2 2 0 0112 7zm-4 6c0-1.5 2-2.5 4-2.5s4 1 4 2.5"
                      />
                    </svg>
                    Counseling Type
                  </NavLink>
                </li>
              )}
              {userType === "admin" && (
                <li>
                  <NavLink
                    to="/admin-report"
                    className={`group relative flex items-center gap-2.5 dark:text-blue-200  rounded-sm py-2 px-4 font-medium  duration-300 ease-in-out hover:bg-[#0072bc] hover:text-white dark:hover:bg-meta-4 ${
                      pathname.includes("admin-report") &&
                      "bg-[#0072bc] text-white"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm3 6h6m-6 4h3m-3 4h4"
                      />
                    </svg>
                    Reports
                  </NavLink>
                </li>
              )}
              <li className="relative">
                <div
                  onClick={toggleDropdownSetting}
                  className={`group relative flex items-center justify-between dark:text-blue-200 gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:bg-[#0072bc] hover:text-white dark:hover:bg-meta-4 cursor-pointer ${
                    pathname.includes("change") && "bg-[#0072bc] text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <svg
                      className="fill-current"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 2C9.243 2 7 4.243 7 7C7 9.757 9.243 12 12 12C14.757 12 17 9.757 17 7C17 4.243 14.757 2 12 2ZM12 10C10.346 10 9 8.654 9 7C9 5.346 10.346 4 12 4C13.654 4 15 5.346 15 7C15 8.654 13.654 10 12 10Z"
                        fill=""
                      />
                      <path
                        d="M12 14C9.347 14 4 15.347 4 18V20C4 20.553 4.447 21 5 21H19C19.553 21 20 20.553 20 20V18C20 15.347 14.653 14 12 14ZM6 18C6.217 17.147 9.417 16 12 16C14.583 16 17.783 17.147 18 18H6Z"
                        fill=""
                      />
                    </svg>
                    Settings
                  </div>
                  {settingDropdownOpen ? (
                    <BsChevronUp size={18} />
                  ) : (
                    <BsChevronDown size={18} />
                  )}
                </div>
                {settingDropdownOpen && (
                  <ul className="pl-8 mt-2 space-y-2">
                    <li>
                      {" "}
                      <NavLink
                        to="/change-password"
                        className={`group relative flex items-center gap-2.5 dark:text-blue-200  rounded-sm py-2 px-4 font-medium  duration-300 ease-in-out hover:bg-[#0072bc] hover:text-white dark:hover:bg-meta-4 ${
                          pathname.includes("password") &&
                          "bg-[#0072bc] text-white"
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 17a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8 10V8a4 4 0 118 0v2m-9 0h10a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6a2 2 0 012-2z"
                          />
                        </svg>
                        Change Password
                      </NavLink>
                    </li>
                    {userType === "admin" && (
                    <li>
                      {" "}
                      <NavLink
                        to="/import-users"
                        className={`group relative flex items-center gap-2.5 dark:text-blue-200  rounded-sm py-2 px-4 font-medium  duration-300 ease-in-out hover:bg-[#0072bc] hover:text-white dark:hover:bg-meta-4 ${
                          pathname.includes("import-users") &&
                          "bg-[#0072bc] text-white"
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                          />
                        </svg>
                        Import Users
                      </NavLink>
                    </li>
                    )}
                    {userType === "admin" && (
                    <li>
                      {" "}
                      <NavLink
                        to="/database-backup"
                        className={`group relative flex items-center gap-2.5 dark:text-blue-200  rounded-sm py-2 px-4 font-medium  duration-300 ease-in-out hover:bg-[#0072bc] hover:text-white dark:hover:bg-meta-4 ${
                          pathname.includes("database-backup") &&
                          "bg-[#0072bc] text-white"
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75M20.25 6.375v3.75m0 0V18a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 18v-8.625h15.75Z"
                          />
                        </svg>
                        Database Backup
                      </NavLink>
                    </li>
                    )}
                    <li>
                      {" "}
                      <NavLink
                        to="/change-profile"
                        className={`group relative flex items-center gap-2.5 dark:text-blue-200  rounded-sm py-2 px-4 font-medium  duration-300 ease-in-out hover:bg-[#0072bc] hover:text-white dark:hover:bg-meta-4 ${
                          pathname.includes("profile") &&
                          "bg-[#0072bc] text-white"
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 14c3.31 0 6-2.69 6-6S15.31 2 12 2 6 4.69 6 8s2.69 6 6 6zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5z"
                          />
                        </svg>
                        Change Profile
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          </div>
        </nav>
      </div>
      <div className="mt-auto flex flex-col items-center justify-center py-6 px-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
        <span className="text-sm font-semibold text-gray-700 dark:text-blue-300 tracking-wide">
          Powered By
        </span>
        <img
          src={logo}
          alt="Logo"
          className="w-48 h-auto mt-3 opacity-90 hover:opacity-100 transition-opacity duration-300"
        />
      </div>
    </aside>
  );
};

export default Sidebar;

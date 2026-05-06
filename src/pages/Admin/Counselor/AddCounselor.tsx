import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import SelectType from "../../../components/Admin/SelectType";
import SelectGender from "../../../components/Admin/SelectGender";
import {
  createUser,
  getStaffUserCount,
  getUserById,
  updateUser,
  upload,
} from "../../../api/userApi";
import { toast } from "react-toastify";

const AddCounselor = () => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");
  const VITE_APP_FILE_URL = "https://able.iswkoman.com/images/";
  const [file, setFile] = useState<File | null>(null);
  const [counselorData, setCounselorData] = useState<{
    name: string;
    userType: string;
    designation: string;
    email: string;
    image: string;
    mobile: string;
    counsellorType: string[];
    gender: string;
  }>({
    name: "",
    userType: "counsellor",
    designation: "",
    email: "",
    image: "",
    mobile: "",
    counsellorType: [],
    gender: "",
  });

  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const isEditMode = state?.editMode;
  const counselorId = state?.id;
  const [staffCount, setStaffCount] = useState<number | null>(null);
  const [maxStaff, setMaxStaff] = useState<number>(10);

  useEffect(() => {
    const loadStaffCount = async () => {
      const res = await getStaffUserCount();
      if (res?.data) {
        setStaffCount(res.data.currentCount);
        setMaxStaff(res.data.maxCount);
      }
    };
    loadStaffCount();
  }, []);

  const isAtStaffLimit =
    !isEditMode &&
    staffCount !== null &&
    staffCount >= maxStaff;

  useEffect(() => {
    if (isEditMode && counselorId) {
      const fetchCounselor = async () => {
        const response = await getUserById(counselorId);
        const counselor = response?.data;

        if (counselor) {
          setCounselorData({
            name: counselor.name || "",
            designation: counselor.designation || "",
            email: counselor.email || "",
            mobile: counselor.mobile || "",
            image: counselor.image || "",
            counsellorType: counselor.counsellorType || [],
            gender: counselor.gender || "",
            userType: "counsellor",
          });
        }
        setPreview(
          counselor?.image ? `${VITE_APP_FILE_URL}${counselor.image}` : ""
        );
      };
      fetchCounselor();
    }
  }, [isEditMode, counselorId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;

    if (files && files.length > 0) {
      const selectedFile = files[0];

      const imageUrl = URL.createObjectURL(selectedFile);
      setPreview(imageUrl);

      setFile(selectedFile);
    } else {
      setCounselorData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleMobileChange = (value: string) => {
    setCounselorData((prev) => ({
      ...prev,
      mobile: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isAtStaffLimit) {
      toast.error(
        "User limit reached. For creating any more users, please contact your IT Admin."
      );
      return;
    }
    setLoading(true);

    try {
      let imageUrl = counselorData.image;
      if (preview && file) {
        const response = await upload(file);
        if (response?.data) {
          imageUrl = response.data;
        }
      }

      const updatedCounselorData = {
        ...(counselorData.name && { name: counselorData.name }),
        ...(imageUrl && { image: imageUrl }),
        ...(counselorData.designation && {
          designation: counselorData.designation,
        }),
        ...(counselorData.email && { email: counselorData.email }),
        ...(counselorData.mobile && { mobile: counselorData.mobile }),
        ...(counselorData.counsellorType && {
          counsellorType: counselorData.counsellorType,
        }),
        ...(counselorData.gender && { gender: counselorData.gender }),
        userType: "counsellor",
      };
      if (isEditMode && counselorId) {
        await updateUser(counselorId, updatedCounselorData);
      } else {
        await createUser(updatedCounselorData);
      }
      navigate("/counselor");
    } catch (error: any) {
      const msg =
        typeof error?.message === "string"
          ? error.message
          : "Something went wrong";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGenderChange = (value: string) => {
    setCounselorData((prev) => ({
      ...prev,
      gender: value,
    }));
  };

  const handleTypeChange = (values: string[]) => {
    setCounselorData((prev) => ({
      ...prev,
      counsellorType: values,
    }));
  };

  return (
    <div className="flex flex-col gap-9">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-start">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 cursor-pointer text-black dark:text-white hover:text-blue-600"
          onClick={() => navigate(-1)}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>{" "}
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          {counselorId ? "Edit Counselor" : "Add Counselor"}
        </h2>
      </div>
      {isAtStaffLimit && (
        <div className="mb-4 rounded-sm border border-amber-500 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-600 dark:bg-amber-900/20 dark:text-amber-200">
          User limit reached ({staffCount} / {maxStaff}). For creating any more
          users, please contact your IT Admin.
        </div>
      )}

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <form onSubmit={handleSubmit}>
          <div className="p-6.5">
            <div className="mb-4.5 grid grid-cols-1 gap-6 xl:grid-cols-2">
              <div className="w-full">
                <label className="mb-2.5 block text-black dark:text-white">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={counselorData.name}
                  onChange={handleChange}
                  placeholder="Enter Name"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-[#0072bc] dark:text-white"
                />
              </div>
              <SelectGender
                onGenderChange={handleGenderChange}
                selectedGender={counselorData.gender}
              />
            </div>

            <div className="mb-4.5 grid grid-cols-1 gap-6 xl:grid-cols-2">
              <div className="w-full">
                <label className="mb-2.5 block text-black dark:text-white">
                  Designation
                </label>
                <input
                  type="text"
                  name="designation"
                  value={counselorData.designation}
                  onChange={handleChange}
                  placeholder="Enter Designation"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-[#0072bc] dark:text-white"
                />
              </div>
              <div className="w-full">
                <label className="mb-2.5 block text-black dark:text-white">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={counselorData.email}
                  onChange={handleChange}
                  placeholder="Enter Email"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-[#0072bc] dark:text-white"
                />
              </div>
            </div>
            <div className="mb-4.5 grid grid-cols-1 gap-6 xl:grid-cols-2">
              <div className="w-full">
                <label className="mb-2.5 block text-black dark:text-white">
                  Contact Number
                </label>
                <PhoneInput
                  country={"om"}
                  value={counselorData.mobile}
                  onChange={handleMobileChange}
                  inputProps={{
                    name: "mobile",
                    required: true,
                    className:
                      "w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-10 text-black outline-none transition focus:border-[#0072bc] active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary",
                  }}
                  containerClass="phone-input-container"
                  buttonClass="phone-input-button"
                  dropdownClass="phone-input-dropdown"
                />
              </div>{" "}
              <div className="w-full">
                <label className="mb-2.5 block text-black dark:text-white">
                  Profile Picture
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                />
                {preview && (
                  <div className="mt-3">
                    <img
                      src={preview}
                      alt="Selected Preview"
                      className="w-32 h-32 object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="mb-4.5">
              <SelectType
                onTypeChange={handleTypeChange}
                selectedType={counselorData.counsellorType}
              />
            </div>

            <button
              type="submit"
              disabled={isAtStaffLimit}
              className="flex w-full justify-center rounded bg-[#0072bc] p-3 font-medium text-gray hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Submitting..." : counselorId ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCounselor;

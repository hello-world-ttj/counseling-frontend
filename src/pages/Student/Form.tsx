import React, { useState, useEffect } from "react";
import LogoDark from "../../images/schoolLogo.png";
import SelectBooking from "../../components/Student/SelectBooking";
import { getUserByStudent } from "../../api/userApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { createForm } from "../../api/sessionApi";
import {
  FaUser,
  FaEnvelope,
  FaSchool,
  FaIdCard,
  FaUserTie,
  FaChalkboardTeacher,
} from "react-icons/fa";

const Form: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    grNumber: "",
    name: "",
    class: "",
    email: "",
    referee: "",
    refereeName: "",
  });

  useEffect(() => {
    const fetchStudentData = async () => {
      if (form.grNumber.trim().length > 1) {
        const response = await getUserByStudent(form.grNumber);

        const studentData = response.data;
        if (studentData) {
          setForm((prev) => ({
            ...prev,
            name: studentData.name || "",
            class: `${studentData.designation || ""} ${
              studentData.division ? "" + studentData.division : ""
            }`,
            email: studentData.email || "",
          }));
        }
      }
    };

    const delayDebounce = setTimeout(fetchStudentData, 500);

    return () => clearTimeout(delayDebounce);
  }, [form.grNumber]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData: any = {
      grNumber: form.grNumber,
      name: form.name,
      class: form.class,
      email: form.email,
      referee: form.referee,
      ...(form.refereeName.trim() !== "" && { refereeName: form.refereeName }), // ✅ Only include if not empty
    };

    try {
      const response = await createForm(formData);
      const formId = response.data?._id;
      navigate("/book-appoinment", { state: { formId } });
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleBookChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      referee: value,
    }));
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
        <div className="flex items-center space-x-4 mb-8">
          <img className="dark:hidden w-20 h-22" src={LogoDark} alt="Logo" />
          <h2 className="text-2xl font-bold text-black dark:text-white sm:text-title-xl2 text-center">
            Welcome to the ABLE Team's Workspace
          </h2>
        </div>
        <div className="w-full xl:w-1/2 border border-stroke bg-white dark:border-strokedark dark:bg-boxdark rounded-lg shadow-2xl overflow-hidden">
          <div className="w-full p-6 sm:p-12.5 xl:p-8.5">
            <div className="mb-6 flex justify-center">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-black dark:text-white text-center mb-3">
                To talk to the Counselor, book an appointment here
              </h3>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    GR Number
                  </label>
                  <div className="relative">
                    <FaIdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="grNumber"
                      placeholder="Enter GR Number"
                      value={form.grNumber}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-10 pr-5 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Student Name
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter student name"
                      value={form.name}
                      onChange={handleChange}
                      disabled
                      className="w-full rounded-lg border border-stroke bg-gray-200 py-3 pl-10 pr-5 text-black outline-none dark:border-form-strokedark dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Class and Section
                  </label>
                  <div className="relative">
                    <FaSchool className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="class"
                      placeholder="Enter class and section"
                      value={form.class}
                      onChange={handleChange}
                      disabled
                      className="w-full rounded-lg border border-stroke bg-gray-200 py-3 pl-10 pr-5 text-black outline-none dark:border-form-strokedark dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Email
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter Email"
                      value={form.email}
                      onChange={handleChange}
                      disabled
                      className="w-full rounded-lg border border-stroke bg-gray-200 py-3 pl-10 pr-5 text-black outline-none dark:border-form-strokedark dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <SelectBooking
                  onBookChange={handleBookChange}
                  selectedBook={form.referee}
                />

                {["parent", "teacher"].includes(form.referee) && (
                  <div>
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      {form.referee === "parent"
                        ? "Parent Name"
                        : "Teacher Name"}
                    </label>
                    <div className="relative">
                      {form.referee === "parent" ? (
                        <FaUserTie className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      ) : (
                        <FaChalkboardTeacher className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      )}
                      <input
                        type="text"
                        name="refereeName"
                        placeholder={`Enter ${form.referee}'s Name`}
                        value={form.refereeName}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-10 pr-5 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-5">
                <input
                  type="submit"
                  value="Next"
                  className="flex w-full justify-center rounded bg-[#0072bc] p-3 font-medium text-gray hover:bg-opacity-90"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Form;

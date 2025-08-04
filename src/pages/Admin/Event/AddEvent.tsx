import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import { createEvent, getEventById, updateEvent } from "../../../api/eventApi";
import { toast } from "react-toastify";
import { getUsers, upload } from "../../../api/userApi";

const AddEvent = () => {
  const [preview, setPreview] = useState("");
  const [counselor, setCounselor] = useState<
    { value: string; label: string }[]
  >([]);
  const VITE_APP_FILE_URL = "https://able.iswkoman.com/images/";
  const [file, setFile] = useState<File | null>(null);
  const [isOther, setIsOther] = useState(false);
  const [loading, setLoading] = useState(false);
  const [eventData, setEventData] = useState<{
    title: string;
    date: string;
    venue: string;
    guest: string;
    requisition_image: string;
    details: string;
    creator: string;
    counselor: string | string[];
    type: string;
    start_time: string;
    end_time: string;
    requisition_description: string;
  }>({
    title: "",
    date: "",
    venue: "",
    guest: "",
    requisition_image: "",
    details: "",
    start_time: "",
    end_time: "",
    type: "",
    creator: "",
    counselor: "",
    requisition_description: "",
  });

  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const isEditMode = state?.editMode;
  const eventId = state?.id;
  const venueOptions = [
    "Foundation",
    "Preparatory",
    "Middle & senior",
    "Cambridge",
  ];
  const typeOptions = [
    "Team meetings",
    "Other meeting",
    "Invigilation",
    "session / workshop",
  ];

  useEffect(() => {
    if (isEditMode && eventId) {
      const fetchEvent = async () => {
        const response = await getEventById(eventId);
        const event = response.data;

        if (event) {
          const formattedDate = event.date
            ? new Date(event.date).toLocaleDateString("en-CA")
            : "";
          if (event?.venue && !venueOptions.includes(event.venue)) {
            setIsOther(true);
            setEventData((prev) => ({ ...prev, venue: event.venue }));
          } else {
            setIsOther(false);
          }
          setEventData({
            title: event.title || "",
            date: formattedDate || "",
            venue: event.venue || "",
            guest: event.guest || "",
            requisition_image: event.requisition_image || "",
            creator: event.creator || "",
            details: event.details || "",
            type: event.type || "",
            start_time: event.start_time || "",
            end_time: event.end_time || "",
            counselor: event.counselor || "",
            requisition_description: event.requisition_description || "",
          });

          setPreview(
            event.requisition_image
              ? `${VITE_APP_FILE_URL}${event.requisition_image}`
              : ""
          );
        }
      };
      fetchEvent();
    }
  }, [isEditMode, eventId]);

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
      setEventData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    const fetchCounselor = async () => {
      try {
        const response = await getUsers({ type: "counsellor", user: "all" });
        const counselorOptions = response?.data?.map((counselor: any) => ({
          value: counselor._id,
          label: counselor.name,
        }));
        setCounselor(counselorOptions);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchCounselor();
  }, []);

  const handleVenueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    if (selectedValue === "other") {
      setIsOther(true);
      setEventData({ ...eventData, venue: "" });
    } else {
      setIsOther(false);
      setEventData({ ...eventData, venue: selectedValue });
    }
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setEventData({ ...eventData, type: selectedValue });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = eventData.requisition_image;
      if (preview && file) {
        const response = await upload(file);
        if (response?.data) {
          imageUrl = response.data;
        }
      }
      const updatedEventData = {
        ...(eventData.title && { title: eventData.title }),
        ...(eventData.date && { date: eventData.date }),
        ...(eventData.venue && { venue: eventData.venue }),
        ...(eventData.guest && { guest: eventData.guest }),
        ...(imageUrl && { requisition_image: imageUrl }),
        ...(eventData.type && { type: eventData.type }),
        ...(eventData.start_time && { start_time: eventData.start_time }),
        ...(eventData.end_time && { end_time: eventData.end_time }),
        ...(eventData.details && { details: eventData.details }),
        ...(eventData.creator && { creator: eventData.creator }),
        ...(eventData.counselor && { counselor: eventData.counselor }),
        ...(eventData.requisition_description && {
          requisition_description: eventData.requisition_description,
        }),
      };

      if (isEditMode && eventId) {
        await updateEvent(eventId, updatedEventData);
      } else {
        await createEvent(updatedEventData);
      }

      navigate("/admin-event");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload image!");
    } finally {
      setLoading(false);
    }
  };

  // Create options with "All" as first option
  const counselorOptions = [
    { value: "*", label: "All" },
    ...counselor
  ];

  // Check if "All" is selected
  const isAllSelected = Array.isArray(eventData.counselor) 
    ? eventData.counselor.includes("*")
    : eventData.counselor === "*";

  // Get current selected values for display
  const getSelectedValues = () => {
    if (isAllSelected) {
      return [{ value: "*", label: "All" }];
    }
    
    if (Array.isArray(eventData.counselor)) {
      return counselorOptions.filter(option => 
        eventData.counselor.includes(option.value) && option.value !== "*"
      );
    }
    
    if (eventData.counselor) {
      return counselorOptions.filter(option => option.value === eventData.counselor);
    }
    
    return [];
  };

  // Handle counselor selection change
  const handleCounselorChange = (selectedOptions: any) => {
    const selectedValues = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];
    
    if (selectedValues.includes("*")) {
      // If "All" is selected, set counselor to ["*"]
      setEventData((prev) => ({
        ...prev,
        counselor: ["*"],
      }));
    } else {
      // If "All" is not selected, set individual counselors
      setEventData((prev) => ({
        ...prev,
        counselor: selectedValues,
      }));
    }
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
          {eventId ? "Edit Event" : "Add Event"}
        </h2>
      </div>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <form onSubmit={handleSubmit}>
          <div className="p-6.5">
            <div className="mb-4.5 grid grid-cols-1 gap-6 xl:grid-cols-2">
              <div className="w-full">
                <label className="mb-2.5 block text-black dark:text-white">
                  Title*
                </label>
                <input
                  type="text"
                  name="title"
                  value={eventData.title}
                  onChange={handleChange}
                  placeholder="Enter Name"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-[#0072bc] dark:text-white"
                />
              </div>
              <div className="w-full">
                <label className="mb-2.5 block text-black dark:text-white">
                  Date*
                </label>
                <input
                  type="date"
                  name="date"
                  value={eventData.date}
                  onChange={handleChange}
                  placeholder="Enter Date"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-[#0072bc] dark:text-white"
                />
              </div>
            </div>
            <div className="mb-4.5 grid grid-cols-1 gap-6 xl:grid-cols-2">
              <div className="w-full">
                <label className="mb-2.5 block text-black dark:text-white">
                  Start Time
                </label>
                <input
                  type="time"
                  name="start_time"
                  value={eventData.start_time}
                  onChange={handleChange}
                  placeholder="Start Time"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-[#0072bc] dark:text-white"
                />
              </div>
              <div className="w-full">
                <label className="mb-2.5 block text-black dark:text-white">
                  End Time
                </label>
                <input
                  type="time"
                  name="end_time"
                  value={eventData.end_time}
                  onChange={handleChange}
                  placeholder="End Time"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-[#0072bc] dark:text-white"
                />
              </div>
            </div>
            <div className="mb-4.5 grid grid-cols-1 gap-6 xl:grid-cols-2">
              <div className="w-full">
                <label className="mb-2.5 block text-black dark:text-white">
                  Venue*
                </label>
                <select
                  name="venue"
                  value={isOther ? "other" : eventData.venue}
                  onChange={handleVenueChange}
                  className="w-full rounded border bg-transparent py-3 px-5 outline-none transition focus:border-[#0072bc] dark:border-form-strokedark dark:bg-form-input dark:focus:border-[#0072bc]"
                >
                  {venueOptions?.map((venue) => (
                    <option key={venue} value={venue}>
                      {venue}
                    </option>
                  ))}
                  <option value="other">Other</option>
                </select>

                {isOther && (
                  <input
                    type="text"
                    name="venue"
                    value={eventData.venue}
                    placeholder="Enter venue"
                    onChange={(e) =>
                      setEventData({ ...eventData, venue: e.target.value })
                    }
                    className="w-full mt-3 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-[#0072bc] dark:text-white"
                  />
                )}
              </div>
              <div className="w-full">
                <label className="mb-2.5 block text-black dark:text-white">
                  Guest
                </label>
                <input
                  type="text"
                  name="guest"
                  value={eventData.guest}
                  onChange={handleChange}
                  placeholder="Enter Guest"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-[#0072bc] dark:text-white"
                />
              </div>
            </div>
            <div className="mb-4.5 grid grid-cols-1 gap-6 xl:grid-cols-2">
              <div className="w-full">
                <label className="mb-2.5 block text-black dark:text-white">
                  Creator*
                </label>
                <input
                  type="text"
                  name="creator"
                  value={eventData.creator}
                  onChange={handleChange}
                  placeholder="Enter Creator"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-[#0072bc] dark:text-white"
                />
              </div>{" "}
              <div className="w-full">
                <label className="mb-2.5 block text-black dark:text-white">
                  Type of Event*
                </label>
                <select
                  name="type"
                  value={eventData.type}
                  onChange={handleTypeChange}
                  className="w-full rounded border bg-transparent py-3 px-5 outline-none transition focus:border-[#0072bc] dark:border-form-strokedark dark:bg-form-input dark:focus:border-[#0072bc]"
                >
                  {typeOptions?.map((venue) => (
                    <option key={venue} value={venue}>
                      {venue}
                    </option>
                  ))}
                </select>
              </div>
            </div>{" "}
            <div className="mb-4.5 grid grid-cols-1 gap-6 xl:grid-cols-2">
              <div className="w-full">
                <label className="mb-2.5 block text-black dark:text-white">
                  Details of Event*
                </label>
                <textarea
                  rows={6}
                  name="details"
                  value={eventData.details}
                  onChange={handleChange}
                  placeholder="Enter Details"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-[#0072bc] dark:text-white"
                />
              </div>
              <div className="w-full">
                <label className="mb-2.5 block text-black dark:text-white">
                  Requisition description
                </label>
                <textarea
                  rows={6}
                  name="requisition_description"
                  value={eventData.requisition_description}
                  onChange={handleChange}
                  placeholder="Enter Description"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-[#0072bc] dark:text-white"
                />
              </div>
            </div>
            <div className="mb-4.5 grid grid-cols-1 gap-6 xl:grid-cols-2">
              <div className="w-full">
                <label className="mb-2.5 block text-black dark:text-white">
                  Upload Requisition
                </label>
                <input
                  type="file"
                  name="requisition_image"
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
              <div>
                <label className="mb-2.5 block text-black dark:text-white">
                  Select Counselors
                </label>
                <Select
                  options={isAllSelected ? [{ value: "*", label: "All" }] : counselorOptions}
                  isMulti
                  value={getSelectedValues()}
                  onChange={handleCounselorChange}
                  classNamePrefix="select"
                  styles={{
                    control: (base, { isFocused }) => ({
                      ...base,
                      padding: 6,
                      borderColor: isFocused ? "#0072bc" : "#0072bc",
                      boxShadow: isFocused ? "0 0 0 1px #0072bc" : "none",
                      "&:hover": { borderColor: "#0072bc" },
                    }),
                    multiValue: (base) => ({
                      ...base,
                      backgroundColor: "#0072bc",
                    }),
                    multiValueLabel: (base) => ({
                      ...base,
                      color: "white",
                    }),
                    multiValueRemove: (base) => ({
                      ...base,
                      color: "white",
                      "&:hover": { backgroundColor: "#822bd4", color: "white" },
                    }),
                  }}
                />
              </div>
            </div>
            <button
              type="submit"
              className="flex w-full justify-center rounded bg-[#0072bc] p-3 font-medium text-gray hover:bg-opacity-90"
            >
              {loading ? "Submitting" : eventId ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEvent;
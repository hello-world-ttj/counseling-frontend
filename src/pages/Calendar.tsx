import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import moment from "moment";
import { getCalendar } from "../api/eventApi";
import { Event } from "../types/event";

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [view, setView] = useState(false);
  const VITE_APP_FILE_URL = "https://able.iswkoman.com/images/";
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getCalendar();

        if (response?.data && Array.isArray(response.data)) {
          const formattedEvents = response.data.map((event: any) => ({
            title: event.title,
            start: moment(event.start).format("YYYY-MM-DD"),
            end: moment(event.end).format("YYYY-MM-DD"),
            allDay: true,
            extendedProps: {
              venue: event.venue,
              creator: event.creator,
              guest: event.guest,
              date: event.start,
              details: event.details,
              type: event.type,
              requisition_image: event.requisition_image,
              requisition_description: event.requisition_description,
            },
          }));
          setEvents(formattedEvents);
        } else {
          console.warn("Invalid response format from API:", response);
        }
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };

    fetchData();
  }, []);
  const handleEventClick = (clickInfo: any) => {
    setSelectedEvent(clickInfo.event.extendedProps);
    setView(true);
  };
  const handleCloseView = () => {
    setView(false);
    setSelectedEvent(null);
  };
  return (
    <div className="w-full h-auto p-4 bg-white dark:bg-boxdark shadow-md rounded-lg dark:text-white">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        height="auto"
        titleFormat={{ year: "numeric", month: "long" }}
        themeSystem="bootstrap"
        dayHeaderClassNames="bg-[#0072bc] text-white py-2 text-sm"
        displayEventTime={false}
        eventClick={handleEventClick}
      />
      {view && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 mt-16">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl p-6 relative min-h-[500px] max-h-[80vh] overflow-y-auto dark:bg-strokedark dark:text-white">
            <button
              onClick={handleCloseView}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
            >
              ✖
            </button>

            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
              {selectedEvent?.title}
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                <p className="text-gray-700 dark:text-gray-200 font-medium">
                  {moment(selectedEvent?.date).format("MMMM DD, YYYY")}
                </p>
              </div>
              {selectedEvent?.venue && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Venue
                  </p>
                  <p className="text-gray-700 dark:text-gray-200 font-medium">
                    {selectedEvent?.venue}
                  </p>
                </div>
              )}
              {selectedEvent?.type && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Type
                  </p>
                  <p className="text-gray-700 dark:text-gray-200 font-medium">
                    {selectedEvent?.type}
                  </p>
                </div>
              )}
              {selectedEvent?.creator && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Creator
                  </p>
                  <p className="text-gray-700 dark:text-gray-200 font-medium">
                    {selectedEvent?.creator}
                  </p>
                </div>
              )}
              {selectedEvent?.guest && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Guest
                  </p>
                  <p className="text-gray-700 dark:text-gray-200 font-medium">
                    {selectedEvent?.guest}
                  </p>
                </div>
              )}
            </div>

            {selectedEvent?.requisition_image && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Requisition Image
                </p>
                <div className="w-full flex justify-center items-center h-40 rounded-md overflow-hidden mt-2">
                  <img
                    src={`${
                      VITE_APP_FILE_URL 
                    }${selectedEvent?.requisition_image}`}
                    alt="Requisition"
                    className="max-w-full max-h-full object-contain rounded-lg bg-black"
                  />
                </div>
              </div>
            )}

            <div className="mt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Details
              </p>
              <p className="text-gray-700 dark:text-gray-200 font-medium">
                {selectedEvent?.details}
              </p>
            </div>
            {selectedEvent?.requisition_description && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Requisition Description
                </p>
                <p className="text-gray-700 dark:text-gray-200 font-medium">
                  {selectedEvent?.requisition_description}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;

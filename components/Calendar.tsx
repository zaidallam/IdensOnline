"use client";

import React, { useState, useEffect } from "react";
import { formatDate, DateSelectArg } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import NewAppointmentDialog, { appointmentTypes } from "./new-appointment-dialog";
import { Appointment, Car } from "@prisma/client";
import { Trash } from "lucide-react";
import { deleteAppointmentAction } from "@/app/(dashboard)/actions";

const formatAppointment = (ev: any) => {
  const appointmentType = appointmentTypes.find(type => type.value === ev.appointment_type)?.name;

  return `${ev.car.make} ${ev.car.model} - ${appointmentType}`
}

const Calendar = ({ events }: { events: (Appointment & { car: Car })[] }) => {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState<DateSelectArg | null>(
        null
    );

    const handleDateClick = (selected: DateSelectArg) => {
        setSelectedDate(selected);
        setIsDialogOpen(true);
    };

    return (
        <div>
            <div className="flex w-full px-10 justify-start items-start gap-8">
                <div className="w-3/12">
                    <div className="py-10 text-2xl font-extrabold px-7">
                        Upcoming Appointments
                    </div>
                    <ul className="space-y-4">
                        {events.length <= 0 && (
                            <div className="italic text-center text-gray-400">
                                No Events Present
                            </div>
                        )}

                        {events.length > 0 &&
                            events.map((event) => (
                                <li
                                    className="border border-gray-200 shadow px-4 py-2 rounded-md text-blue-800"
                                    key={event.id}
                                >
                                    {formatAppointment(event)}
                                    <br />
                                    <label className="text-slate-950">
                                        {formatDate(event.date!, {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}{" "}
                                    </label>
                                    <form action={deleteAppointmentAction}>
                                        <button type="submit">
                                            <Trash />
                                        </button>
                                        <input hidden name="appointment-id" value={event.id}/>
                                    </form>
                                </li>
                            ))}
                    </ul>
                </div>

                <div className="w-9/12 mt-8">
                    <FullCalendar
                        plugins={[
                            dayGridPlugin,
                            timeGridPlugin,
                            interactionPlugin,
                        ]} // Initialize calendar with required plugins.
                        headerToolbar={{
                            left: "prev,next today",
                            center: "title",
                            right: "dayGridMonth,timeGridWeek,timeGridDay",
                        }} // Set header toolbar options.
                        allDaySlot={false}
                        initialView="dayGridMonth" // Initial view mode of the calendar.
                        editable={true} // Allow events to be edited.
                        selectable={true} // Allow dates to be selectable.
                        selectMirror={true} // Mirror selections visually.
                        dayMaxEvents={true} // Limit the number of events displayed per day.
                        select={handleDateClick}
                        events={events.map((ev) => {
                            return {
                                title: `${ev.car.make} ${ev.car.model} - ${ev.appointment_type}`,
                                start: ev.date,
                                end: ev.end_date,
                                allDay: false,
                            };
                        })} // Initial events loaded from local storage.
                    />
                </div>
            </div>

            {/* Dialog for adding new events */}
            <NewAppointmentDialog
                isOpen={isDialogOpen}
                setIsOpen={setIsDialogOpen}
                selectedDate={selectedDate?.start}
                selectedEndDate={selectedDate?.end}
            />
        </div>
    );
};

export default Calendar; // Export the Calendar component for use in other parts of the application.

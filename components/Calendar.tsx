"use client";

import React, { useState, useEffect } from "react";
import {
    formatDate,
    DateSelectArg,
    EventClickArg,
    EventChangeArg,
} from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { EventDragStopArg } from "@fullcalendar/interaction";
import AppointmentDialog, { appointmentTypes } from "./appointment-dialog";
import { Appointment, Car } from "@prisma/client";
import { Loader2, Trash2 } from "lucide-react";
import {
    deleteAppointmentAction,
    updateAppointmentAction,
} from "@/app/(dashboard)/actions";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import LoadingButton from "./admin-panel/loading-button";

const formatAppointment = (appointment: any) => {
    const appointmentType = appointmentTypes.find(
        (type) => type.value === appointment.appointment_type
    )?.name;

    return `${appointment.car.make} ${appointment.car.model} -\n${appointmentType}`;
};

const Calendar = ({
    appointments,
}: {
    appointments: (Appointment & { car: Car })[];
}) => {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [selectedDateRange, setSelectedDateRange] =
        useState<DateSelectArg | null>(null);
    const [selectedAppointment, setSelectedAppointment] = useState<
        Appointment & { car: Car }
    >();

    const handleDateClick = (selected: DateSelectArg) => {
        setSelectedAppointment(undefined);
        setSelectedDateRange(selected);
        setIsDialogOpen(true);
    };

    const handleEventClick = (event: EventClickArg) => {
        const appointment = appointments.find(
            (appointment) => appointment.id === event.event.id
        );

        if (appointment) {
            openAppointmentDialog(appointment);
        }
    };

    const openAppointmentDialog = (appointment: Appointment & { car: Car }) => {
        setSelectedAppointment(appointment);
        setSelectedDateRange({
            start: appointment.date,
            end: appointment.end_date,
        } as DateSelectArg);
        setIsDialogOpen(true);
    };

    const handleEventChange = async (event: EventChangeArg) => {
        const data = new FormData();

        const appointment = appointments.find(
            (appointment) => appointment.id === event.event.id
        );

        if (appointment) {
            const durationms =
                event.event.end!.getTime() - event.event.start!.getTime();
            let duration =
                durationms / 1000 / 60 - ((durationms / 1000 / 60) % 30);
            duration = duration > 120 ? 120 : duration;

            data.append("appointment-id", appointment.id.toString());
            data.append("date", event.event.start!.toISOString());
            data.append("duration", duration + "");

            data.append("appointment-type", appointment.appointment_type);
            data.append("vin", appointment.car.vin);

            await updateAppointmentAction({}, data);
        }
    };

    return (
        <div>
            <div className="flex w-full px-10 justify-start items-start gap-8">
                <div className="w-3/12">
                    <div className="py-10 text-2xl font-extrabold px-7">
                        All Appointments
                    </div>
                    <ul className="space-y-4">
                        {appointments.length <= 0 && (
                            <div className="italic text-center text-gray-400">
                                No appointments Present
                            </div>
                        )}

                        {appointments.length > 0 &&
                            appointments.map((appointment) => (
                                <Card
                                    key={appointment.id}
                                    className="cursor-pointer hover:opacity-80 transition duration-300"
                                    onClick={() =>
                                        openAppointmentDialog(appointment)
                                    }
                                >
                                    <CardHeader>
                                        <CardTitle>
                                            {formatAppointment(appointment)}
                                        </CardTitle>
                                        <CardDescription>
                                            {appointment.car.vin.toUpperCase()}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardFooter className="flex justify-between items-end">
                                        <span className="text-slate-950 h-min">
                                            {formatDate(appointment.date!, {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </span>
                                        <form
                                            action={deleteAppointmentAction}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <LoadingButton
                                                className="px-2"
                                                iconMode={true}
                                            >
                                                <Trash2 color="white" />
                                            </LoadingButton>
                                            <input
                                                hidden
                                                readOnly
                                                name="appointment-id"
                                                value={appointment.id}
                                            />
                                        </form>
                                    </CardFooter>
                                </Card>
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
                        eventClick={handleEventClick}
                        eventChange={handleEventChange}
                        events={appointments.map((appointment) => ({
                            id: appointment.id,
                            title: formatAppointment(appointment),
                            start: appointment.date,
                            end: appointment.end_date,
                            allDay: false,
                        }))} // Initial events loaded from local storage.
                    />
                </div>
            </div>

            {/* Dialog for adding new events */}
            <AppointmentDialog
                isOpen={isDialogOpen}
                setIsOpen={setIsDialogOpen}
                selectedDate={selectedDateRange?.start}
                selectedEndDate={selectedDateRange?.end}
                appointment={selectedAppointment}
                car={selectedAppointment?.car}
            />
        </div>
    );
};

export default Calendar; // Export the Calendar component for use in other parts of the application.

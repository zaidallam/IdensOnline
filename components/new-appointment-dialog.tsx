"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createAppointmentAction } from "@/app/(dashboard)/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { DatePicker } from "./ui/date-picker";
import { TimePicker } from "./ui/time-picker";

interface NewAppointmentDialogProps {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    selectedDate?: Date;
    selectedEndDate?: Date;
}

export default function NewAppointmentDialog({
    isOpen,
    setIsOpen,
    selectedDate,
    selectedEndDate,
}: NewAppointmentDialogProps) {
    const [state, formAction] = useFormState(createAppointmentAction, {
        message: "",
        success: false,
    });

    const [date, setDate] = useState<Date | undefined>();
    const [time, setTime] = useState<string | undefined>();
    const [duration, setDuration] = useState<number>();

    useEffect(() => {
        if (!selectedDate) return;

        const hrs = selectedDate?.getHours().toString().padStart(2, "0");
        const mins = selectedDate?.getMinutes().toString().padStart(2, "0");

        setDate(selectedDate);
        setTime(`${hrs ?? "00"}:${mins ?? "00"}`);
    }, [selectedDate]);

    useEffect(() => {
        if (!selectedDate || !selectedEndDate) return;

        const durationms = selectedEndDate.getTime() - selectedDate.getTime();

        const duration =
            durationms / 1000 / 60 - ((durationms / 1000 / 60) % 30);

        setDuration(duration > 120 ? 120 : duration);
    }, [selectedDate, selectedEndDate]);

    const selectedDateTime = date ? new Date(date) : null;

    if (selectedDateTime && time) {
        const [hrs, mins] = time.split(":");
        selectedDateTime.setHours(parseInt(hrs), parseInt(mins));
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Schedule Appointment</DialogTitle>
                    <DialogDescription>
                        Please enter appointment details
                    </DialogDescription>
                </DialogHeader>
                {!state?.success ? (
                    <form action={formAction}>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="appointment-type">
                                    Appointment Type
                                </Label>
                                <Select name="appointment-type">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        <SelectItem value="detailing">
                                            Detailing
                                        </SelectItem>
                                        <SelectItem value="chiprotect">
                                            Chiprotect
                                        </SelectItem>
                                        <SelectItem value="windowFilm">
                                            Window film
                                        </SelectItem>
                                        <SelectItem value="photography">
                                            Photography
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex space-x-1.5">
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="date">Start Date</Label>
                                    <DatePicker
                                        onChange={setDate}
                                        value={date}
                                    />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="date">Time</Label>
                                    <TimePicker
                                        value={time}
                                        onChange={setTime}
                                    />
                                </div>
                                <input
                                    id="date"
                                    name="date"
                                    value={selectedDateTime?.toISOString()}
                                    hidden
                                    readOnly
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="duration">
                                    Duration (mins)
                                </Label>
                                <Select
                                    name="duration"
                                    value={duration?.toString()}
                                    onValueChange={(val) =>
                                        setDuration(parseInt(val))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        <SelectItem value="30">30</SelectItem>
                                        <SelectItem value="60">60</SelectItem>
                                        <SelectItem value="90">90</SelectItem>
                                        <SelectItem value="120">120</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="vin">Vehicle VIN</Label>
                                <Input
                                    type="text"
                                    id="vin"
                                    name="vin"
                                    maxLength={17}
                                    minLength={17}
                                />
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {state.message}
                            </p>
                        </div>
                        <DialogFooter className="flex justify-center">
                            <Button>Create Appointment</Button>
                        </DialogFooter>
                    </form>
                ) : (
                    "Success"
                )}
            </DialogContent>
        </Dialog>
    );
}

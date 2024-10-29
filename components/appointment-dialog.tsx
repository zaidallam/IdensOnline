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
import {
    createAppointmentAction,
    updateAppointmentAction,
} from "@/app/(dashboard)/actions";
import { useFormState } from "react-dom";
import {
    ChangeEvent,
    Dispatch,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { DatePicker } from "./ui/date-picker";
import { TimePicker } from "./ui/time-picker";
import LoadingButton from "./admin-panel/loading-button";
import { Appointment, Car } from "@prisma/client";
import { CalendarCheck2 } from "lucide-react";

interface AppointmentDialogProps {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    selectedDate?: Date;
    selectedEndDate?: Date;
    appointment?: Appointment;
    car?: Car;
}

export const appointmentTypes = [
    {
        name: "Detailing",
        value: "detailing",
    },
    {
        name: "Chiprotect",
        value: "chiprotect",
    },
    {
        name: "Window Film",
        value: "windowFilm",
    },
    {
        name: "Photography",
        value: "photography",
    },
];

export default function AppointmentDialog({
    isOpen,
    setIsOpen,
    selectedDate,
    selectedEndDate,
    appointment,
    car,
}: AppointmentDialogProps) {
    const isEdit = !!appointment;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? "Update " : "Schedule "}Appointment
                    </DialogTitle>
                    <DialogDescription>
                        Please {isEdit ? "modify " : "enter "}appointment
                        details
                    </DialogDescription>
                </DialogHeader>
                <AppointmentForm
                    selectedDate={selectedDate}
                    selectedEndDate={selectedEndDate}
                    appointment={appointment}
                    car={car}
                    isEdit={isEdit}
                />
            </DialogContent>
        </Dialog>
    );
}

interface AppointmentFormProps {
    selectedDate?: Date;
    selectedEndDate?: Date;
    appointment?: Appointment;
    car?: Car;
    isEdit?: boolean;
}

const AppointmentForm = ({
    selectedDate,
    selectedEndDate,
    appointment,
    car,
    isEdit,
}: AppointmentFormProps) => {
    const [state, formAction] = useFormState(
        isEdit ? updateAppointmentAction : createAppointmentAction,
        {
            message: "",
            success: false,
        }
    );

    const [date, setDate] = useState<Date | undefined>(selectedDate);
    const [time, setTime] = useState<string | undefined>(() => {
        if (selectedDate) {
            const hrs = selectedDate?.getHours().toString().padStart(2, "0");
            const mins = selectedDate?.getMinutes().toString().padStart(2, "0");

            return `${hrs}:${mins}`;
        }
    });
    const [duration, setDuration] = useState<number>(() => {
        if (selectedEndDate && selectedDate) {
            const durationms =
                selectedEndDate.getTime() - selectedDate.getTime();
            const duration =
                durationms / 1000 / 60 - ((durationms / 1000 / 60) % 30);

            return duration > 120 ? 120 : duration;
        }

        return 30;
    });
    const [vin, setVin] = useState<string>(car?.vin.toUpperCase() ?? "");

    const [loadingCarDetails, setLoadingCarDetails] = useState<boolean>(false);
    const [carDetails, setCarDetails] = useState<any | null>(null);

    const handleVinLookup = (e: ChangeEvent<HTMLInputElement>) => {
        setVin(e.target.value);

        if (e.target.value?.length == 17) {
            setLoadingCarDetails(true);

            fetch("/api/car/details?vin=" + e.target.value)
                .then((res) => res.json())
                .then((json) => setCarDetails(json))
                .then((_) => setLoadingCarDetails(false))
                .catch((_) => setLoadingCarDetails(false));
        } else {
            setCarDetails(null);
        }
    };

    const selectedDateTime = new Date(
        date?.toISOString().split("T")[0] + "T" + time
    );

    return state.success ? (
        <div className="flex flex-col items-center">
            <CalendarCheck2 className="h-32 w-32" />
            <p className="leading-7 [&:not(:first-child)]:mt-6 text-center">
                Your appointment has been successfully{" "}
                {isEdit ? "modified" : "saved"}.
            </p>
        </div>
    ) : (
        <form action={formAction}>
            <input hidden name="appointment-id" value={appointment?.id} />
            <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="appointment-type">Appointment Type</Label>
                    <Select
                        name="appointment-type"
                        defaultValue={appointment?.appointment_type}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                            {appointmentTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                    {type.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex space-x-1.5">
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="date">Start Date</Label>
                        <DatePicker onChange={setDate} value={date} />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="date">Time</Label>
                        <TimePicker value={time} onChange={setTime} />
                    </div>
                    <input
                        id="date"
                        name="date"
                        value={selectedDateTime?.toISOString()}
                        hidden
                        readOnly
                        defaultValue={selectedDateTime?.toISOString()}
                    />
                </div>
                <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="duration">Duration (mins)</Label>
                    <Select
                        name="duration"
                        value={duration?.toString()}
                        onValueChange={(val) => setDuration(parseInt(val))}
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
                        onChange={handleVinLookup}
                        value={vin}
                        disabled={loadingCarDetails}
                    />
                    <Input
                        disabled
                        value={carDetails?.make ?? car?.make ?? undefined}
                        placeholder="Make"
                        readOnly
                    />
                    <Input
                        disabled
                        value={carDetails?.model ?? car?.model ?? undefined}
                        placeholder="Model"
                        readOnly
                    />
                    <Input
                        disabled
                        value={carDetails?.year ?? car?.year ?? undefined}
                        placeholder="Year"
                        readOnly
                    />
                </div>
                <p className="text-sm text-muted-foreground">{state.message}</p>
            </div>
            <DialogFooter className="flex justify-center">
                <LoadingButton isLoading={loadingCarDetails}>
                    {isEdit ? "Update " : "Create "} Appointment
                </LoadingButton>
            </DialogFooter>
        </form>
    );
};

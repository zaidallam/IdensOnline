"use server";

import { auth, signOut } from "@/auth";
import db from "@/lib/db";
import { getCarDetailsByVin } from "@/lib/vin-search";
import { redirect } from "next/navigation";

export const createAppointmentAction = async (
    prevState: any,
    formData: FormData
) => {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        redirect("/sign-in");
    }

    const {
        "appointment-type": appointmentType,
        date: dateStr,
        duration,
        vin,
        ...fields
    } = Object.fromEntries(formData.entries());

    if (!appointmentType || !dateStr || !vin) {
        return {
            success: false,
            message: "Please complete the form.",
        };
    }

    const date = new Date(dateStr.toString());
    const endDate = new Date(
        date.getTime() + parseInt(duration.toString()) * 60 * 1000
    );

    if (date > endDate) {
        return {
            success: false,
            message: "End date and time must be after start date and time.",
        };
    }

    let car = await db.car.findUnique({
        where: {
            vin: vin.toString().toLowerCase(),
        },
    });

    if (!car) {
        let carDetails = await getCarDetailsByVin(vin.toString());

        car = await db.car.create({
            data: {
                vin: vin.toString(),
                make: carDetails.manufacturer,
                model: carDetails.model,
                year: parseInt(carDetails.year),
            },
        });
    }

    let appointment = await db.appointment.create({
        data: {
            appointment_type: appointmentType.toString(),
            date: date,
            end_date: endDate,
            car_id: car.id,
            user_id: userId,
            is_cancelled: false,
        },
    });

    return {
        success: true,
        message: "",
    };
};

export const signOutAction = async () => {
    await signOut({ redirect: false });

    redirect("/sign-in");
};

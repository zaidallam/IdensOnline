import db from "@/lib/db";
import { getCarDetailsByVin } from "@/lib/vin-search";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const vin = req.nextUrl.searchParams.get("vin") ?? "";

    if (!vin) {
        return NextResponse.json({}, { status: 404 });
    }

    let car = await db.car.findUnique({
        where: {
            vin: vin.toString().toLowerCase(),
        },
    });

    if (!car) {
        let carDetails = await getCarDetailsByVin(vin.toString());

        if (carDetails?.manufacturer) {
            car = await db.car.create({
                data: {
                    vin: vin.toString().toLowerCase(),
                    make: carDetails.manufacturer,
                    model: carDetails.model,
                    year: parseInt(carDetails.year),
                },
            });
        }
    }

    if (!car) {
        return NextResponse.json({}, { status: 404 });
    }

    return NextResponse.json(car);
}

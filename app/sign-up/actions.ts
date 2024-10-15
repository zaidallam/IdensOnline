"use server";

import { saltAndHashPassword } from "@/lib/crypto";
import db from "@/lib/db";
import { redirect } from "next/navigation";

export const signUpAction = async (prevState: any, formData: FormData) => {
    const email = formData.get("email")?.toString() ?? "";
    const password = formData.get("password")?.toString() ?? "";

    const hashedPassword = await saltAndHashPassword(password);

    const user = await db.user.findUnique({
        where: {
            email: email,
        },
    });

    if (user) {
        return {
            message: "User already exists",
        };
    }

    await db.user.create({
        data: {
            email: email,
            password_hash: hashedPassword,
        },
    });

    redirect("sign-in");
};
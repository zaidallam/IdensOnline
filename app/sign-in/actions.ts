"use server";

import { signIn } from "@/auth";
import { redirect } from "next/navigation";

export const signInAction = async (prevState: any, formData: FormData) => {
    const email = formData.get("email")?.toString() ?? "";
    const password = formData.get("password")?.toString() ?? "";

    try {
        await signIn("credentials", { email, password, redirect: false });
    } catch (error: any) {
        switch (error.type) {
            case "CredentialsSignin":
                return {
                    message: "Invalid credentials",
                };
            default:
                return {
                    message: "Something went wrong",
                };
        }
    }

    redirect("/");
};

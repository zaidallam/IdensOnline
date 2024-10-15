"use server";

import { signOut } from "@/auth";
import { redirect } from "next/navigation";

export const signOutAction = async () => {
    await signOut({ redirect: false });

    redirect("/sign-in");
};

import { signOut } from "@/auth";
import { redirect } from "next/navigation";

export default function SignOutButton() {
    return (
        <form
            action={async () => {
                "use server";

                await signOut({ redirect: false });

                redirect("/sign-in");
            }}
        >
            <button>Sign Out</button>
        </form>
    );
}

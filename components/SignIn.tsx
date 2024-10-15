import { signIn } from "@/auth";
import { redirect } from "next/navigation";

export default function SignIn() {
    return (
        <form
            action={async (formData) => {
                "use server";

                const email = formData.get("email")?.toString() ?? "";
                const password = formData.get("password")?.toString() ?? "";

                try {
                    await signIn("credentials", { email, password, redirect: false });
                } catch (error: any) {
                    switch (error.type) {
                        case "CredentialsSignin":
                            return {
                                msg: "Invalid credentials",
                                status: "error",
                            };
                        default:
                            return {
                                msg: "Something went wrong",
                                status: "error",
                            };
                    }
                }

                redirect("/");
            }}
        >
            <label>
                Email
                <input name="email" type="email" />
            </label>
            <label>
                Password
                <input name="password" type="password" />
            </label>
            <button>Sign In</button>
        </form>
    );
}

import { saltAndHashPassword } from "@/lib/crypto";
import db from "@/lib/db";
import { redirect } from "next/navigation";

export default function SignUp() {
  return (
    <form
      action={async (formData) => {
        "use server"

        const email = formData.get("email")?.toString() ?? "";
        const password = formData.get("password")?.toString() ?? "";
        
        const hashedPassword = await saltAndHashPassword(password);

        const user = await db.user.findUnique({
            where: {
                email: email
            }
        });

        if (user) {
            return 
        }

        await db.user.create({
            data: {
                email: email,
                password_hash: hashedPassword
            }
        });

        redirect("sign-in");
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
      <button>Sign Up</button>
    </form>
  )
}
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { comparePassword, saltAndHashPassword } from "./lib/crypto";
import db from "./lib/db";
import { signInSchema } from "./lib/zod";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials) => {
                if (!credentials?.password || !credentials?.email) {
                    return null;
                }

                const { email, password } = await signInSchema.parseAsync(
                    credentials
                );

                const user = await db.user.findUnique({
                    where: {
                        email: email.toLowerCase(),
                    },
                });

				const isPasswordCorrect = await comparePassword(password, user?.password_hash ?? "");

                if (!user || !isPasswordCorrect) {
                    return null;
                }

                return user;
            },
        }),
    ],
    callbacks: {
        authorized: async ({ auth }) => {
            return !!auth;
        },
    },
});
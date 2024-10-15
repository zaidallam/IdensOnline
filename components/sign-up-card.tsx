"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useFormState } from "react-dom";
import { signUpAction } from "@/app/sign-up/actions";

export default function SignUpCard() {
    const [state, formAction] = useFormState(signUpAction, { message: "" });

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Welcome to Idens Online</CardTitle>
                <CardDescription>Please sign up</CardDescription>
            </CardHeader>
            <form action={formAction}>
                <CardContent>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                            />
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {state.message}
                        </p>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button>Sign Up</Button>
                </CardFooter>
            </form>
        </Card>
    );
}

"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInAction } from "@/app/sign-in/actions";
import { useFormState } from "react-dom";

export default function SignInCard() {
    const [state, formAction] = useFormState(signInAction, { message: "" });

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Welcome to Idens Online</CardTitle>
                <CardDescription>Please sign in</CardDescription>
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
                    <Button>Sign In</Button>
                </CardFooter>
            </form>
        </Card>
    );
}

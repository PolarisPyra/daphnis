"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

import { toast } from "@/components/ui/use-toast";
import { signIn } from "./action";

export default function SignInForm() {
  const submit = async (data: FormData) => {
    const { error } = await signIn(data);
    if (error) {
      toast({
        title: "Error",
        description: error,
      });
    } else {
      toast({
        title: "Success",
        description: "Account created successfully",
      });
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Sign in</CardTitle>
        <CardDescription>
          Enter your info below to login your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={submit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              name="username"
              type="text"
              placeholder="username"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              name="password"
              type="password"
              placeholder="********"
              required
            />
          </div>
          <Link
            href="/forgot-password"
            className="ml-auto inline-block text-sm underline"
          >
            Forgot your password?
          </Link>

          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Need an account?{" "}
          <Link href="/signup" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
export { SignInForm };

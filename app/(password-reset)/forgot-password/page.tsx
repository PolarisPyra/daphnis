"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeftSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmailPasswordResetLink } from "./emailforgotpassword";

export default function ForgotPassword() {
  const [error, setError] = useState<string>("");

  const submit = async (data: FormData) => {
    const { error } = await EmailPasswordResetLink(data);
    setError(error);
  };

  return (
    <main className="mx-auto flex h-screen max-w-xl flex-col justify-center px-4">
      <Card className="flex flex-col gap-4 p-6">
        <form action={submit} className="flex flex-col gap-4">
          <h1 className="text-2xl font-light">Reset password</h1>
          <p>
            Enter your email address to get instructions for resetting your
            password.
          </p>
          <Input name="email" type="email" placeholder="Your email..." />
          {error && <p className="text-red-500">{error}</p>}
          <Button type="submit">Reset Password</Button>
          <Link href="/" className="flex items-center text-sm">
            <ArrowLeftSquare />
            <span className="pl-2">Return to Login</span>
          </Link>
        </form>
      </Card>
    </main>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { resetPassword } from "./token";

export default function SharePage({ params }: { params: { token: string } }) {
  const [error, setError] = useState<string>("");

  async function submit(data: FormData) {
    const { error } = await resetPassword(params.token, data);
    setError(error || "");
  }

  return (
    <main className="mx-auto flex h-screen max-w-xl flex-col justify-center px-4">
      <Card className="flex flex-col gap-4 p-6">
        <form action={submit} className="flex flex-col gap-4">
          {" "}
          <h1 className="text-2xl font-light">Choose a new password</h1>
          <p>You can reset your password here.</p>
          <Input name="password" type="password" placeholder="Password" />
          <Input
            name="confirm"
            type="password"
            placeholder="Confirm password"
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit">Reset Password</Button>
          <Link
            href="/"
            className="flex items-center text-sm text-neutral-700/80"
          >
            <ArrowLeft />
            <span>Return to Login</span>
          </Link>
        </form>
      </Card>
    </main>
  );
}

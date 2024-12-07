"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default async function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push("/"); // Redirect to login page
    }, 5000);
  });

  return (
    <main className="max-w-xl px-4 mx-auto flex flex-col justify-center h-screen">
      <Card className="gap-4 flex flex-col p-6">
        <h1 className="text-2xl font-light">Your password has been updated.</h1>
        <p>
          You will now be redirected to the login page where you can login
          again.
        </p>
        <Button type="submit" asChild>
          <Link href="/">Return to Login</Link>
        </Button>
      </Card>
    </main>
  );
}

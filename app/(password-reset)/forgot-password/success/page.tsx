import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default async function SuccessPage() {
  return (
    <main className="mx-auto flex h-screen max-w-xl flex-col justify-center px-4">
      <Card className="flex flex-col gap-4 p-6">
        <h1 className="mb-4 text-2xl font-light">Password reset</h1>
        <p className="mb-4">
          If the email doesn&apos;t show up, check your spam folder.
        </p>
        <Button type="submit" asChild className="mt-4">
          <Link href="/">Return to Login</Link>
        </Button>
      </Card>
    </main>
  );
}

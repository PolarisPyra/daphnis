import { getAuth } from "@/auth/queries/getauth";
import { redirect } from "next/navigation";
import AdminSubNavigation from "../../../components/navigationbar/adminnavigation";
import SettingsSubMenuNavigation from "../../../components/navigationbar/settingsnavigation";

export default async function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await getAuth();

  if (!user) {
    redirect("/");
  }

    return (
      <>
        <main className="flex min-h-[calc(100vh-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
          <div className="mx-auto grid w-full max-w-6xl gap-2">
            <h1 className="text-2xl font-semibold">Settings</h1>
          </div>
          <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
            <SettingsSubMenuNavigation />

            {children}
          </div>
        </main>
      </>
    );
  
}

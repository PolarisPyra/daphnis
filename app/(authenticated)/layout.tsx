import { getAuth } from "@/auth/queries/getauth";
import { redirect } from "next/navigation";
import HeaderNavigation from "../../components/navigationbar/navigationbar";

export default async function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await getAuth();

  if (!user) {
    console.log("you need to be signed in");
    redirect("/");
  }

  return (
    <>
      <HeaderNavigation />

      {children}
    </>
  );
}

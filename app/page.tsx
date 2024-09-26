import { SignInForm } from "@/auth/components/signin/signin";
import { getAuth } from "@/auth/queries/getauth";
import { redirect } from "next/navigation";

const PublicHomePage = async () => {
  const { user } = await getAuth();

  if (user) {
    redirect("/home");
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <SignInForm />
    </div>
  );
};

export default PublicHomePage;

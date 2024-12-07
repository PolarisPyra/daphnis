"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Argon2id } from "oslo/password";
import { lucia } from "@/lib/lucia";
import { daphnis } from "@/lib/prisma";

const signIn = async (formData: FormData) => {
  const formDataRaw = {
    username: formData.get("username") as string,
    password: formData.get("password") as string,
  };

  try {
    const user = await daphnis.user.findUnique({
      where: { username: formDataRaw.username },
    });

    if (!user) {
      return { error: "Your username or password is incorrect." };
    }

    const validPassword = await new Argon2id().verify(
      user.hashedPassword,
      formDataRaw.password,
    );

    if (!validPassword) {
      return { error: "Your username or password is incorrect." };
    }

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
  } catch (error: any) {
    return { error: "Sign-in failed: " + error.message };
  }
  redirect("/home");
};

export { signIn };

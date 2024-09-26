"use server";

import { daphnis } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Argon2id } from "oslo/password";

export async function resetPassword(token: string, data: FormData) {
  const password = data.get("password");
  const confirmPassword = data.get("confirm");

  if (
    !password ||
    typeof password !== "string" ||
    password !== confirmPassword
  ) {
    return {
      error:
        "The passwords did not match. Please try retyping them and submitting again.",
    };
  }

  const passwordResetToken = await daphnis.passwordResetToken.findUnique({
    where: {
      token,
      createdAt: { gt: new Date(Date.now() - 1000 * 60 * 60 * 4) },
      resetAt: null,
    },
  });

  if (!passwordResetToken) {
    return {
      error:
        "Invalid token reset request. Please try resetting your password again.",
    };
  }

  const argon2 = new Argon2id();
  const encrypted = await argon2.hash(password);

  const updateUser = daphnis.user.update({
    where: { id: passwordResetToken.userId },
    data: {
      hashedPassword: encrypted,
    },
  });

  const updateToken = daphnis.passwordResetToken.update({
    where: {
      id: passwordResetToken.id,
    },
    data: {
      resetAt: new Date(),
    },
  });

  try {
    await daphnis.$transaction([updateUser, updateToken]);
  } catch (err) {
    console.error(err);
    return {
      error:
        "An unexpected error occurred. Please try again and if the problem persists, contact support.",
    };
  }

  redirect("/password-reset/success");
}

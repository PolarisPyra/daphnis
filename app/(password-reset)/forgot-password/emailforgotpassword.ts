"use server";

import { daphnis } from "@/lib/prisma";
import { randomUUID } from "crypto";
import { redirect } from "next/navigation";
import { Resend } from "resend";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);
const DOMAIN = process.env.DOMAIN || "localhost:3000";
const PROTOCOL = process.env.NODE_ENV === "production" ? "https" : "http";
const EMAIL = process.env.EMAIL || "<security@resend.dev>";

const sendEmail = async (email: string, token: string, userName: string) => {
  try {
    const { data } = await resend.emails.send({
      from: `Password Reset ${EMAIL}`,
      to: [email],
      subject: "Reset Password Request",
      text: `Hello ${userName}, someone (hopefully you) requested a password reset for this account. If you did want to reset your password, please click here: ${PROTOCOL}://${DOMAIN}/password-reset/${token}

For security reasons, this link is only valid for four hours.
    
If you did not request this reset, please ignore this email.`,
    });

    console.log("Email sent successfully:", data);
    // Handle success
  } catch (error) {
    console.error("Error sending email:", error);
    // Handle error
    throw error;
  }
};

export async function EmailPasswordResetLink(data: FormData) {
  const email = data.get("email");
  if (!email || typeof email !== "string") {
    return {
      error: "Invalid email",
    };
  }

  const user = await daphnis.user.findUnique({
    where: { email },
  });

  if (!user) {
    return {
      error: "This email is not registered",
    };
  }

  const token = await daphnis.password_reset_token.create({
    data: {
      id: randomUUID(),
      userId: user.id,
      token: `${randomUUID()}${randomUUID()}`.replace(/-/g, ""),
    },
  });

  await sendEmail(user.email, token.token, user.username);
  redirect("/forgot-password/success");
}

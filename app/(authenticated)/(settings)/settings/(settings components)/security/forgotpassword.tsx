"use server";

import { getAuth } from "@/auth/queries/getauth";
import { daphnis } from "@/lib/prisma";
import { Argon2id } from "oslo/password";

export const updatePassword = async (
  currentPassword: string,
  newPassword: string,
  confirmNewPassword: string
) => {
  // Check if new passwords match
  if (newPassword !== confirmNewPassword) {
    return { error: "New passwords do not match" };
  }

  const { user } = await getAuth();

  if (!user) {
    return { error: "User not authenticated" };
  }

  try {
    // Fetch user from database
    const existingUser = await daphnis.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!existingUser) {
      return { error: "User not found" };
    }

    // Verify current password
    const isPasswordValid = await new Argon2id().verify(
      existingUser.hashedPassword,
      currentPassword
    );

    if (!isPasswordValid) {
      return { error: "Current password is incorrect" };
    }

    // Hash new password
    const hashedPassword = await new Argon2id().hash(newPassword);

    // Update user's password
    await daphnis.user.update({
      where: {
        id: user.id,
      },
      data: {
        hashedPassword,
      },
    });

    return { success: "Password updated successfully" };
  } catch (error: any) {
    return { error: `Failed to update password: ${  error.message}` };
  }
};

"use server";

import { getAuth } from "@/auth/queries/getauth";
import { daphnis } from "@/lib/prisma";
import { Argon2id } from "oslo/password";

export const InApplicationPasswordReset = async (
  currentPassword: string,
  newPassword: string,
  confirmNewPassword: string
) => {
  // Check if new passwords match
  if (newPassword !== confirmNewPassword) {
    throw new Error("New passwords do not match");
  }

  const { user } = await getAuth();

  if (!user) {
    throw new Error("User not authenticated");
  }

  try {
    // Fetch user from database
    const existingUser = await daphnis.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!existingUser) {
      throw new Error("User not found");
    }

    // Verify current password
    const isPasswordValid = await new Argon2id().verify(
      existingUser.hashedPassword,
      currentPassword
    );

    if (!isPasswordValid) {
      throw new Error("Current password is incorrect");
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
  } catch (error) {
    throw new Error("Failed to update password");
  }
};

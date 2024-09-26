"use server";

import { getAuth } from "@/auth/queries/getauth";
import { artemis } from "@/lib/prisma";
import { daphnis } from "@/lib/prisma";

export const LinkAimeCard = async (formData: FormData) => {
  const { user } = await getAuth();

  const formDataRaw = {
    accessCode: formData.get("accessCode") as string,
  };

  try {
    // Check if access code is already used by another user in daphnis database
    const existingUserWithAccessCode = await daphnis.user.findFirst({
      where: {
        accessCode: formDataRaw.accessCode,
        id: {
          not: user?.id,
        },
      },
    });

    if (existingUserWithAccessCode) {
      throw new Error("Access Code is already used by another user");
    }

    // Check if access code exists in artemis database
    const existingAccessCode = await artemis.aime_card.findFirst({
      where: {
        access_code: formDataRaw.accessCode,
      },
    });

    if (!existingAccessCode) {
      throw new Error("Not in artemis's database, Nice try ^_^");
    }

    const userHoldsAccessCode = await daphnis.user.findFirst({
      where: {
        accessCode: formDataRaw.accessCode,
      },
    });

    if (userHoldsAccessCode) {
      throw new Error("You are currently holding this access code");
    }

    // Update current user's access code
    await daphnis.user.update({
      where: {
        id: user?.id,
      },
      data: {
        accessCode: formDataRaw.accessCode,
      },
    });
    return { success: true }; // return success if aime card linked
  } catch (error: any) {
    throw error;
  }
};

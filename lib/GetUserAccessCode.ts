"use server";

import { getAuth } from "@/auth/queries/getauth";
import { daphnis } from "@/lib/prisma";

export async function getDaphnisInUseCards() {
  const { user } = await getAuth();

  if (!user || !user.accessCode) {
    throw new Error("User is not authenticated or accessCode is missing");
  }

  const aimeUser = await daphnis.user.findFirst({
    where: {
      accessCode: user.accessCode,
    },
  });
  return aimeUser;
}

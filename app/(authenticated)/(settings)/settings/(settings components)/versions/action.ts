"use server";

import { getAuth } from "@/auth/queries/getauth";
import { daphnis } from "@/lib/prisma";
import { GameVersion } from "@/prisma/schemas/daphnis/generated/daphnis";

export async function getGameList() {
  const { user } = await getAuth();

  if (!user || !user.accessCode) {
    throw new Error("User is not authenticated or accessCode is missing");
  }

  const currentGameVersion = await daphnis.user.findMany({
    where: {
      UserId: user.UserId,
    },
    select: {
      gameVersion: true,
    },
  });
  return currentGameVersion;
}

export async function updatePlayerGameVersionChuni(gameVersion?: GameVersion) {
  const { user } = await getAuth();

  if (!user || !user.accessCode) {
    throw new Error("User is not authenticated or accessCode is missing");
  }

  if (gameVersion === undefined) {
    throw new Error("gameVersion is required");
  }

  try {
    const updatedUser = await daphnis.user.update({
      where: {
        UserId: user.UserId,
      },
      data: {
        gameVersion,
      },
      select: {
        gameVersion: true,
      },
    });

    return { gameVersion: updatedUser.gameVersion };
  } catch (error) {
    console.error("Error updating game version:", error);
    throw error;
  }
}

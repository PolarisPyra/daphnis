"use server";

import { getAuth } from "@/auth/queries/getauth";
import { getSupportedVersionNumber } from "@/lib/api";
import { artemis, daphnis } from "@/lib/prisma";

export async function getCurrentTrophies() {
  const { user } = await getAuth();
  const supportedVersionNumber = await getSupportedVersionNumber();

  if (!user || !user.accessCode) {
    throw new Error("User is not authenticated or accessCode is missing");
  }

  const CurrentTrophy = await artemis.chuni_profile_data.findMany({
    where: {
      user: user.UserId,
      version: supportedVersionNumber,
    },
    select: {
      trophyId: true,
    },
  });
  return CurrentTrophy;
}

export async function updatePlayerTrophy(trophyId: number) {
  const { user } = await getAuth();
  const supportedVersionNumber = await getSupportedVersionNumber();

  if (!user || !user.accessCode) {
    throw new Error("User is not authenticated or accessCode is missing");
  }

  if (trophyId === undefined) {
    throw new Error("trophy is required");
  }

  try {
    const updatePlayerTrophies = await artemis.chuni_profile_data.update({
      where: {
        user_version: {
          user: user.UserId,
          version: supportedVersionNumber,
        },
      },
      data: {
        trophyId,
      },
    });

    return updatePlayerTrophies;
  } catch (error) {
    console.error("Error updating trophy:", error);
    throw error;
  }
}

export async function getTrophies() {
  const { user } = await getAuth();

  if (!user || !user.accessCode) {
    throw new Error("User is not authenticated or accessCode is missing");
  }

  const checkIfTrophyIsUnlocked = await artemis.chuni_item_item.findMany({
    where: {
      itemKind: 3,
      user: user.UserId,
    },
    select: {
      itemId: true,
    },
  });

  const unlockedTrophies = checkIfTrophyIsUnlocked.map((item) => item.itemId);

  const AllTrophies = await daphnis.chuni_static_trophies.findMany({
    select: {
      netOpenName: true,
      id: true,
      str: true,
      rareType: true,
    },
  });

  const currentlyUnlockedTrophy = Array.from(
    new Map(
      AllTrophies.filter((matchingTrophyId) =>
        unlockedTrophies.includes(matchingTrophyId.id),
      ).map((unlockedTrophyIds) => [unlockedTrophyIds.id, unlockedTrophyIds]),
    ).values(),
  );

  return currentlyUnlockedTrophy;
}

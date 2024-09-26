"use server";

import { getAuth } from "@/auth/queries/getauth";
import { getSupportedVersionNumber } from "@/lib/api";
import { artemis } from "@/lib/prisma";

export async function getCurrentNameplate() {
  const { user } = await getAuth();
  const supportedVersionNumber = await getSupportedVersionNumber();

  if (!user || !user.accessCode) {
    throw new Error("User is not authenticated or accessCode is missing");
  }

  const currentNameplate = await artemis.chuni_profile_data.findMany({
    where: {
      user: user.UserId,
      version: supportedVersionNumber,
    },
    select: {
      nameplateId: true,
    },
  });
  return currentNameplate;
}

export async function updatePlayerNamePlate(nameplateId?: number) {
  const { user } = await getAuth();
  const supportedVersionNumber = await getSupportedVersionNumber();

  if (!user || !user.accessCode) {
    throw new Error("User is not authenticated or accessCode is missing");
  }

  if (nameplateId === undefined) {
    throw new Error("nameplateId is required");
  }

  try {
    const updatePlayerNameplate = await artemis.chuni_profile_data.update({
      where: {
        user_version: {
          user: user.UserId,
          version: supportedVersionNumber,
        },
      },
      data: {
        nameplateId,
      },
    });

    return updatePlayerNameplate;
  } catch (error) {
    console.error("Error updating nameplate:", error);
    throw error;
  }
}

export async function getNamePlates() {
  const { user } = await getAuth();

  if (!user || !user.accessCode) {
    throw new Error("User is not authenticated or accessCode is missing");
  }

  const checkIfNamePlatetIsUnlocked = await artemis.chuni_item_item.findMany({
    where: {
      itemKind: 1,
      user: user.UserId,
    },
    select: {
      itemId: true,
    },
  });

  const unlockedNamePlates = checkIfNamePlatetIsUnlocked.map(
    (item) => item.itemId,
  );

  const AllNameplates = await artemis.cozynet_chuni_static_nameplate.findMany({
    select: {
      id: true,
      str: true,
      sortName: true,
      category: true,
      imagePath: true,
      rareType: true,
      netOpenName: true,
    },
  });

  const currentlyUnlockedNamePlates = Array.from(
    new Map(
      AllNameplates.filter((matchingNamePlateIds) =>
        unlockedNamePlates.includes(matchingNamePlateIds.id),
      ).map((unlockedNamePlateIds) => [
        unlockedNamePlateIds.id,
        unlockedNamePlateIds,
      ]),
    ).values(),
  );

  return currentlyUnlockedNamePlates;
}

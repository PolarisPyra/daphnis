"use server";

import { getAuth } from "@/auth/queries/getauth";
import { getSupportedVersionNumber } from "@/lib/api";
import { artemis } from "@/lib/prisma";

export async function getCurrentMapIcon() {
  const { user } = await getAuth();
  const supportedVersionNumber = await getSupportedVersionNumber();

  if (!user || !user.accessCode) {
    throw new Error("User is not authenticated or accessCode is missing");
  }

  const currentMapIcon = await artemis.chuni_profile_data.findMany({
    where: {
      user: user.UserId,
      version: supportedVersionNumber,
    },
    select: {
      mapIconId: true,
    },
  });
  return currentMapIcon;
}

export async function updatePlayerMapIcon(mapIconId?: number) {
  const { user } = await getAuth();
  const supportedVersionNumber = await getSupportedVersionNumber();

  if (!user || !user.accessCode) {
    throw new Error("User is not authenticated or accessCode is missing");
  }

  if (mapIconId === undefined) {
    throw new Error("map icon is required");
  }

  try {
    const updatePlayerMapIconId = await artemis.chuni_profile_data.update({
      where: {
        user_version: {
          user: user.UserId,
          version: supportedVersionNumber,
        },
      },
      data: {
        mapIconId,
      },
    });

    return updatePlayerMapIconId;
  } catch (error) {
    console.error("Error updating map icon:", error);
    throw error;
  }
}

export async function getMapIcons() {
  const { user } = await getAuth();

  if (!user || !user.accessCode) {
    throw new Error("User is not authenticated or accessCode is missing");
  }

  const checkIfMapIconIsUnlocked = await artemis.chuni_item_item.findMany({
    where: {
      itemKind: 8,
      user: user.UserId,
    },
    select: {
      itemId: true,
    },
  });

  const unlockedMapIcons = checkIfMapIconIsUnlocked.map((item) => item.itemId);

  const AllMapIcons = await artemis.cozynet_chuni_static_mapicon.findMany({
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

  const currentlyUnlockedMapIcons = Array.from(
    new Map(
      AllMapIcons.filter((matchingMapIconIds) =>
        unlockedMapIcons.includes(matchingMapIconIds.id),
      ).map((unlockedMapIconIds) => [
        unlockedMapIconIds.id,
        unlockedMapIconIds,
      ]),
    ).values(),
  );

  return currentlyUnlockedMapIcons;
}

"use server";

import { getAuth } from "@/auth/queries/getauth";
import { getSupportedVersionNumber } from "@/lib/api";
import { artemis } from "@/lib/prisma";

export async function getCurrentAvatarParts() {
  const { user } = await getAuth();
  const supportedVersionNumber = await getSupportedVersionNumber();

  if (!user || !user.accessCode) {
    throw new Error("User is not authenticated or accessCode is missing");
  }

  const CurrentAvatarParts = await artemis.chuni_profile_data.findMany({
    where: {
      user: user.UserId,
      version: supportedVersionNumber, // TODO: eventually change this so the user can set their own version
    },
    select: {
      avatarSkin: true,
      avatarBack: true,
      avatarFace: true,
      avatarFront: true,
      avatarHead: true,
      avatarItem: true,
      avatarWear: true,
    },
  });
  return CurrentAvatarParts;
}
export async function updateAvatarParts(
  avatarHead?: number,
  avatarFace?: number,
  avatarBack?: number,
  avatarWear?: number,
  avatarItem?: number,
) {
  const { user } = await getAuth();
  const supportedVersionNumber = await getSupportedVersionNumber();

  if (!user || !user.accessCode) {
    throw new Error("User is not authenticated or accessCode is missing");
  }

  try {
    // only including the values that aren't undefined i.e 0
    const avatarPartData: any = {};
    if (avatarHead !== undefined) avatarPartData.avatarHead = avatarHead;
    if (avatarFace !== undefined) avatarPartData.avatarFace = avatarFace;
    if (avatarBack !== undefined) avatarPartData.avatarBack = avatarBack;
    if (avatarWear !== undefined) avatarPartData.avatarWear = avatarWear;
    if (avatarItem !== undefined) avatarPartData.avatarItem = avatarItem;

    const updateAvatarParts = await artemis.chuni_profile_data.update({
      where: {
        user_version: {
          user: user.UserId,
          version: supportedVersionNumber,
        },
      },
      data: avatarPartData,
    });

    return updateAvatarParts;
  } catch (error) {
    console.error("Error updating avatar parts:", error);
    throw error;
  }
}

export async function getAllAvatarParts(category: number) {
  const { user } = await getAuth();
  const supportedVersionNumber = await getSupportedVersionNumber();

  if (!user || !user.accessCode) {
    throw new Error("User is not authenticated or accessCode is missing");
  }

  // Check for user items in _item_item
  const checkUserItems = await artemis.chuni_item_item.findMany({
    where: {
      itemKind: 11,
      user: user.UserId,
    },
    select: {
      itemId: true,
    },
  });

  const chuni_item_item_ItemId = checkUserItems.map((item) => item.itemId);

  // Retrieve all avatar parts
  const allAvatarParts = await artemis.chuni_static_avatar.findMany({
    where: {
      category: category,
    },
    select: {
      id: true,
      name: true,
      avatarAccessoryId: true,
      category: true,
      version: true,
      iconPath: true,
      texturePath: true,
    },
  });

  const currentlyUnlockedAvatarParts = Array.from(
    new Map(
      allAvatarParts
        .filter((matchingAvatarParts) =>
          chuni_item_item_ItemId.includes(
            matchingAvatarParts.avatarAccessoryId,
          ),
        )
        .map((unlockedAvatarPartIds) => [
          unlockedAvatarPartIds.avatarAccessoryId,
          unlockedAvatarPartIds,
        ]),
    ).values(),
  );

  return currentlyUnlockedAvatarParts;
}

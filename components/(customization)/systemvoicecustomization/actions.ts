"use server";

import { getAuth } from "@/auth/queries/getauth";
import { getSupportedVersionNumber } from "@/lib/api";
import { artemis, daphnis } from "@/lib/prisma";

export async function getCurrentSystemVoice() {
  const { user } = await getAuth();
  const supportedVersionNumber = await getSupportedVersionNumber();

  if (!user || !user.accessCode) {
    throw new Error("User is not authenticated or accessCode is missing");
  }

  const currentSystemVoice = await artemis.chuni_profile_data.findMany({
    where: {
      user: user.UserId,
      version: supportedVersionNumber,
    },
    select: {
      voiceId: true,
    },
  });
  return currentSystemVoice;
}

export async function updatePlayerSystemVoiceId(voiceId: number) {
  const { user } = await getAuth();
  const supportedVersionNumber = await getSupportedVersionNumber();

  if (!user || !user.accessCode) {
    throw new Error("User is not authenticated or accessCode is missing");
  }

  if (voiceId === undefined) {
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
        voiceId,
      },
    });

    return updatePlayerNameplate;
  } catch (error) {
    console.error("Error updating nameplate:", error);
    throw error;
  }
}

export async function getSystemVoices() {
  const { user } = await getAuth();

  if (!user || !user.accessCode) {
    throw new Error("User is not authenticated or accessCode is missing");
  }

  const checkIfSystemVoiceIsUnlocked = await artemis.chuni_item_item.findMany({
    where: {
      itemKind: 9,
      user: user.UserId,
    },
    select: {
      itemId: true,
    },
  });

  const unlockedSystemVoices = checkIfSystemVoiceIsUnlocked.map(
    (item) => item.itemId,
  );

  const AllSystemVoices = await daphnis.chuni_static_systemvoice.findMany({
    select: {
      id: true,
      str: true,
      sortName: true,
      imagePath: true,
    },
  });

  const currentlyUnlockedSystemVoices = Array.from(
    new Map(
      AllSystemVoices.filter((matchingsystemVoiceIds) =>
        unlockedSystemVoices.includes(matchingsystemVoiceIds.id),
      ).map((unlockedSystemVoiceIds) => [
        unlockedSystemVoiceIds.id,
        unlockedSystemVoiceIds,
      ]),
    ).values(),
  );

  return currentlyUnlockedSystemVoices;
}

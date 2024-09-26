"use server";

import { getAuth } from "@/auth/queries/getauth";
import { artemis, daphnis } from "@/lib/prisma";
import { GameVersion } from "@/prisma/schemas/daphnis/generated/daphnis";

export const getUsername = async () => {
  const { user } = await getAuth();
  if (user) {
    return await daphnis.user.findFirst({
      where: {
        id: user.id,
        username: user.username,
      },
    });
  }
  return null;
};

export async function getAllAimeCards() {
  const { user } = await getAuth();

  if (!user) {
    throw new Error("User is not authenticated");
  }

  const aimeUser = await daphnis.user.findMany({
    where: {
      accessCode: user.accessCode,
    },
  });
  return aimeUser;
}

export async function verifyAimeCodeAgainstArtemis() {
  const { user } = await getAuth();

  if (!user) {
    throw new Error("User is not authenticated");
  }

  const aimeUser = await artemis.aime_card.findFirst({
    where: {
      access_code: user.accessCode,
    },
  });
  return aimeUser;
}

const GameVersionToNumber: Record<GameVersion, number> = {
  [GameVersion.LuminousPlus]: 16,
  [GameVersion.Luminous]: 15,
  [GameVersion.SunPlus]: 14,
  [GameVersion.Sun]: 13,
  [GameVersion.NewPlus]: 12,
  [GameVersion.New]: 10,
};

export async function getGameVersion(): Promise<GameVersion> {
  const { user } = await getAuth();

  if (!user) {
    throw new Error("User is not authenticated");
  }

  const aimeUser = await daphnis.user.findFirst({
    where: {
      accessCode: user.accessCode,
    },
    select: {
      gameVersion: true,
    },
  });

  if (!aimeUser || !aimeUser.gameVersion) {
    throw new Error("Game version not found for the user");
  }

  // console.log("User Game Version:", aimeUser.gameVersion);

  const gameVersionEnum = aimeUser.gameVersion as GameVersion;

  if (!(gameVersionEnum in GameVersionToNumber)) {
    throw new Error("Unknown game version");
  }

  return gameVersionEnum;
}

export async function getSupportedVersionNumber(): Promise<number> {
  const gameVersion = await getGameVersion();

  const versionNumber = GameVersionToNumber[gameVersion];

  if (versionNumber === undefined) {
    throw new Error("Unknown version number");
  }

  // console.log(typeof versionNumber);
  return versionNumber;
}

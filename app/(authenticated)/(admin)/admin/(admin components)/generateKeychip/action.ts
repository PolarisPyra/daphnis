"use server";
import { getAuth } from "@/auth/queries/getauth";
import { artemis } from "@/lib/prisma";
import type * as Prisma from "@prisma/client";

type artemis = Prisma.PrismaClient;

export const createArcadeAndMachine = async (arcadeData: {
  arcade_nickname: string;
  name: string;
  game: string;
  namcopcbid?: string;
  serial?: string;
}) => {
  const { user } = await getAuth();

  if (!user || !user.accessCode) {
    throw new Error("User is not authenticated or accessCode is missing");
  }

  const { arcade_nickname, name, game, namcopcbid, serial } = arcadeData;

  const existingArcade = await artemis.arcade.findFirst({
    where: { name: name, nickname: arcade_nickname },
  });

  if (existingArcade) {
    throw new Error(
      "Arcade name already exists. Please choose a different name.",
    );
  }

  let serialId: string | undefined;

  if (game === "SDEW") {
    serialId = namcopcbid;
  } else {
    serialId = serial;
  }

  if (!serialId) {
    throw new Error("serialId must be provided when game is not SDEW.");
  }

  const existingMachine = await artemis.machine.findFirst({
    where: { serial: serialId },
  });

  if (existingMachine) {
    throw new Error(
      "The serial ID is already in use. Please use a different one.",
    );
  }
  const newArcade = await artemis.arcade.create({
    data: {
      name,
      nickname: arcade_nickname,
    },
  });

  await artemis.arcade_owner.create({
    data: {
      user: user.UserId,
      arcade: newArcade.id,
      permissions: 1,
    },
  });

  await artemis.machine.create({
    data: {
      arcade: newArcade.id,
      serial: serialId,
      game: game === "SDEW" ? game : null,
    },
  });

  return newArcade.id;
};

"use server";

import { getAuth } from "@/auth/queries/getauth";
import { getSupportedVersionNumber } from "@/lib/api";
import { artemis } from "@/lib/prisma";

export async function getCurrentTeams() {
  const { user } = await getAuth();

  if (!user || !user.accessCode) {
    throw new Error("User is not authenticated or accessCode is missing");
  }

  // Fetch the current teamId from chuni_profile_data for this user
  const currentTeamData = await artemis.chuni_profile_data.findFirst({
    where: {
      user: user.UserId,
      version: await getSupportedVersionNumber(),
    },
    select: {
      teamId: true,
    },
  });

  // Fetch all selectable teams
  const selectableTeams = await artemis.chuni_profile_team.findMany({
    select: {
      teamName: true,
      userTeamPoint: true,
      id: true,
      teamPoint: true,
    },
  });

  // Match chuni_profile_team id to chuni_profile_data id to get the team name
  return selectableTeams.map((team) => ({
    ...team,
    isCurrent: team.id === currentTeamData?.teamId,
  }));
}

export async function updatePlayerTeam(teamId: number) {
  const { user } = await getAuth();
  const supportedVersionNumber = await getSupportedVersionNumber();

  if (!user || !user.accessCode) {
    throw new Error("User is not authenticated or accessCode is missing");
  }

  if (teamId === undefined) {
    throw new Error("trophy is required");
  }

  try {
    const updatePlayerTeam = await artemis.chuni_profile_data.update({
      where: {
        user_version: {
          user: user.UserId,
          version: supportedVersionNumber,
        },
      },
      data: {
        teamId,
      },
    });

    return updatePlayerTeam;
  } catch (error) {
    console.error("Error updating trophy:", error);
    throw error;
  }
}

export async function addTeam(teamName: string) {
  const { user } = await getAuth();

  if (!user || !user.accessCode) {
    throw new Error("User is not authenticated or accessCode is missing");
  }

  try {
    const newTeam = await artemis.chuni_profile_team.create({
      data: {
        teamName,
      },
    });

    return newTeam;
  } catch (error) {
    console.error("Error adding new team:", error);
    throw error;
  }
}

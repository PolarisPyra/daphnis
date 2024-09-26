"use server";

import { artemis } from "@/lib/prisma";
import type * as Prisma from "@prisma/client";
type AimeUserGameLocks = Prisma.PrismaClient;

export async function getLockedUsers() {
  try {
    const lockedUsers = await artemis.aime_user_game_locks.findMany({
      select: {
        id: true,
        user: true,
        game: true,
        expires_at: true,
        extra: true,
      },
    });

    // user = aime_user_game_locks id column
    const userIds = lockedUsers.map((lockedUsers) => lockedUsers.user);

    const usersWithNames = await artemis.chuni_profile_data.findMany({
      where: {
        user: {
          in: userIds,
        },
      },
      select: {
        user: true,
        userName: true,
      },
    });

    const LockedUsernames = lockedUsers.map((lockedUsers) => {
      const user = usersWithNames.find((u) => u.user === lockedUsers.user);
      return {
        ...lockedUsers,
        userName: user?.userName || null,
      };
    });
    return LockedUsernames;
  } catch (error) {
    console.error("Error fetching locked users:", error);
    return null;
  }
}

export async function deleteUserGameLocks(userId: number) {
  try {
    const result = await artemis.aime_user_game_locks.deleteMany({
      where: {
        user: userId,
      },
    });

    if (result.count > 0) {
      console.log(
        `Successfully deleted ${result.count} rows for user ${userId}.`,
      );
      return { success: true, count: result.count };
    } else {
      console.log(`No rows found for user ${userId}.`);
      return { success: false, message: `No rows found for user ${userId}.` };
    }
  } catch (error) {
    console.error("Error deleting user game locks:", error);
    return { success: false, message: "Error deleting user game locks." };
  }
}

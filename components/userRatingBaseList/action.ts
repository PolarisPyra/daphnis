"use server";
import { getAuth } from "@/auth/queries/getauth";
import { getSupportedVersionNumber } from "@/lib/api";
import { artemis } from "@/lib/prisma";

export async function getUserRatingBaseList() {
  const { user } = await getAuth();
  const supportedVersionNumber = await getSupportedVersionNumber();

  if (!user || !user.accessCode) {
    throw new Error("User is not authenticated or accessCode is missing");
  }

  try {
    const userRatingBaseList = await artemis.chuni_profile_rating.findMany({
      where: {
        user: user.UserId,
        type: "userRatingBaseList",
        version: supportedVersionNumber,
      },
      select: {
        musicId: true,
        score: true,
        difficultId: true,
        version: true,
        index: true,
      },
      orderBy: {
        index: "asc",
      },
    });

    const staticMusicInfo = await artemis.chuni_static_music.findMany({
      where: {
        songId: {
          in: userRatingBaseList.map((entry) => entry.musicId!),
        },
        version: supportedVersionNumber,
      },
      select: {
        songId: true,
        title: true,
        artist: true,
        chartId: true,
        level: true,
        genre: true,
        jacketPath: true,
      },
    });

    // chartId is the difficutly i.e
    // easy, hard, expert, master, ultima, worlds end

    // msuicId is the id of the specific song in the rating table
    // we are mapping that to songId in chuni static music
    //  so we can get name and jacket path etc
    // then we are mapping the difficultId to the chartId to get the proper difficutly from above
    // this is very confusing and my brain hurts
    // if someone could make this cleaner id highly appreciate it

    // Create a map
    const songIdtoChartId = new Map<string, (typeof staticMusicInfo)[0]>(
      staticMusicInfo.map((music) => [
        `${music.songId}-${music.chartId}`,
        music,
      ]),
    );

    const musicIdToDifficltId = userRatingBaseList.map((rating) => {
      const staticMusic = songIdtoChartId.get(
        `${rating.musicId}-${rating.difficultId}`,
      );

      const level = staticMusic?.level ?? 0;
      const score = rating.score ?? 0;

      const perSongRating = calculateRating(level, score);

      return {
        ...rating,
        chartId: staticMusic?.chartId || "Unknown chartId",
        title: staticMusic?.title || "Unknown Title",
        artist: staticMusic?.artist || "Unknown Artist",
        genre: staticMusic?.genre || "Unknown Genre",
        level: staticMusic?.level || "Unknown Level",
        jacketPath: staticMusic?.jacketPath || "",
        rating: perSongRating,
      };
    });

    return musicIdToDifficltId;
  } catch (error) {
    console.error("Error fetching songs with titles:", error);
    throw error;
  }
}

// calculate the rating
function calculateRating(level: number, score: number): number {
  if (score >= 1009000) {
    return level * 100 + 215;
  } else if (score >= 1007500) {
    return level * 100 + 200 + (score - 1007500) / 100;
  } else if (score >= 1005000) {
    return level * 100 + 150 + (score - 1005000) / 50;
  } else if (score >= 1000000) {
    return level * 100 + 100 + (score - 1000000) / 100;
  } else if (score >= 975000) {
    return level * 100 + (score - 975000) / 250;
  } else if (score >= 925000) {
    return level * 100 - 300 + ((score - 925000) * 3) / 500;
  } else if (score >= 900000) {
    return level * 100 - 500 + ((score - 900000) * 4) / 500;
  } else if (score >= 800000) {
    return (
      (level * 100 - 500) / 2 +
      ((score - 800000) * ((level - 500) / 2)) / 100000
    );
  } else {
    return 0;
  }
}

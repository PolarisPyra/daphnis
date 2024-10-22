"use server";

import { getAuth } from "@/auth/queries/getauth";
import { getSupportedVersionNumber } from "@/lib/api";
import { artemis } from "@/lib/prisma";

interface AuthResponse {
  user: {
    UserId: string;
    accessCode: string;
  } | null;
}

interface RatingBaseHotEntry {
  musicId: string | null;
  score: number | null;
  difficultId: string;
  version: number;
  index: number;
}

interface StaticMusicEntry {
  songId: string;
  title: string;
  artist: string;
  chartId: string;
  level: number;
  genre: string;
  jacketPath: string;
}

interface EnhancedRatingEntry extends RatingBaseHotEntry {
  chartId: string;
  title: string;
  artist: string;
  genre: string;
  level: string | number;
  jacketPath: string;
  rating: number;
}

type RatingCalculation = {
  threshold: number;
  calculate: (level: number, score: number) => number;
};

export async function getUserRatingBaseHotList(): Promise<EnhancedRatingEntry[]> {
  const auth = await getAuth() as AuthResponse;
  const supportedVersionNumber = await getSupportedVersionNumber();

  if (!auth.user?.accessCode) {
    throw new Error("User is not authenticated or accessCode is missing");
  }

  try {
    const userRatingBaseList = await fetchUserRatingBaseHotList(auth.user.UserId, supportedVersionNumber);
    const staticMusicInfo = await fetchStaticMusicInfo(
      userRatingBaseList.map(entry => entry.musicId!),
      supportedVersionNumber
    );

    return combineRatingWithStaticInfo(userRatingBaseList, staticMusicInfo);
  } catch (error) {
    console.error("Error fetching songs with titles:", error);
    throw error;
  }
}

async function fetchUserRatingBaseHotList(
  userId: string,
  version: number
): Promise<RatingBaseHotEntry[]> {
  return artemis.chuni_profile_rating.findMany({
    where: {
      user: userId,
      type: "userRatingBaseHotList", 
      version: version,
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
}

async function fetchStaticMusicInfo(
  musicIds: string[],
  version: number
): Promise<StaticMusicEntry[]> {
  return artemis.chuni_static_music.findMany({
    where: {
      songId: {
        in: musicIds,
      },
      version: version,
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
}

function combineRatingWithStaticInfo(
  ratingList: RatingBaseHotEntry[],
  staticInfo: StaticMusicEntry[]
): EnhancedRatingEntry[] {
  const songIdtoChartId = new Map<string, StaticMusicEntry>(
    staticInfo.map((music) => [`${music.songId}-${music.chartId}`, music])
  );

  return ratingList.map((rating): EnhancedRatingEntry => {
    const staticMusic = songIdtoChartId.get(
      `${rating.musicId}-${rating.difficultId}`
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
}

const RatingCalculation: RatingCalculation[] = [
  {
    threshold: 1009000,
    calculate: (level, score) => level * 100 + 215
  },
  {
    threshold: 1007500,
    calculate: (level, score) => level * 100 + 200 + (score - 1007500) / 100
  },
  {
    threshold: 1005000,
    calculate: (level, score) => level * 100 + 150 + (score - 1005000) / 50
  },
  {
    threshold: 1000000,
    calculate: (level, score) => level * 100 + 100 + (score - 1000000) / 100
  },
  {
    threshold: 975000,
    calculate: (level, score) => level * 100 + (score - 975000) / 250
  },
  {
    threshold: 925000,
    calculate: (level, score) => level * 100 - 300 + ((score - 925000) * 3) / 500
  },
  {
    threshold: 900000,
    calculate: (level, score) => level * 100 - 500 + ((score - 900000) * 4) / 500
  },
  {
    threshold: 800000,
    calculate: (level, score) => (level * 100 - 500) / 2 + ((score - 800000) * ((level - 500) / 2)) / 100000
  }
];

function calculateRating(level: number, score: number): number {
  const threshold = RatingCalculation.find(t => score >= t.threshold);
  return threshold ? threshold.calculate(level, score) : 0;
}
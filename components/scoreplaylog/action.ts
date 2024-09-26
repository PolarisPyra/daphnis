"use server";

import { getSupportedVersionNumber } from "@/lib/api";
import { artemis } from "@/lib/prisma";
import { chuni_score_best } from "@/prisma/schemas/artemis/generated/artemis";
import type * as Prisma from "@prisma/client";

type artemis = Prisma.PrismaClient;

export async function getSongsWithTitles(userId: number) {
  const supportedVersionNumber = await getSupportedVersionNumber();

  try {
    const chuni_score_playlog: artemis[] =
      await artemis.chuni_score_playlog.findMany({
        where: {
          user: userId,
        },
        orderBy: {
          userPlayDate: "desc",
        },
        select: {
          id: true,
          maxCombo: true,
          userPlayDate: true,
          isFullCombo: true,
          playerRating: true,
          isAllJustice: true,
          score: true,
          judgeHeaven: true,
          judgeGuilty: true,
          judgeJustice: true,
          judgeAttack: true,
          judgeCritical: true,
          isClear: true,
          skillId: true,
          skillEffect: true,
          skillLevel: true,
          isNewRecord: true,
          musicId: true,
          level: true,
          rateAir: true,
          rateHold: true,
          rateFlick: true,
          rateSlide: true,
          rateTap: true,
          romVersion: true,
          eventId: true,
          characterId: true,
          charaIllustId: true,
          track: true,
          isContinue: true,
          isFreeToPlay: true,
          playKind: true,
          playDate: true,
          orderId: true,
          sortNumber: true,
          user: true,
          placeId: true,
          ticketId: true,
        },
      });

    const musicId = chuni_score_playlog.map(
      (chuni_score_playlog) => chuni_score_playlog.musicId,
    );

    const chuni_static_music: artemis[] =
      await artemis.chuni_static_music.findMany({
        where: {
          version: supportedVersionNumber,
          songId: {
            in: musicId,
          },
        },
        select: {
          songId: true,
          title: true,
          artist: true,
          chartId: true,
          level: true,
          genre: true,
          worldsEndTag: true,
          jacketPath: true,
        },
      });

    const totalPlayCounts = await artemis.chuni_score_playlog.groupBy({
      by: ["musicId", "level"],
      where: {
        musicId: { in: musicId },
        user: userId,
      },
      _count: {
        _all: true,
      },
    });

    const chuni_profile_option = await artemis.chuni_profile_option.findUnique({
      where: { user: userId },
      select: { rating: true },
    });

    const isUserRatingHidden = chuni_profile_option?.rating;

    const playlogToStaticMusic = chuni_score_playlog.map(
      (chuni_score_playlog) => {
        const accurateSongInformation = chuni_static_music.find(
          (chuni_static_music) =>
            chuni_static_music.songId === chuni_score_playlog.musicId &&
            chuni_static_music.chartId === chuni_score_playlog.level,
        );

        const title = accurateSongInformation
          ? accurateSongInformation.title
          : "Unknown Title";

        const artist = accurateSongInformation
          ? accurateSongInformation.artist
          : "Unknown Artist";

        const genre = accurateSongInformation
          ? accurateSongInformation.genre
          : "Unknown Genre";

        const chartId = accurateSongInformation
          ? accurateSongInformation.chartId
          : "Unknown chartId";

        const level = accurateSongInformation
          ? accurateSongInformation.level
          : "Unknown Level";

        const jacketPath = accurateSongInformation
          ? accurateSongInformation.jacketPath
          : "";

        const playCount =
          totalPlayCounts.find(
            (countData) =>
              countData.musicId === chuni_score_playlog.musicId &&
              countData.level === chuni_score_playlog.level,
          )?._count?._all || 0;

        return {
          ...chuni_score_playlog,
          title,
          artist,
          genre,
          chartId,
          level,
          jacketPath,
          playCount,
          isUserRatingHidden,
        };
      },
    );

    return playlogToStaticMusic;
  } catch (error) {
    console.error("Error fetching songs with titles:", error);
    throw error;
  }
}

export async function searchSongWithTitle(
  userId: number,
  searchQuery: string = "",
) {
  try {
    const chuni_score_playlog: artemis[] =
      await artemis.chuni_score_playlog.findMany({
        where: {
          user: userId,
        },
        orderBy: {
          userPlayDate: "desc",
        },
        select: {
          id: true,
        },
      });

    const chuniScorePlaylogMusicId = chuni_score_playlog
      .map((chuni_score_playlog) => chuni_score_playlog.musicId)
      .filter((id): id is number => id !== null);

    const staticMusicInfo: artemis[] =
      await artemis.chuni_static_music.findMany({
        where: {
          songId: {
            in: chuniScorePlaylogMusicId,
          },
          title: {
            contains: searchQuery,
          },
        },
        select: {
          songId: true,
          title: true,
        },
      });

    const chuniScoreBest: chuni_score_best[] =
      await artemis.chuni_score_best.findMany({
        where: {
          musicId: {
            in: chuniScorePlaylogMusicId,
          },
        },
        select: {
          id: true,
          user: true,
          musicId: true,
          level: true,
          playCount: true,
          scoreMax: true,
          resRequestCount: true,
          resAcceptCount: true,
          resSuccessCount: true,
          missCount: true,
          maxComboCount: true,
          isFullCombo: true,
          isAllJustice: true,
          isSuccess: true,
          fullChain: true,
          maxChain: true,
          scoreRank: true,
          isLock: true,
          ext1: true,
          theoryCount: true,
        },
      });

    const songsWithTitles = chuni_score_playlog.map((chuni_score_playlog) => {
      const staticInfo = staticMusicInfo.find(
        (chuniStaticMusic) =>
          chuniStaticMusic.songId === chuni_score_playlog.musicId &&
          chuniStaticMusic.chartId === chuni_score_playlog.level,
      );

      const bestScore = chuniScoreBest.find(
        (score) => score.musicId === chuni_score_playlog.musicId,
      );

      return {
        ...chuni_score_playlog,
        title: staticInfo?.title || "Unknown Title",
        playCount: bestScore?.playCount || 0,
      };
    });

    return songsWithTitles;
  } catch (error) {
    console.error("Error fetching songs with titles:", error);
    throw error;
  }
}

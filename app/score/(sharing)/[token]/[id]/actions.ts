"use server";
import { artemis, daphnis } from "@/lib/prisma";
import type * as Prisma from "@prisma/client";

type ChuniScorePlaylog = Prisma.PrismaClient;
type ChuniStaticMusic = Prisma.PrismaClient;

type LinkSharingToken = {
  playlogId: number;
};

export async function getSharedSong(token: string) {
  try {
    const linkSharingToken = await daphnis.link_sharing_token.findFirst({
      where: {
        token: token,
      },
      select: {
        playlogId: true,
        userId: true,
      },
    });

    const user = await daphnis.user.findUnique({
      where: {
        id: linkSharingToken!.userId,
      },
      select: {
        id: true,
        UserId: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (!linkSharingToken) {
      throw new Error("Invalid or expired token");
    }

    const songs: ChuniScorePlaylog[] =
      await artemis.chuni_score_playlog.findMany({
        where: {
          user: user.UserId,
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

    const chuniScorePlaylogMusicId = songs
      .map((song) => song.musicId)
      .filter((id): id is number => id !== null);

    const staticMusicInfo: ChuniStaticMusic[] =
      await artemis.chuni_static_music.findMany({
        where: {
          songId: {
            in: chuniScorePlaylogMusicId,
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

    const playCounts = await artemis.chuni_score_playlog.groupBy({
      by: ["musicId"],
      _count: {
        musicId: true,
      },
      where: {
        user: user?.UserId,
        musicId: {
          in: chuniScorePlaylogMusicId,
        },
      },
    });

    const playCountMap = playCounts.reduce(
      (map, item) => {
        if (item.musicId !== null) {
          map[item.musicId] = item._count.musicId;
        }
        return map;
      },
      {} as Record<number, number>,
    );

    const songsWithTitles = songs.map((song) => {
      const staticInfo = staticMusicInfo.find(
        (chuniStaticMusic) =>
          chuniStaticMusic.songId === song.musicId &&
          chuniStaticMusic.chartId === song.level,
      );

      return {
        ...song,
        title: staticInfo?.title || "Unknown Title",
        artist: staticInfo?.artist || "Unknown Artist",
        genre: staticInfo?.genre || "Unknown Genre",
        chartId: staticInfo?.chartId || "Unknown chartId",
        level: staticInfo?.level || "Unknown Level",
        chartlevel: song.level || "Unknown Level",
        playCount: song.musicId !== null ? playCountMap[song.musicId] || 0 : 0,
        jacketPath: staticInfo?.jacketPath || "",
      };
    });

    return songsWithTitles;
  } catch (error) {
    console.error("Error fetching songs with titles:", error);
    throw error;
  }
}

export async function getPlaylogId(playlogid: number) {
  try {
    const tokens = (await daphnis.link_sharing_token.findMany({
      where: {
        playlogId: playlogid,
      },
      select: {
        playlogId: true,
      },
    })) as LinkSharingToken[];

    const playlogIds: number[] = tokens.map((token) => token.playlogId);

    return playlogIds;
  } catch (error) {
    console.error("Error fetching playlogIds:", error);
    throw error;
  }
}

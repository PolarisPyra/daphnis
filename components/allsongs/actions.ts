"use server";
import { getSupportedVersionNumber } from "@/lib/api";
import { artemis } from "@/lib/prisma";

export async function getChunithmSongList() {
  try {
    const supportedVersionNumber = await getSupportedVersionNumber();

    return await artemis.chuni_static_music.findMany({
      where: {
        version: supportedVersionNumber,
        NOT: {
          AND: [{ chartId: 5 }, { worldsEndTag: "Invalid" }],
        },
      },
      select: {
        songId: true,
        id: true,
        chartId: true,
        title: true,
        artist: true,
        level: true,
        genre: true,
        jacketPath: true,
      },
      orderBy: [{ songId: "desc" }, { chartId: "desc" }],
    });
  } catch (error) {
    console.error("Error fetching song list:", error);
    throw error;
  }
}

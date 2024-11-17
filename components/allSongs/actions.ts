"use server";
import { getSupportedVersionNumber } from "@/lib/api";
import { artemis } from "@/lib/prisma";

export async function getChunithmSongList() {
  try {
    const supportedVersionNumber = await getSupportedVersionNumber();

    return await artemis.chuni_static_music.findMany({
      where: {
        version: supportedVersionNumber,
      },
      select: {
        songId: true,
        chartId: true,
        title: true,
        artist: true,
        level: true,
        genre: true,
        jacketPath: true,
      },
      orderBy: [{ songId: "asc" }, { chartId: "desc" }],
    });
  } catch (error) {
    console.error("Error fetching song list:", error);
    throw error;
  }
}

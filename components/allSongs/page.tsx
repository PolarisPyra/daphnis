"use client";
import React, { FC, useMemo, useState } from "react";
import ImageCell from "../scoreplaylog/image";
import type * as Prisma from "@prisma/client";
import { Input } from "../ui/input";
type artemis = Prisma.PrismaClient;

type ChunithmAllSongs = {
  chuniAllSongs: {
    allChunithmSongs: artemis[];
  };
};

type GroupedSong = {
  title: string;
  artist: string;
  jacketPath: string;
  genre: string;
  difficulties: {
    level: number | string;
    chartId: number;
  }[];
};

export const AllChunithmSongs: FC<ChunithmAllSongs> = ({ chuniAllSongs }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const groupedSongs = useMemo(() => {
    const grouped = new Map<string, GroupedSong>();

    chuniAllSongs.allChunithmSongs.forEach((song) => {
      if (!grouped.has(song.title)) {
        grouped.set(song.title, {
          title: song.title,
          artist: song.artist,
          jacketPath: song.jacketPath,
          genre: song.genre,
          difficulties: [],
        });
      }

      const currentSong = grouped.get(song.title);
      if (currentSong) {
        currentSong.difficulties.push({
          level: song.level,
          chartId: song.chartId,
        });
        currentSong.difficulties.sort((a, b) => a.chartId - b.chartId);
      }
    });

    return Array.from(grouped.values());
  }, [chuniAllSongs.allChunithmSongs]);

  // Filter songs by title based on the search query
  const filteredSongs = useMemo(() => {
    return groupedSongs.filter((song) =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery, groupedSongs]);

  return (
    <div>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search by title"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-md border px-4 py-2"
        />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
        {filteredSongs.map((song, index) => (
          <div
            key={index}
            className="flex flex-col items-center rounded-sm bg-muted p-3"
          >
            <div className="flex flex-col items-center justify-center">
              <div className="relative flex w-full items-center justify-center overflow-hidden rounded-md">
                <ImageCell jacketPath={song.jacketPath} />
              </div>
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                {song.difficulties.map(
                  (diff) =>
                    diff.level !== 0 && (
                      <div
                        key={diff.chartId}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-bold text-black shadow"
                      >
                        {diff.level}
                      </div>
                    ),
                )}
              </div>
            </div>
            <div className="mt-2 w-full text-center">
              <h3
                className="truncate py-1 text-sm font-semibold text-white"
                title={song.title}
              >
                {song.title}
              </h3>
              <p
                className="truncate py-1 text-xs text-white"
                title={song.artist}
              >
                {song.artist}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

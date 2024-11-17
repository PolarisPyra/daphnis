"use client";
import React, { FC, useMemo, useState } from "react";
import ImageCell from "../scoreplaylog/image";
import type * as Prisma from "@prisma/client";
import { Input } from "../ui/input";
import { getDifficultyText } from "@/lib/helpers";
import { allSongs } from "@/lib/types";

type ChunithmAllSongs = {
  chuniAllSongs: {
    allChunithmSongs: allSongs[];
  };
};

export const AllChunithmSongs: FC<ChunithmAllSongs> = ({ chuniAllSongs }) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Group and filter songs by songId
  const groupedAndFilteredSongs = useMemo(() => {
    const filteredSongs = chuniAllSongs.allChunithmSongs.filter(
      (song) =>
        song.title?.toLowerCase().includes(searchQuery.toLowerCase()) &&
        song.level !== 0 &&
        Number(song.songId) <= 8000, // hiding we until either importer is changed or i figure out something smarter
    );

    const grouped = Object.values(
      filteredSongs.reduce(
        (acc, song) => {
          const songId = song.songId;
          if (songId !== null && !acc[songId]) {
            acc[songId] = {
              ...song,
              levels: [],
            };
          }
          if (songId !== null) {
            acc[songId].levels.push({
              level: song.level,
              chartId: song.chartId,
            });
          }
          return acc;
        },
        {} as Record<string, any>,
      ),
    );

    // Sort by songId in descending order (newest to oldest)
    return grouped.sort((a, b) => Number(b.songId) - Number(a.songId));
  }, [searchQuery, chuniAllSongs.allChunithmSongs]);

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
        {groupedAndFilteredSongs.map((song, index) => (
          <div
            key={index}
            className="flex flex-col items-center rounded-sm bg-muted p-3"
          >
            <div className="flex flex-col items-center justify-center">
              <div className="relative flex w-full items-center justify-center overflow-hidden rounded-md">
                <ImageCell jacketPath={song.jacketPath} />
              </div>
            </div>
            <div className="mt-2 w-full text-center">
              <h3 className="truncate py-1 text-sm font-semibold text-white">
                {song.title}
              </h3>
              <p className="truncate py-1 text-xs text-white">{song.artist}</p>
              <div className="flex flex-wrap justify-center gap-1">
                {song.levels.map(
                  (level: { level: number; chartId: number }, i: number) => (
                    <p key={i} className="truncate py-1 text-xs text-white">
                      {getDifficultyText(level.chartId)}: {level.level}
                    </p>
                  ),
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

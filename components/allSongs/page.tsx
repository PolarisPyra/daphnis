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

export const AllChunithmSongs: FC<ChunithmAllSongs> = ({ chuniAllSongs }) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter songs by title based on the search query
  const filteredSongs = useMemo(() => {
    return chuniAllSongs.allChunithmSongs.filter(
      (song) =>
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        song.level !== 0,
    );
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
        {filteredSongs.map((song, index) => (
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
              <p
                className="truncate py-1 text-xs text-white"
                title={song.artist}
              >
                {song.chartId === 5 ? `WORLDS END: ${song.level}` : song.level}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

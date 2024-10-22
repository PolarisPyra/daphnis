"use client";

import React, { FC } from "react";
import { getDifficultyText } from "@/lib/helpers";
import ImageCell from "../scoreplaylog/image";

type userRatingBaseList = {
  title: string;
  artist: string;
  genre: string;
  chartId: string | number;
  level: string | number;
  jacketPath: string;
  rating: number;
  version: number;
  index: number;
  musicId: number | null;
  difficultId: number | null;
  score: number | null;
};

type ChunithmProfileHotPlays = {
  chuniProfileHotPlays: {
    hotRating: userRatingBaseList[];
  };
};
export const ChunithmHotPlays: FC<ChunithmProfileHotPlays> = ({
  chuniProfileHotPlays,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
      {chuniProfileHotPlays.hotRating.map((playerHotRatingList, index) => {
        return (
          <div key={index} className="flex flex-col items-center p-2">
            <div className="font-bold"></div>
            <ImageCell jacketPath={playerHotRatingList.jacketPath!} />
            <div>
              <ul className="mt-2 text-center">
                <li>
                  <strong>Title: </strong> {playerHotRatingList.title}
                </li>
                <li>
                  <strong>Level: </strong> {playerHotRatingList.level}
                </li>
                <li>
                  <strong>Difficulty: </strong>
                  {getDifficultyText(Number(playerHotRatingList.chartId))}
                </li>
                <li>
                  <strong>Score: </strong>{" "}
                  {playerHotRatingList.score?.toLocaleString()}
                </li>
                <li>
                  <strong>Rating: </strong>{" "}
                  {(playerHotRatingList.rating / 100).toFixed(2)}
                </li>
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
};

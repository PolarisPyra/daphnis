"use client";
import React, { FC, useState } from "react";
import { getDifficultyText } from "@/lib/helpers";
import { Skeleton } from "../ui/skeleton";
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

type chunithmTopPlays = {
  chuniProfileTopPlays: {
    topPlays: userRatingBaseList[];
  };
};

export const ChunithmTopPlays: FC<chunithmTopPlays> = ({
  chuniProfileTopPlays,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
      {chuniProfileTopPlays.topPlays.map((chuniProfileTopPlays, index) => {
        return (
          <div key={index} className="flex flex-col items-center p-2">
            <div className="font-bold"></div>
            <ImageCell jacketPath={chuniProfileTopPlays.jacketPath!} />
            <ul className="mt-2 text-center">
              <li>
                <strong>Title: </strong> {chuniProfileTopPlays.title}
              </li>
              <li>
                <strong>Level: </strong> {chuniProfileTopPlays.level}
              </li>
              <li>
                <strong>Difficulty: </strong>
                {getDifficultyText(Number(chuniProfileTopPlays.chartId))}
              </li>
              <li>
                <strong>Score: </strong>
                {chuniProfileTopPlays.score?.toLocaleString()}
              </li>
              <li>
                <strong>Rating: </strong>
                {(chuniProfileTopPlays.rating / 100).toFixed(2)}
              </li>
            </ul>
          </div>
        );
      })}
    </div>
  );
};

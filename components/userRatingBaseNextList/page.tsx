"use client";
import React, { FC } from "react";
import { getDifficultyText } from "@/lib/helpers";
import ImageCell from "../scoreplaylog/image";
import { userRatingBaseList } from "@/lib/types";

type ChunithmProfileHotPlays = {
  chuniProfileNextPlays: {
    nextPlays: userRatingBaseList[];
  };
};
export const ChunithmNextPlays: FC<ChunithmProfileHotPlays> = ({
  chuniProfileNextPlays,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
      {chuniProfileNextPlays.nextPlays.map((playerNextRatingList, index) => {
        return (
          <div key={index} className="flex flex-col items-center p-2">
            <div className="font-bold"></div>
            <ImageCell jacketPath={playerNextRatingList.jacketPath} />
            <div>
              <ul className="mt-2 text-center">
                <li>
                  <strong>Title: </strong> {playerNextRatingList.title}
                </li>
                <li>
                  <strong>Level: </strong> {playerNextRatingList.level}
                </li>
                <li>
                  <strong>Difficulty: </strong>
                  {getDifficultyText(Number(playerNextRatingList.chartId))}
                </li>
                <li>
                  <strong>Score: </strong>
                  {playerNextRatingList.score?.toLocaleString()}
                </li>
                <li>
                  <strong>Rating: </strong>
                  {(playerNextRatingList.rating / 100).toFixed(2)}
                </li>
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
};

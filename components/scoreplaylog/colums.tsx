"use client";

import { Button } from "@/components/ui/button";
import { getDifficultyText, getGrade } from "@/lib/helpers";
import type * as Prisma from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import ImageCell from "./image";
import ActionsCell from "./moreAction";

type artemis = Prisma.PrismaClient & {
  isUserRatingHidden: number;
  playCount: number;
};

export const columns: ColumnDef<artemis>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const showRating = row.original.isUserRatingHidden === 1;

      return (
        <div className="text-bold flex items-center">
          <ImageCell jacketPath={row.original.jacketPath!} />
          <div className="ml-2 flex flex-col">
            <span>{row.original.title}</span>
            <div className="bold mt-2 w-32 rounded-sm bg-primary pl-1 text-primary-foreground">
              Rating:{" "}
              {showRating
                ? (row.original.playerRating! / 100).toFixed(2)
                : "*****"}
            </div>
          </div>
        </div>
      );
    },
  },

  {
    accessorKey: "score",
    header: ({ column }) => {
      return (
        <Button variant="ghost">
          Score
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const skillId = row.original.skillId as keyof typeof skillIds;
      const isClear = row.original.isClear;

      const skillIds = {
        100010: "Limit Break",
        100011: "Limit Break++",
        100012: "Limit Break+++",
        100013: "Campaign",
        101000: "Guard 【SUN】",
        101001: "Boost 【SUN】",
        101002: "Combo 【SUN】",
        101003: "A-Guilty 【SUN】",
        101004: "Judge 【SUN】",
        101005: "Judge++ 【SUN】",
        101006: "Emblem 【SUN】",
        101007: "Emblem++ 【SUN】",
        101008: "Absolute++【SUN】",
        102000: "Guard【LMN】",
        102001: "Boost 【LMN】",
        102002: "Combo【LMN】",
        102003: "A-Guilty【LMN】",
        102004: "Judge 【LMN】",
        102005: "Judge++【LMN】",
        102006: "Emblem【LMN】",
        102007: "Emblem++【LMN】",
        102008: "Absolute++ 【LMN】",
        102009: "Catastropy【LMN】",
        800003: "Clear",
      };

      let isSuccessText = "";

      if (isClear === 1) {
        isSuccessText = skillIds[skillId] || "Clear";
      } else if (isClear === 0) {
        isSuccessText = "Failed";
      } else {
        isSuccessText = isClear?.toString() ?? "";
      }

      return (
        <div>
          {row.original.score?.toLocaleString()}
          <div className="mt-2 w-40 rounded-sm bg-primary pl-2 text-primary-foreground">
            {isSuccessText}
          </div>
          <div
            className={`mt-2 w-40 rounded-sm pl-2 ${
              row.original.isNewRecord
                ? "bg-primary text-primary-foreground"
                : "invisible"
            }`}
          >
            <span>New!!</span>
          </div>
        </div>
      );
    },
  },

  {
    accessorKey: "grade",
    header: "Grade",
    cell: ({ row }) => (
      <div className="font-medium"> {getGrade(row.original.score ?? 0)}</div>
    ),
  },
  {
    accessorKey: "userPlayDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "level",
    header: "Level",
    cell: ({ row }) => (
      <div className="font-medium">
        {row.original.level}
        <br />
        {getDifficultyText(row.original.chartId)}
      </div>
    ),
    filterFn: (row, columnId, filterValue) => {
      const level = row.getValue(columnId);
      return Number(level) === Number(filterValue);
    },
  },

  {
    accessorKey: "FC / AJ",
    header: "FC / AJ",
    cell: ({ row }) => (
      <div className="font-medium">
        {!row.original.isAllJustice && row.original.isFullCombo && (
          <span>Full Combo</span>
        )}
        {row.original.isAllJustice && <span>All Justice</span>}
      </div>
    ),
  },

  {
    accessorKey: "Attempts",
    header: "Attempts",

    cell: ({ row }) => (
      <div className="font-medium">{row.original.playCount}</div>
    ),
  },
  // for fixing react-hooks/rules-of-hooks
  {
    id: "actions",
    header: () => <div className="pl-2 text-left">More</div>,
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];

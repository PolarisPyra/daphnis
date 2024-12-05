"use server";
import { getAuth } from "@/auth/queries/getauth";
import { getSupportedVersionNumber } from "@/lib/api";
import { artemis } from "@/lib/prisma";
import { parse } from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";

const TACHI_CLASSES = [
  undefined,
  "DAN_I",
  "DAN_II",
  "DAN_III",
  "DAN_IV",
  "DAN_V",
  "DAN_INFINITE",
] as const;
const TACHI_DIFFICULTIES = [
  "BASIC",
  "ADVANCED",
  "EXPERT",
  "MASTER",
  "ULTIMA",
] as const;

type BatchManualLamp =
  | "ALL JUSTICE CRITICAL"
  | "ALL JUSTICE"
  | "FULL COMBO"
  | "CLEAR"
  | "FAILED";
interface BatchManualScore {
  identifier: string;
  matchType: "inGameID";
  score: number;
  lamp: BatchManualLamp;
  difficulty: "BASIC" | "ADVANCED" | "EXPERT" | "MASTER" | "ULTIMA";
  timeAchieved?: number;
  judgements?: {
    jcrit: number;
    justice: number;
    attack: number;
    miss: number;
  };
  optional?: {
    maxCombo: number;
  };
}
interface BatchManualImport {
  meta: {
    game: string;
    playtype: string;
    service: string;
  };
  scores: BatchManualScore[];
  classes?: {
    dan?: string;
    emblem?: string;
  };
}

export async function getTachiExport() {
  const { user } = await getAuth();
  const version = await getSupportedVersionNumber();

  if (!user || !user.accessCode) {
    throw new Error("User is not authenticated or accessCode is missing");
  }

  const profile = await artemis.chuni_profile_data.findFirst({
    where: {
      user: user.UserId,
      version,
    },
    select: {
      classEmblemBase: true,
      classEmblemMedal: true,
    },
  });
  const playlog = await artemis.chuni_score_playlog.findMany({
    where: {
      user: user.UserId,
    },
    select: {
      romVersion: true,
      userPlayDate: true,
      musicId: true,
      level: true,
      score: true,
      maxCombo: true,
      judgeGuilty: true,
      judgeAttack: true,
      judgeJustice: true,
      judgeCritical: true,
      judgeHeaven: true,
      isFullCombo: true,
      isAllJustice: true,
      isClear: true,
    },
  });

  const tachiExport: BatchManualImport = {
    meta: {
      game: "chunithm",
      playtype: "Single",
      service: "Cozynet",
    },
    scores: [],
    classes: {
      dan: TACHI_CLASSES[profile?.classEmblemBase ?? 0],
      emblem: TACHI_CLASSES[profile?.classEmblemMedal ?? 0],
    },
  };

  for (const log of playlog) {
    const {
      romVersion,
      userPlayDate,
      musicId,
      level,
      score,
      judgeHeaven,
      judgeCritical,
      judgeJustice,
      judgeAttack,
      judgeGuilty,
      maxCombo,
      isAllJustice,
      isFullCombo,
      isClear,
    } = log;

    if (
      romVersion === null ||
      musicId === null ||
      level === null ||
      score === null ||
      judgeJustice === null ||
      isAllJustice === null ||
      isFullCombo === null ||
      isClear === null
    ) {
      continue;
    }

    // Filter out WORLD'S END scores
    if (romVersion.startsWith("1.") && level === 4) {
      continue;
    }

    if (romVersion.startsWith("2.") && level === 5) {
      continue;
    }

    let lamp: BatchManualLamp = "FAILED";

    if (isAllJustice && judgeJustice === 0) {
      lamp = "ALL JUSTICE CRITICAL";
    } else if (isAllJustice) {
      lamp = "ALL JUSTICE";
    } else if (isFullCombo) {
      lamp = "FULL COMBO";
    } else if (isClear) {
      lamp = "CLEAR";
    }

    const tachiScore: BatchManualScore = {
      score,
      lamp,
      identifier: musicId.toString(),
      matchType: "inGameID",
      difficulty: TACHI_DIFFICULTIES[level],
    };

    if (userPlayDate !== null) {
      tachiScore.timeAchieved = fromZonedTime(
        parse(
          userPlayDate,
          "yyyy-MM-dd HH:mm:ss",
          toZonedTime(new Date(), "Asia/Tokyo"),
        ),
        "Asia/Tokyo",
      ).valueOf();
    }

    if (
      judgeCritical !== null &&
      judgeJustice !== null &&
      judgeAttack !== null &&
      judgeGuilty !== null
    ) {
      tachiScore.judgements = {
        jcrit: (judgeHeaven ?? 0) + judgeCritical,
        justice: judgeJustice,
        attack: judgeAttack,
        miss: judgeGuilty,
      };
    }

    if (maxCombo !== null) {
      tachiScore.optional = {
        maxCombo,
      };
    }

    tachiExport.scores.push(tachiScore);
  }

  return tachiExport;
}

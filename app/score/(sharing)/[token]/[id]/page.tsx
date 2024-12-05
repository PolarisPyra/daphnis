import { getGrade } from "@/lib/helpers";
import {
  type chuni_score_playlog,
  chuni_static_music,
} from "@/prisma/schemas/artemis/generated/artemis";
import { shareScore } from "../token";
import { getPlaylogId, getSharedSong } from "./actions";

type chunithm = chuni_score_playlog &
  chuni_static_music & { playCount: number };

export default async function Share({
  params,
}: {
  // pass the token and playlog id as params www.www.com/generatedtoken/playlogid
  params: { token: string; id: string };
}) {
  const { token, id } = params;

  const tokenResult = await shareScore(token);

  if (tokenResult.error) {
    return <p>{tokenResult.error}</p>;
  }

  const playlogId = parseInt(id);

  const songsData = await getSharedSong(token);
  const playlogIds = await getPlaylogId(playlogId);

  if (!songsData) {
    return <p>Error: Something went wrong</p>;
  }

  const chunithm: chunithm[] = songsData.filter((song) =>
    playlogIds.includes(song.id),
  );

  return (
    <div className="min-h-screen bg-primary-foreground">
      <div className="flex flex-col items-center justify-center space-y-4 p-4 dark:text-black">
        <div className="w-full rounded-sm bg-gray-400 p-4 dark:bg-red-700 dark:text-black">
          {chunithm.map((song) => (
            <div key={song.id} className="w-full">
              <span className="text-center text-xl font-bold text-primary text-white">
                {song.title}
              </span>
            </div>
          ))}
        </div>

        <div className="d w-full rounded-sm bg-gray-400 bg-primary-foreground p-4 dark:bg-red-700">
          {chunithm.map((song) => (
            <div key={song.id} className="w-full">
              <span className="text-xl font-bold text-primary text-white">
                {song.artist}
              </span>
            </div>
          ))}
        </div>

        <div className="w-full rounded-sm bg-gray-400 bg-primary-foreground p-4 dark:bg-red-700">
          {chunithm.map((song) => (
            <div key={song.id} className="w-full">
              <span className="text-center text-xl font-bold text-primary text-white">
                Score: {song.score?.toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        <div className="w-full rounded-sm bg-gray-400 bg-primary-foreground p-4 dark:bg-red-700">
          {chunithm.map((song) => (
            <div key={song.id} className="w-full">
              <span className="text-center text-xl font-bold text-primary text-white">
                Rank: {getGrade(song.score ?? 0)}
              </span>
            </div>
          ))}
        </div>
        <div className="w-full rounded-sm bg-gray-400 bg-primary-foreground p-4 dark:bg-red-700">
          {chunithm.map((song) => (
            <div key={song.id} className="w-full">
              <div className="flex items-center justify-start">
                <span className="text-xl font-bold text-primary text-white">
                  {song.isFullCombo ? `FULL COMBO!  ${song.maxCombo}` : ""}
                </span>
                {!song.isFullCombo && (
                  <span className="text-xl font-bold text-primary text-white">
                    Max combo: {song.maxCombo}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="w-full rounded-sm bg-primary-foreground p-2">
          {chunithm.map((song) => (
            <div key={song.id} className="w-full">
              <div className="flex flex-col items-center justify-center">
                <span className="text-md w-full rounded-md bg-[#58329F] p-2 text-center font-bold text-primary text-white shadow-[inset_0px_3px_6px_0px_#1a202c]">
                  Justice Critical: {song.judgeCritical! + song.judgeHeaven!}
                </span>
                <span className="text-md mt-5 w-full rounded-md bg-[#58329F] p-2 text-center font-bold text-primary text-white shadow-[inset_0px_3px_6px_0px_#1a202c]">
                  Justice: {song.judgeJustice}
                </span>

                <span className="text-md mt-5 w-full rounded-md bg-[#58329F] p-2 text-center font-bold text-primary text-white shadow-[inset_0px_3px_6px_0px_#1a202c]">
                  Attack: {song.judgeAttack}
                </span>
                <span className="text-md mt-5 w-full rounded-md bg-[#58329F] p-2 text-center font-bold text-primary text-white shadow-[inset_0px_3px_6px_0px_#1a202c]">
                  Miss: {song.judgeGuilty}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

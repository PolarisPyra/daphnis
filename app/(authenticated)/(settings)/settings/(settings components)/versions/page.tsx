import { PlayerChangableChunithmGameVersionSelection } from "./gameSelection";
import { getGameList } from "./action";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const getAllGamesChunithm = async () => {
  const gameVersions = await getGameList();
  return { gameVersions };
};

const Versions = async () => {
  const AllChunithmVersions = await getAllGamesChunithm();

  return (
    <Card x-chunk="gameversions">
      <CardHeader>
        <CardTitle className="text-2xl">Update Game Versions</CardTitle>
      </CardHeader>
      <PlayerChangableChunithmGameVersionSelection
        chunithmGameVersionNumber={AllChunithmVersions}
      />
    </Card>
  );
};

export default Versions;

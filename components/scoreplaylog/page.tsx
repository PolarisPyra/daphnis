import { getAuth } from "@/auth/queries/getauth";
import { z } from "zod";
import { getSongsWithTitles } from "./action";
import { columns } from "./colums";
import { DataTable } from "./data-table";

const userSchema = z.object({
  UserId: z.number(),
});

const ChunithmScorePlaylog = async () => {
  const { user } = await getAuth();

  const loggedInUser = userSchema.safeParse(user);

  if (!loggedInUser.success) {
    return (
      <div className="p-10">
        <p>Failed to load user data</p>
      </div>
    );
  }

  const songs = await getSongsWithTitles(loggedInUser.data.UserId);

  return <DataTable columns={columns} data={songs} />;
};

export default ChunithmScorePlaylog;

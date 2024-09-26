"use client";
import { ColumnDef } from "@tanstack/react-table";
import { aime_user_game_locks } from "@/prisma/schemas/artemis/generated/artemis";
import { Button } from "@/components/ui/button";
import { Trash2, UnlockIcon } from "lucide-react";
import { deleteUserGameLocks } from "./action";
import { toast } from "@/components/ui/use-toast";
type chunithm = aime_user_game_locks & { userName: string | null };

const handleDelete = async (userId: number) => {
  try {
    const result = await deleteUserGameLocks(userId);
    if (result.success) {
      toast({
        title: "User Unlocked",
        description: (
          <pre className="mt-2 w-[340px] rounded-md p-4">
            <div className="text-white">Successfully unlocked the user</div>
          </pre>
        ),
      });
    } else {
      toast({
        title: "Failed to unlock user",
        description: (
          <pre className="mt-2 w-[340px] rounded-md p-4">
            <div className="text-white">User has already been unlocked</div>
          </pre>
        ),
      });
    }
  } catch (error) {
    console.error("Error deleting user game locks:", error);
  }
};
export const columns: ColumnDef<chunithm>[] = [
  {
    accessorKey: "Username",
    header: "Username",
    cell: ({ row }) => (
      <div className="text-bold flex items-center">
        <div className="ml-2 flex flex-col">
          {row.original.userName || `User ID: ${row.original.user}`}{" "}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "ExpiresDate",
    header: "Expiration Date",
    cell: ({ row }) => {
      const expirationDate = row.original.expires_at;
      const currentDate = new Date();

      if (!expirationDate) {
        return <div>N/A</div>;
      }

      const expirationDateTime = new Date(expirationDate).getTime();
      const currentDateTime = currentDate.getTime();
      const fifteenMinuteBuffer = 15 * 60 * 1000;

      if (expirationDateTime < currentDateTime - fifteenMinuteBuffer) {
        return <div>Expired</div>;
      }

      return <div>{new Date(expirationDate).toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: "deletelock",
    header: "Remove Lock",
    cell: ({ row }) => (
      <div>
        <Button
          className="hover:bg-red-400"
          variant="ghost"
          size="icon"
          onClick={() => handleDelete(row.original.user)}
        >
          <UnlockIcon className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

import { generateShareToken } from "@/app/score/(sharing)/[token]/token";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ActionsCellProps {
  row: any; //unsure what to use here
}

const ActionsCell: React.FC<ActionsCellProps> = ({ row }) => {
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleGenerateShareToken = async () => {
    const response = await generateShareToken(row.original.id);
    if (response.error) {
      setError(response.error);
    } else if (response.token) {
      const shareUrl = `/score/${response.token}/${row.original.id}`;
      const newTab = window.open(shareUrl, "_blank");
      if (newTab) {
        newTab.focus();
      } else {
        router.push(shareUrl);
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleGenerateShareToken}>
          Share Song
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionsCell;

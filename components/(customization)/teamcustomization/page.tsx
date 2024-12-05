"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { chuni_profile_team } from "@/prisma/schemas/artemis/generated/artemis";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "../../ui/use-toast";
import { addTeam, getCurrentTeams, updatePlayerTeam } from "./actions";

type teams = chuni_profile_team;

type TeamSelectionProps = {
  teamSelectionData: {
    teams: teams[];
  };
};

export const TeamCustomization: FC<TeamSelectionProps> = ({
  teamSelectionData,
}) => {
  const teamSelectionSchema = z.object({
    team: z.number({
      required_error: "Please select a team",
    }),
  });

  const teamCreationSchema = z.object({
    newTeamName: z.string().min(1, "Team name is required"),
  });

  const teamSelectionForm = useForm<z.infer<typeof teamSelectionSchema>>({
    resolver: zodResolver(teamSelectionSchema),
  });

  const teamCreationForm = useForm<z.infer<typeof teamCreationSchema>>({
    resolver: zodResolver(teamCreationSchema),
  });

  const [teamID, setTeamId] = useState<number | undefined>(undefined);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const data = await getCurrentTeams();
        if (data.length > 0) {
          const selectedTeam = data.find((team) => team.isCurrent);
          if (selectedTeam) {
            setTeamId(selectedTeam.id!);
            teamSelectionForm.setValue("team", selectedTeam.id);
          }
        }
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    fetchTeams();
  },);

  function onSubmitTeamSelection(data: z.infer<typeof teamSelectionSchema>) {
    const defaultTeamId = teamID;
    const newTeamId = data.team ?? defaultTeamId;

    updatePlayerTeam(newTeamId).then(() => {
      setTeamId(newTeamId);
    });

    toast({
      title: "Team updated",
      description: (
        <pre className="mt-2 w-[340px] rounded-md p-4">
          <code className="text-white">Team updated</code>
        </pre>
      ),
    });
  }

  function onSubmitTeamCreation(data: z.infer<typeof teamCreationSchema>) {
    addTeam(data.newTeamName).then(() => {
      toast({
        title: "New Team Added",
        description: `Team "${data.newTeamName}" has been added!`,
      });
      teamCreationForm.reset(); // Clear the input field after successful addition
    });
  }

  return (
    <main className="flex flex-col items-center space-y-6">
      <div>
        <Form {...teamSelectionForm}>
          <form
            onSubmit={teamSelectionForm.handleSubmit(onSubmitTeamSelection)}
            className="space-y-6"
          >
            <FormField
              control={teamSelectionForm.control}
              name="team"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="pb-2">Select Team</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[400px] justify-between",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value
                            ? teamSelectionData.teams.find(
                                (team) => team.id === field.value,
                              )?.teamName
                            : "Select Team"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0">
                      <Command>
                        <CommandList>
                          <CommandEmpty>No teams found.</CommandEmpty>
                          <CommandGroup>
                            {teamSelectionData.teams.map((team) => (
                              <CommandItem
                                value={team.id.toString()}
                                key={team.id}
                                onSelect={() => {
                                  teamSelectionForm.setValue("team", team.id);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    team.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {team.teamName}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit">Update Team</Button>
            </div>
          </form>
        </Form>

        <Form {...teamCreationForm}>
          <form
            onSubmit={teamCreationForm.handleSubmit(onSubmitTeamCreation)}
            className="space-y-6"
          >
            <FormField
              control={teamCreationForm.control}
              name="newTeamName"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="pb-2">Create Team</FormLabel>
                  <Input
                    placeholder="Enter new team name"
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit">Create Team</Button>
            </div>
          </form>
        </Form>
      </div>
    </main>
  );
};

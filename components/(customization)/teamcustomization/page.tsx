"use client";

import React, { FC, useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "../../ui/use-toast";
import { getCurrentTeams, updatePlayerTeam } from "./actions";
import { chuni_profile_team } from "@/prisma/schemas/artemis/generated/artemis";

type teams = chuni_profile_team;

type TeamSelectionProps = {
  teamSelectionData: {
    teams: teams[];
  };
};

export const TeamCustomization: FC<TeamSelectionProps> = ({
  teamSelectionData,
}) => {
  const FormSchema = z.object({
    team: z.number({
      required_error: "Please select a team",
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
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
            form.setValue("team", selectedTeam.id);
          }
        }
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    fetchTeams();
  }, []);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const defaultTeamId = teamID;
    const newTeamId = data.team ?? defaultTeamId;

    updatePlayerTeam(newTeamId).then(() => {
      setTeamId(newTeamId);
  
    });

    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md p-4">
          <code className="text-white">Team updated</code>
        </pre>
      ),
    });
  }

  return (
    <main className="flex flex-col items-center space-y-6">
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
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
                                  form.setValue("team", team.id);
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
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Form>
      </div>
    </main>
  );
};

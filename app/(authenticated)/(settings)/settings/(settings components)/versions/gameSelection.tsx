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
import { toast } from "@/components/ui/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GameVersion } from "@/prisma/schemas/daphnis/generated/daphnis";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getGameList, updatePlayerGameVersionChuni } from "./action";

type ChunithmGameVersionSelectionProps = {
  chunithmGameVersionNumber: {
    gameVersions: { gameVersion: GameVersion }[];
  };
};
export function PlayerChangableChunithmGameVersionSelection({}: ChunithmGameVersionSelectionProps) {
  const FormSchema = z.object({
    gameVersion: z.string({
      required_error: "Please select a Game Version.",
    }),
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const [selectedGameVersion, setSelectedGameVersion] = useState<
    string | undefined
  >(undefined);

  useEffect(() => {
    async function fetchCurrentGameVersion() {
      try {
        const gameList = await getGameList();
        const currentVersion = gameList[0]?.gameVersion;
        setSelectedGameVersion(currentVersion);
        form.setValue("gameVersion", currentVersion);
      } catch (error) {
        console.error("Error fetching current game version:", error);
      }
    }
    fetchCurrentGameVersion();
  }, []);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const newGameVersion = data.gameVersion ?? selectedGameVersion;

    updatePlayerGameVersionChuni(newGameVersion as GameVersion)
      .then((result) => {
        toast({
          title: "Game version updated successfully!",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">
                {JSON.stringify(result, null, 2)}
              </code>
            </pre>
          ),
        });

        setSelectedGameVersion(newGameVersion);

        form.reset({
          gameVersion: undefined,
        });
      })
      .catch((error) => {
        toast({
          title: "Error updating game version",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">{error.message}</code>
            </pre>
          ),
          variant: "destructive",
        });
      });
  }

  return (
    <main className="flex flex-col items-center space-y-6 p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="gameVersion"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="pb-2">
                  Chunithm:&nbsp;
                  {selectedGameVersion
                    ? GameVersion[
                        selectedGameVersion as keyof typeof GameVersion
                      ]
                    : "No game version... Please select a game version"}
                </FormLabel>{" "}
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-[300px] justify-between",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value
                          ? GameVersion[field.value as keyof typeof GameVersion]
                          : "Select Game Version"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0">
                    <Command>
                      <CommandList>
                        <CommandEmpty>No game version found.</CommandEmpty>
                        <CommandGroup>
                          {Object.values(GameVersion).map((version) => (
                            <CommandItem
                              value={version}
                              key={version}
                              onSelect={() => {
                                form.setValue("gameVersion", version);
                                setSelectedGameVersion(version);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  version === field.value
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              {version}
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
    </main>
  );
}

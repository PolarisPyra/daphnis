"use client";

import React, { FC, useEffect, useState } from "react";
import { chuni_static_avatar } from "@/prisma/schemas/artemis/generated/artemis";
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
import { getCurrentTrophies, updatePlayerTrophy } from "./actions";
import { chuni_static_trophies } from "@/prisma/schemas/daphnis/generated/daphnis";

type static_trophies = chuni_static_trophies;

type AvatarSelectionProps = {
  playerTrophySelectionData: {
    statictrophies: static_trophies[];
  };
};

const honorBackgrounds = {
  0: "honorBackgrounds/honor_bg_normal.png",
  1: "honorBackgrounds/honor_bg_bronze.png",
  2: "honorBackgrounds/honor_bg_silver.png",
  3: "honorBackgrounds/honor_bg_gold.png",
  4: "honorBackgrounds/honor_bg_gold.png",
  5: "honorBackgrounds/honor_bg_platina.png",
  6: "honorBackgrounds/honor_bg_platina.png",
  7: "honorBackgrounds/honor_bg_rainbow.png",
  9: "honorBackgrounds/honor_bg_staff.png",
  10: "honorBackgrounds/honor_bg_ongeki.png",
  11: "honorBackgrounds/honor_bg_maimai.png",
  null: "",
};

export const TrophyCustomization: FC<AvatarSelectionProps> = ({
  playerTrophySelectionData,
}) => {
  const FormSchema = z.object({
    trophies: z.number({
      required_error: "Please select a trophy",
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const [trophyID, setTrophyId] = useState<number | undefined>(undefined);
  const [selectedTrophyData, setSelectedTrophyData] = useState<
    static_trophies | undefined
  >(undefined);

  useEffect(() => {
    const fetchTrophies = async () => {
      try {
        const data = await getCurrentTrophies();
        if (data.length > 0) {
          setTrophyId(data[0].trophyId!);
          form.setValue("trophies", data[0].trophyId as number);
          const initialTrophy = playerTrophySelectionData.statictrophies.find(
            (part) => part.id === data[0].trophyId,
          );
          setSelectedTrophyData(initialTrophy);
        }
      } catch (error) {
        console.error("Error fetching trophies:", error);
      }
    };

    fetchTrophies();
  }, []);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const defaultNamePlateId = trophyID;
    const newNamePlateId = data.trophies ?? defaultNamePlateId;

    updatePlayerTrophy(newNamePlateId).then(() => {
      setTrophyId(newNamePlateId);
    });

    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md p-4">
          <code className="text-white">Trophy updated</code>
        </pre>
      ),
    });
  }

  const backgroundImage =
    selectedTrophyData?.rareType != null
      ? honorBackgrounds[
          selectedTrophyData.rareType as keyof typeof honorBackgrounds
        ] || honorBackgrounds[0]
      : honorBackgrounds[0];

  return (
    <main className="flex flex-col items-center space-y-6">
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="trophies"
              render={({ field }) => (
                <FormItem className="relative flex flex-col">
                  <div className="relative">
                    <img
                      className="h-[40px] w-[400px]"
                      src={backgroundImage}
                      alt="Honor BG"
                    />
                    {selectedTrophyData && (
                      <div className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center">
                        <span className="text-center text-sm font-bold text-black">
                          {selectedTrophyData.str}
                        </span>
                      </div>
                    )}
                  </div>
                  <FormLabel className="pb-2">Select Trophy</FormLabel>
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
                            ? playerTrophySelectionData.statictrophies.find(
                                (part) => part.id === field.value,
                              )?.str
                            : "Select Trophy"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0">
                      <Command>
                        <CommandList>
                          <CommandEmpty>No trophies part found.</CommandEmpty>
                          <CommandGroup>
                            {playerTrophySelectionData.statictrophies.map(
                              (part) => (
                                <CommandItem
                                  value={part.id.toString()}
                                  key={part.id}
                                  onSelect={() => {
                                    form.setValue("trophies", part.id);
                                    setSelectedTrophyData(part);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      part.id === field.value
                                        ? "opacity-100"
                                        : "opacity-0",
                                    )}
                                  />
                                  {part.str}
                                </CommandItem>
                              ),
                            )}
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

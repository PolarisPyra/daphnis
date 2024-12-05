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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { chuni_static_mapicon } from "@/prisma/schemas/daphnis/generated/daphnis";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "../../ui/use-toast";
import { getCurrentMapIcon, updatePlayerMapIcon } from "./actions";

const getNamePlateTextures = (id: number | undefined) => {
  if (id === undefined) return "";
  const paddedId = id.toString().padStart(8, "0");
  return `mapIcons/CHU_UI_MapIcon_${paddedId}.png`;
};

type mapIcons = chuni_static_mapicon;

type SystemVoiceSelectionProps = {
  playerMapIconCustomization: {
    mapIcon: mapIcons[];
  };
};

export const MapIconCustomization: FC<SystemVoiceSelectionProps> = ({
  playerMapIconCustomization,
}) => {
  const FormSchema = z.object({
    mapIconId: z.number({
      required_error: "Please select an Map Icon.",
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const [mapIconId, setMapIconId] = useState<number | undefined>(undefined);
  useEffect(() => {
    const fetchMapIcons = async () => {
      try {
        const data = await getCurrentMapIcon();
        if (data.length > 0) {
          setMapIconId(data[0].mapIconId ?? undefined);
          form.setValue("mapIconId", data[0].mapIconId as number);
        }
      } catch (error) {
        console.error("Error fetching map icons:", error);
      }
    };

    fetchMapIcons();
  }, []);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const uncangedMapIconId = mapIconId;
    const newMapIconId = data.mapIconId ?? uncangedMapIconId;

    updatePlayerMapIcon(newMapIconId).then(() => {
      setMapIconId(newMapIconId);
    });

    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md p-4">
          <div className="text-white">Map icon updated</div>
        </pre>
      ),
    });
  }

  const getTexture = (id: number | undefined, defaultSrc: string) => {
    return id ? getNamePlateTextures(id) : defaultSrc;
  };

  const MapIconTextures = {
    mapIconId: {
      src: mapIconId
        ? getTexture(
            form.watch("mapIconId"),

            `mapIcons/CHU_UI_MapIcon_${mapIconId.toString().padStart(8, "0")}.png`,
          )
        : "systemVoiceThumbnails/CHU_UI_SystemVoice_Default.png",
    },
  };

  return (
    <main className="flex flex-col items-center space-y-6">
      <div className="flex w-full justify-center">
        <div className="">
          {Object.entries(MapIconTextures).map(([key, { src }]) => (
            <div key={key}>
              <img
                className="w-[100px]"
                src={src}
                alt={mapIconId ? `Map Icon ${mapIconId}` : "Default Map Icon"}
              />
            </div>
          ))}
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="mapIconId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="pb-2">Select Map Icon</FormLabel>
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
                          ? playerMapIconCustomization.mapIcon.find(
                              (part) => part.id === field.value,
                            )?.str
                          : "Select Map Icon"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0">
                    <Command>
                      <CommandList>
                        <CommandEmpty>No name plate found.</CommandEmpty>
                        <CommandGroup>
                          {playerMapIconCustomization.mapIcon.map((part) => (
                            <CommandItem
                              value={part.str ?? ""}
                              key={part.id}
                              onSelect={() => {
                                form.setValue("mapIconId", part.id!);
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
};

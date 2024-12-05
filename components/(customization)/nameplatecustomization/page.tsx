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
  FormMessage
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { chuni_static_nameplate } from "@/prisma/schemas/daphnis/generated/daphnis";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "../../ui/use-toast";
import { getCurrentNameplate, updatePlayerNamePlate } from "./actions";

const getNamePlateTextures = (id: number | undefined) => {
  if (id === undefined) return "";
  // Pad the id to be 8 digits long, using leading zeros
  const paddedId = id.toString().padStart(8, "0");
  return `namePlates/CHU_UI_NamePlate_${paddedId}.png`;
};

type player_nameplates = chuni_static_nameplate;

type NamePlateSelectionProps = {
  playerNamePlateSelectionData: {
    namePlates: player_nameplates[];
  };
};

export const NameplateCustomization: FC<NamePlateSelectionProps> = ({
  playerNamePlateSelectionData,
}) => {
  const FormSchema = z.object({
    nameplateId: z.number({
      required_error: "Please select an NamePlate Head Item.",
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const [nameplateId, setNameplateId] = useState<number | undefined>(undefined);
  useEffect(() => {
    const fetchNamePlates = async () => {
      try {
        const data = await getCurrentNameplate();
        if (data.length > 0) {
          setNameplateId(data[0].nameplateId!);
          form.setValue("nameplateId", data[0].nameplateId as number);
        }
      } catch (error) {
        console.error("Error fetching NamePlate parts:", error);
      }
    };

    fetchNamePlates();
  }, );

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const defaultNamePlateId = nameplateId;
    const newNamePlateId = data.nameplateId ?? defaultNamePlateId;

    updatePlayerNamePlate(newNamePlateId).then(() => {
      setNameplateId(newNamePlateId);
    });

    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md p-4">
          <code className="text-white">Nameplate updated</code>
        </pre>
      ),
    });
  }

  const getTexture = (id: number | undefined, defaultSrc: string) => {
    return id ? getNamePlateTextures(id) : defaultSrc;
  };

  const namePlateTextures = {
    namePlateTexture: {
      src: nameplateId
        ? getTexture(
            form.watch("nameplateId"),

            `namePlates/CHU_UI_NamePlate_${nameplateId.toString().padStart(8, "0")}.png`,
          )
        : "systemVoiceThumbnails/CHU_UI_SystemVoice_Default.png",
    },
  };

  return (
    <main className="flex flex-col items-center space-y-6">
      <div className="flex w-full justify-center">
        {Object.entries(namePlateTextures).map(([key, { src }]) => (
          <div key={key}>
            <img className="w-[300px]" src={src} alt={`Name Plate ${key}`} />
          </div>
        ))}
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="nameplateId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="pb-2">Select Nameplate</FormLabel>
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
                          ? playerNamePlateSelectionData.namePlates.find(
                              (part) => part.id === field.value,
                            )?.str
                          : "Select Name Plate"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0">
                    <Command>
                      <CommandList>
                        <CommandEmpty>No name plate found.</CommandEmpty>
                        <CommandGroup>
                          {playerNamePlateSelectionData.namePlates.map(
                            (part) => (
                              <CommandItem
                                value={part.str ?? ""}
                                key={part.id}
                                onSelect={() => {
                                  form.setValue("nameplateId", part.id!);
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
    </main>
  );
};

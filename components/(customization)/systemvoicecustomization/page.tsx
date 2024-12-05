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
import { chuni_static_systemvoice } from "@/prisma/schemas/daphnis/generated/daphnis";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "../../ui/use-toast";
import { getCurrentSystemVoice, updatePlayerSystemVoiceId } from "./actions";

const getNamePlateTextures = (id: number | undefined) => {
  if (id === undefined) return "";
  // Pad the id to be 8 digits long, using leading zeros
  const paddedId = id.toString().padStart(8, "0");
  return `systemVoiceThumbnails/CHU_UI_SystemVoice_${paddedId}.png`;
};

type systemvoice = chuni_static_systemvoice;

type SystemVoiceSelectionProps = {
  playerSystemVoiceSelectionData: {
    systemVoices: systemvoice[];
  };
};

export const SystemVoiceCustomization: FC<SystemVoiceSelectionProps> = ({
  playerSystemVoiceSelectionData,
}) => {
  const FormSchema = z.object({
    PlayerSystemVoice: z.number({
      required_error: "Please select a System Voice.",
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const [systemVoiceId, setSytemVoiceId] = useState<number | undefined>(
    undefined,
  );

  useEffect(() => {
    const fetchSystemVoices = async () => {
      try {
        const data = await getCurrentSystemVoice();
        if (data.length > 0) {
          setSytemVoiceId(data[0].voiceId!);
          form.setValue("PlayerSystemVoice", data[0].voiceId as number);
        }
      } catch (error) {
        console.error("Error fetching system voices:", error);
      }
    };

    fetchSystemVoices();
  }, );

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const unchagedSystemVoiceId = systemVoiceId;
    const newSystemVoiceId = data.PlayerSystemVoice ?? unchagedSystemVoiceId;

    updatePlayerSystemVoiceId(newSystemVoiceId).then(() => {
      setSytemVoiceId(newSystemVoiceId);
    });

    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="rounded-mdp-4 mt-2 w-[340px]">
          <code className="text-white">System voice updated</code>
        </pre>
      ),
    });
  }

  const getTexture = (id: number | undefined, defaultSrc: string) => {
    return id ? getNamePlateTextures(id) : defaultSrc;
  };

  const systemVoiceTextures = {
    SystemVoice: {
      src: systemVoiceId
        ? getTexture(
            form.watch("PlayerSystemVoice"),
            `systemVoiceThumbnails/CHU_UI_SystemVoice_${systemVoiceId.toString().padStart(8, "0")}.png`,
          )
        : "systemVoiceThumbnails/CHU_UI_SystemVoice_Default.png",
    },
  };

  return (
    <main className="flex flex-col items-center space-y-6">
      <div className="flex w-full justify-center">
        {Object.entries(systemVoiceTextures).map(([key, { src }]) => (
          <div key={key}>
            <img
              className="w-[200px]"
              src={src}
              alt={`System Voice Texture ${key}`}
            />
          </div>
        ))}
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="PlayerSystemVoice"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="pb-2">Select System Voice</FormLabel>
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
                          ? playerSystemVoiceSelectionData.systemVoices.find(
                              (part) => part.id === field.value,
                            )?.str
                          : "Select System Voice"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0">
                    <Command>
                      <CommandList>
                        <CommandEmpty>No system voice found.</CommandEmpty>
                        <CommandGroup>
                          {playerSystemVoiceSelectionData.systemVoices.map(
                            (part) => (
                              <CommandItem
                                value={part.str ?? ""}
                                key={part.id}
                                onSelect={() => {
                                  form.setValue("PlayerSystemVoice", part.id!);
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

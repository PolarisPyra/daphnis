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
import { chuni_static_trophies } from "@/prisma/schemas/daphnis/generated/daphnis";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "../../ui/use-toast";
import { getCurrentTrophies, updatePlayerTrophy } from "./actions";

type static_trophies = chuni_static_trophies;

type AvatarSelectionProps = {
  playerTrophySelectionData: {
    statictrophies: static_trophies[];
  };
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

  useEffect(() => {
    const fetchTrophies = async () => {
      try {
        const data = await getCurrentTrophies();
        if (data.length > 0) {
          setTrophyId(data[0].trophyId!);
          form.setValue("trophies", data[0].trophyId as number);
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

  return (
    <main className="flex flex-col items-center space-y-6">
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="trophies"
              render={({ field }) => (
                <FormItem className="flex flex-col">
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

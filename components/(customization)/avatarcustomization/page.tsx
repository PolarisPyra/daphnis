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
import { chuni_static_avatar } from "@/prisma/schemas/artemis/generated/artemis";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "../../ui/use-toast";
import { getCurrentAvatarParts, updateAvatarParts } from "./actions";
type chunithm_avatar = chuni_static_avatar;

const getAvatarTextureSrc = (id: number | undefined) => {
  if (id === undefined) return "";
  return `avatarAccessories/CHU_UI_Avatar_Tex_0${id}.png`;
};

type AvatarSelectionProps = {
  avatarHeadSelectionData: {
    avatarParts: chunithm_avatar[];
  };
  avatarFaceSelectionData: {
    avatarParts: chunithm_avatar[];
  };
  avatarItemSelectionData: {
    avatarParts: chunithm_avatar[];
  };
  avatarBackSelectionData: {
    avatarParts: chunithm_avatar[];
  };
  avatarWearSelectionData: {
    avatarParts: chunithm_avatar[];
  };
};
export const AvatarCustomization: FC<AvatarSelectionProps> = ({
  avatarHeadSelectionData,
  avatarFaceSelectionData,
  avatarItemSelectionData,
  avatarBackSelectionData,
  avatarWearSelectionData,
}) => {
  const FormSchema = z.object({
    AvatarHeadAccessory: z.number().optional(),
    AvatarFaceAccessory: z.number().optional(),
    AvatarItemAccessory: z.number().optional(),
    AvatarBackAccessory: z.number().optional(),
    AvatarWearAccessory: z.number().optional(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const [avatarFaceId, setAvatarFaceId] = useState<number | undefined>(
    undefined,
  );
  const [avatarSkinId, setAvatarSkinId] = useState<number | undefined>(
    undefined,
  );
  const [avatarHeadId, setAvatarHeadId] = useState<number | undefined>(
    undefined,
  );
  const [avatarWearId, setAvatarWearId] = useState<number | undefined>(
    undefined,
  );
  const [avatarBackId, setAvatarBackId] = useState<number | undefined>(
    undefined,
  );
  const [avatarItemId, setAvatarItemId] = useState<number | undefined>(
    undefined,
  );

  useEffect(() => {
    const fetchAvatarParts = async () => {
      try {
        const avatarData = await getCurrentAvatarParts();
        const [currentAvatarParts] = avatarData;
        if (currentAvatarParts) {
          setAvatarFaceId(currentAvatarParts.avatarFace ?? undefined);
          setAvatarSkinId(currentAvatarParts.avatarSkin ?? undefined);
          setAvatarHeadId(currentAvatarParts.avatarHead ?? undefined);
          setAvatarWearId(currentAvatarParts.avatarWear ?? undefined);
          setAvatarBackId(currentAvatarParts.avatarBack ?? undefined);
          setAvatarItemId(currentAvatarParts.avatarItem ?? undefined);

          // Set initial form values based on fetched data
          form.reset({
            AvatarHeadAccessory: currentAvatarParts.avatarHead ?? undefined,
            AvatarFaceAccessory: currentAvatarParts.avatarFace ?? undefined,
            AvatarItemAccessory: currentAvatarParts.avatarItem ?? undefined,
            AvatarBackAccessory: currentAvatarParts.avatarBack ?? undefined,
            AvatarWearAccessory: currentAvatarParts.avatarWear ?? undefined,
          });
        }
      } catch (error) {
        console.error("Error fetching avatar parts:", error);
      }
    };

    fetchAvatarParts();
  }, [form]);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const newHeadId = data.AvatarHeadAccessory ?? avatarHeadId;
    const newFaceId = data.AvatarFaceAccessory ?? avatarFaceId;
    const newBackId = data.AvatarBackAccessory ?? avatarBackId;
    const newWearId = data.AvatarWearAccessory ?? avatarWearId;
    const newItemId = data.AvatarItemAccessory ?? avatarItemId;

    updateAvatarParts(newHeadId, newFaceId, newBackId, newWearId, newItemId)
      .then(() => {
        setAvatarHeadId(newHeadId);
        setAvatarFaceId(newFaceId);
        setAvatarBackId(newBackId);
        setAvatarWearId(newWearId);
        setAvatarItemId(newItemId);

        toast({
          title: "Avatar updated successfully!",
          description: (
            <pre className="mt-2 w-[340px] rounded-md p-4">
              <div className="text-white">Avatar updated</div>
            </pre>
          ),
        });
      })
      .catch((error) => {
        toast({
          title: "Error updating avatar",
          description: error.message,
          variant: "destructive",
        });
      });
  }

  const getTexture = (id: number | undefined, defaultSrc: string) => {
    return id ? getAvatarTextureSrc(id) : defaultSrc;
  };

  const AvatarTextures = {
    AvatarHeadAccessory: {
      src: getTexture(
        form.watch("AvatarHeadAccessory"),
        `avatarAccessories/CHU_UI_Avatar_Tex_0${avatarHeadId}.png`,
      ),
      className: "avatar_head",
    },
    AvatarFaceAccessory: {
      src: getTexture(
        form.watch("AvatarFaceAccessory"),
        `avatarAccessories/CHU_UI_Avatar_Tex_0${avatarFaceId}.png`,
      ),
      className: "avatar_face",
    },
    AvatarItemAccessoryR: {
      src: getTexture(
        form.watch("AvatarItemAccessory"),
        `avatarAccessories/CHU_UI_Avatar_Tex_0${avatarItemId}.png`,
      ),
      className: "avatar_item_r ",
    },
    AvatarItemAccessoryL: {
      src: getTexture(
        form.watch("AvatarItemAccessory"),
        `avatarAccessories/CHU_UI_Avatar_Tex_0${avatarItemId}.png`,
      ),
      className: "avatar_item_l ",
    },
    AvatarBackAccessory: {
      src: getTexture(
        form.watch("AvatarBackAccessory"),
        `avatarAccessories/CHU_UI_Avatar_Tex_0${avatarBackId}.png`,
      ),
      className: "avatar_back",
    },
    AvatarWearAccessory: {
      src: getTexture(
        form.watch("AvatarWearAccessory"),
        `avatarAccessories/CHU_UI_Avatar_Tex_0${avatarWearId}.png`,
      ),
      className: "avatar_wear",
    },
    avatarSkinAccessory: {
      src: getTexture(
        avatarSkinId,
        `avatarAccessories/CHU_UI_Avatar_Tex_0${avatarSkinId}.png`,
      ),
      className: "avatar_skin",
    },
    AvatarRightHand: {
      src: "avatarStatic/CHU_UI_Avatar_Tex_RightHand.png",
      className: "avatar_hand_r",
    },

    AvatarSkinFootR: {
      src: `avatarAccessories/CHU_UI_Avatar_Tex_0${avatarSkinId}.png`,
      className: "avatar_skinfoot_r",
    },
    AvatarLeftHand: {
      src: "avatarStatic/CHU_UI_Avatar_Tex_LeftHand.png",
      className: "avatar_hand_l",
    },
    AvatarSkinFootL: {
      src: `avatarAccessories/CHU_UI_Avatar_Tex_0${avatarSkinId}.png`,

      className: "avatar_skinfoot_l",
    },
    AvatarFaceStatic: {
      src: "avatarStatic/CHU_UI_Avatar_Tex_Face.png",
      className: "avatar_face_static",
    },
  };

  return (
    <main className="flex flex-col items-center space-y-6">
      {/* Avatar Customization Section */}
      <div className="flex w-full justify-center">
        <div className="avatar_base">
          {Object.entries(AvatarTextures).map(([key, { className, src }]) => (
            <div className={className} key={key}>
              <img src={src} alt={key} />
            </div>
          ))}
        </div>
      </div>

      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="AvatarHeadAccessory"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="pb-2">Avatar Head Item</FormLabel>
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
                            ? avatarHeadSelectionData.avatarParts.find(
                                (part) =>
                                  part.avatarAccessoryId === field.value,
                              )?.name
                            : "Select Avatar Head Item"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0">
                      <Command>
                        <CommandList>
                          <CommandEmpty>No avatar part found.</CommandEmpty>
                          <CommandGroup>
                            {avatarHeadSelectionData.avatarParts.map((part) => (
                              <CommandItem
                                value={part.name ?? ""}
                                key={part.avatarAccessoryId}
                                onSelect={() => {
                                  form.setValue(
                                    "AvatarHeadAccessory",
                                    part.avatarAccessoryId!,
                                  );
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    part.avatarAccessoryId === field.value
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {part.name}
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

            <FormField
              control={form.control}
              name="AvatarFaceAccessory"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="pb-2">Avatar Face Item</FormLabel>
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
                            ? avatarFaceSelectionData.avatarParts.find(
                                (part) =>
                                  part.avatarAccessoryId === field.value,
                              )?.name
                            : "Select Avatar Face Item"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0">
                      <Command>
                        <CommandList>
                          <CommandEmpty>No avatar part found.</CommandEmpty>
                          <CommandGroup>
                            {avatarFaceSelectionData.avatarParts.map((part) => (
                              <CommandItem
                                value={part.name ?? ""}
                                key={part.avatarAccessoryId}
                                onSelect={() => {
                                  form.setValue(
                                    "AvatarFaceAccessory",
                                    part.avatarAccessoryId!,
                                  );
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    part.avatarAccessoryId === field.value
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {part.name}
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

            <FormField
              control={form.control}
              name="AvatarItemAccessory"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="pb-2">Avatar Hand Item</FormLabel>
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
                            ? avatarItemSelectionData.avatarParts.find(
                                (part) =>
                                  part.avatarAccessoryId === field.value,
                              )?.name
                            : "Select Avatar Face Item"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0">
                      <Command>
                        <CommandList>
                          <CommandEmpty>No avatar part found.</CommandEmpty>
                          <CommandGroup>
                            {avatarItemSelectionData.avatarParts.map((part) => (
                              <CommandItem
                                value={part.name ?? ""}
                                key={part.avatarAccessoryId}
                                onSelect={() => {
                                  form.setValue(
                                    "AvatarItemAccessory",
                                    part.avatarAccessoryId!,
                                  );
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    part.avatarAccessoryId === field.value
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {part.name}
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

            <FormField
              control={form.control}
              name="AvatarBackAccessory"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="pb-2">Avatar Back Item</FormLabel>
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
                            ? avatarBackSelectionData.avatarParts.find(
                                (part) =>
                                  part.avatarAccessoryId === field.value,
                              )?.name
                            : "Select Avatar Back Item"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0">
                      <Command>
                        <CommandList>
                          <CommandEmpty>No avatar part found.</CommandEmpty>
                          <CommandGroup>
                            {avatarBackSelectionData.avatarParts.map((part) => (
                              <CommandItem
                                value={part.name ?? ""}
                                key={part.avatarAccessoryId}
                                onSelect={() => {
                                  form.setValue(
                                    "AvatarBackAccessory",
                                    part.avatarAccessoryId!,
                                  );
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    part.avatarAccessoryId === field.value
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {part.name}
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

            <FormField
              control={form.control}
              name="AvatarWearAccessory"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="pb-2">Avatar Clothing Item</FormLabel>
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
                            ? avatarWearSelectionData.avatarParts.find(
                                (part) =>
                                  part.avatarAccessoryId === field.value,
                              )?.name
                            : "Select Avatar Clothing Item"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0">
                      <Command>
                        <CommandList>
                          <CommandEmpty>No avatar part found.</CommandEmpty>
                          <CommandGroup>
                            {avatarWearSelectionData.avatarParts.map((part) => (
                              <CommandItem
                                value={part.name ?? ""}
                                key={part.avatarAccessoryId}
                                onSelect={() => {
                                  form.setValue(
                                    "AvatarWearAccessory",
                                    part.avatarAccessoryId!,
                                  );
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    part.avatarAccessoryId === field.value
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {part.name}
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

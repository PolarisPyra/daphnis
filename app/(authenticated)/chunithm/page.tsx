"use server";
//https://github.com/vercel/next.js/discussions/63862
import React from "react";
import { AvatarCustomization } from "@/components/(customization)/avatarcustomization/page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChunithmScorePlaylog from "@/components/scoreplaylog/page";
import { getAllAvatarParts } from "@/components/(customization)/avatarcustomization/actions";
import { TrophyCustomization } from "@/components/(customization)/trophycustomization/page";
import { getTrophies } from "@/components/(customization)/trophycustomization/actions";
import { NameplateCustomization } from "@/components/(customization)/nameplatecustomization/page";
import { getNamePlates } from "@/components/(customization)/nameplatecustomization/actions";
import { getSystemVoices } from "@/components/(customization)/systemvoicecustomization/actions";
import { SystemVoiceCustomization } from "@/components/(customization)/systemvoicecustomization/page";
import { MapIconCustomization } from "@/components/(customization)/mapiconcustomization/page";
import { getMapIcons } from "@/components/(customization)/mapiconcustomization/actions";
import { getUserRatingBaseList } from "@/components/userRatingBaseList/action";
import { ChunithmHotPlays } from "@/components/userRatingBaseHotList/page";
import { getUserRatingBaseHotList } from "@/components/userRatingBaseHotList/action";
import { ChunithmTopPlays } from "@/components/userRatingBaseList/page";
import { ChunithmNextPlays } from "@/components/userRatingBaseNextList/page";
import { getUserRatingBaseNextList } from "@/components/userRatingBaseNextList/action";
import { KamaitachiExport } from "@/components/kamaitachi/kamaitachi";
import { TeamCustomization } from "@/components/(customization)/teamcustomization/page";
import { getCurrentTeams } from "@/components/(customization)/teamcustomization/actions";
import Patcher from "@/components/patcher/page";

const getAllChuniTeams = async () => {
  const teams = await getCurrentTeams();
  return { teams };
};

const getChuniTopPlays = async () => {
  const topPlays = await getUserRatingBaseList();
  return { topPlays };
};

const getChuniNextPlays = async () => {
  const nextPlays = await getUserRatingBaseNextList();
  return { nextPlays };
};
const getChuniHotPlays = async () => {
  const hotRating = await getUserRatingBaseHotList();
  return { hotRating };
};

const getAvatarHeadAccessories = async () => {
  const avatarParts = await getAllAvatarParts(2); // head
  return { avatarParts };
};

const getAvatarFaceAccessories = async () => {
  const avatarParts = await getAllAvatarParts(3); // face
  return { avatarParts };
};

const getAvatarItemAccessories = async () => {
  const avatarParts = await getAllAvatarParts(5); // item_l item_r
  return { avatarParts };
};

const getAvatarBackAccessories = async () => {
  const avatarParts = await getAllAvatarParts(7); // back
  return { avatarParts };
};

const getAvatarWearAccessories = async () => {
  const avatarParts = await getAllAvatarParts(1); // wear
  return { avatarParts };
};

const getAllTrophies = async () => {
  const statictrophies = await getTrophies();
  return { statictrophies };
};

const getAllNameplates = async () => {
  const namePlates = await getNamePlates();
  return { namePlates };
};

const getAllSystemVoices = async () => {
  const systemVoices = await getSystemVoices();
  return { systemVoices };
};

const getAllMapIcons = async () => {
  const mapIcon = await getMapIcons();
  return { mapIcon };
};

const Page = async () => {
  const AvatarHeadAccessories = await getAvatarHeadAccessories();
  const AvatarFaceAccessories = await getAvatarFaceAccessories();
  const AvatarItemAccessories = await getAvatarItemAccessories();
  const AvatarBackAccessories = await getAvatarBackAccessories();
  const AvatarWearAccessories = await getAvatarWearAccessories();
  const AllPlayerTrophies = await getAllTrophies();
  const AllStaticNameplates = await getAllNameplates();
  const AllSystemVoices = await getAllSystemVoices();
  const AllMapIcons = await getAllMapIcons();
  const AllChuniTeams = await getAllChuniTeams();

  const NextChuniPlays = await getChuniNextPlays();

  const TopChuniPlays = await getChuniTopPlays();
  const HotChuniPlays = await getChuniHotPlays();

  return (
    <div className="p-3">
      <Tabs defaultValue="scores">
        <TabsList className="md:flex-0 flex overflow-x-auto">
          <TabsTrigger value="scores">Scores</TabsTrigger>
          <TabsTrigger value="customize">Customize</TabsTrigger>
          <TabsTrigger value="TopPlays">Top Plays</TabsTrigger>
          <TabsTrigger value="HotPlays">Hot Plays</TabsTrigger>
          <TabsTrigger value="NextPlays">Next Plays</TabsTrigger>
          <TabsTrigger value="Patcher">Patcher</TabsTrigger>
          <TabsTrigger value="KamaitachiExport">Kamaitachi Export</TabsTrigger>
        </TabsList>

        <TabsContent className="pt-1" value="scores">
          <ChunithmScorePlaylog />
        </TabsContent>
        <TabsContent value="customize">
          <div className="p-10">
            <AvatarCustomization
              avatarHeadSelectionData={AvatarHeadAccessories}
              avatarFaceSelectionData={AvatarFaceAccessories}
              avatarItemSelectionData={AvatarItemAccessories}
              avatarBackSelectionData={AvatarBackAccessories}
              avatarWearSelectionData={AvatarWearAccessories}
            />
            <div className="pt-4">
              <NameplateCustomization
                playerNamePlateSelectionData={AllStaticNameplates}
              />
            </div>
            <div className="pt-4">
              <TrophyCustomization
                playerTrophySelectionData={AllPlayerTrophies}
              />
            </div>
            <div className="pt-4">
              <SystemVoiceCustomization
                playerSystemVoiceSelectionData={AllSystemVoices}
              />
            </div>
            <div className="pt-4">
              <MapIconCustomization playerMapIconCustomization={AllMapIcons} />
            </div>
            <div className="pt-4">
              <TeamCustomization teamSelectionData={AllChuniTeams} />
            </div>
          </div>
          <div></div>
        </TabsContent>
        <TabsContent value="TopPlays">
          <ChunithmTopPlays chuniProfileTopPlays={TopChuniPlays} />
        </TabsContent>
        <TabsContent value="HotPlays">
          <ChunithmHotPlays chuniProfileHotPlays={HotChuniPlays} />
        </TabsContent>
        <TabsContent value="NextPlays">
          <ChunithmNextPlays chuniProfileNextPlays={NextChuniPlays} />
        </TabsContent>
        <TabsContent value="Patcher">
          <Patcher />
        </TabsContent>
        <TabsContent value="KamaitachiExport">
          <KamaitachiExport />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;

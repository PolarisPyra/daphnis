"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import React, { useState } from "react";
import { createArcadeAndMachine } from "./action";
import { toast } from "@/components/ui/use-toast";

export const GenerateKeychip = () => {
  const [serial, setSerial] = useState("");
  const [arcadeName, setArcadeName] = useState("");
  const [arcadeNickname, setArcadeNickname] = useState("");
  const [game, setGame] = useState(""); // Default to empty
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateRandomSerial = () => {
    let uniqueNumbers = "";
    while (uniqueNumbers.length < 4) {
      const digit = Math.floor(Math.random() * 10);
      if (!uniqueNumbers.includes(digit.toString())) {
        uniqueNumbers += digit;
      }
    }
    const randomNumbers = Math.floor(1000 + Math.random() * 9000);
    const randomSerial = `A69E01A${uniqueNumbers}${randomNumbers}`;
    setSerial(randomSerial);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!arcadeName || !arcadeNickname || !serial) {
      toast({
        title: "Validation Error",
        description:
          "Please fill out all fields and generate a keychip serial.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let gameValue: string;
      let namcopcbidValue: string | undefined;
      let serialValue: string | undefined;

      if (!game) {
        toast({
          title: "Validation Error",
          description: "Please select a game.",
          variant: "destructive",
        });
        return;
      }

      if (game === "SDEW") {
        gameValue = game;
        namcopcbidValue = serial;
        serialValue = undefined;
      } else {
        gameValue = "";
        namcopcbidValue = undefined;
        serialValue = serial;
      }

      const result = await createArcadeAndMachine({
        arcade_nickname: arcadeNickname,
        name: arcadeName,
        game: gameValue,
        namcopcbid: namcopcbidValue,
        serial: serialValue,
      });
      toast({
        title: "Keychip created successfully!",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {JSON.stringify(result, null, 2)}
            </code>
          </pre>
        ),
      });
    } catch (error) {
      console.error("Fatal Error creating arcade and machine:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";
      toast({
        title: "Something went really wrong",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card x-chunk="aimecard">
      <CardHeader>
        <CardTitle className="text-2xl">Create Keychip</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="mb-4 text-lg">Current Access Code:</div>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label>Arcade Name</Label>
            <Input
              name="arcadeName"
              type="text"
              placeholder="Arcade Name"
              value={arcadeName}
              onChange={(e) => setArcadeName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Arcade Nickname</Label>
            <Input
              name="arcadeNickname"
              type="text"
              placeholder="Arcade Nickname"
              value={arcadeNickname}
              onChange={(e) => setArcadeNickname(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>Select Game</Label>
            <Select value={game} onValueChange={(value) => setGame(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a game" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="segaaime">Sega (Aime Card)</SelectItem>
                <SelectItem value="SDEW">SDEW (Namco PCB)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Arcade&#39;s Keychip Serial</Label>
            <Input
              name="arcadesKeyChipSerial"
              type="text"
              placeholder="*******************"
              value={serial}
              readOnly
            />
          </div>
          <Button
            type="button"
            className="w-full"
            onClick={generateRandomSerial}
            disabled={isSubmitting}
          >
            Generate Random Serial Number
          </Button>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Finalize Keychip"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

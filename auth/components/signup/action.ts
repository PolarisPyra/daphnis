"use server";

import { generateId } from "lucia";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Argon2id } from "oslo/password";
import { lucia } from "@/lib/lucia";
import { daphnis, artemis } from "@/lib/prisma";
import { GameVersion } from "@/prisma/schemas/daphnis/generated/daphnis";

const signUp = async (formData: FormData) => {
  const formDataRaw = {
    username: formData.get("username") as string,
    email: formData.get("email") as string,
    accessCode: formData.get("accessCode") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  if (formDataRaw.password !== formDataRaw.confirmPassword) {
    return { error: "Passwords do not match" };
  }

  try {
    // Check if access code is already used in daphnis database
    const existingUser = await daphnis.user.findFirst({
      where: {
        accessCode: formDataRaw.accessCode,
      },
    });

    if (existingUser) {
      return { error: "Access Code already in use" };
    }

    // Check if username is already used in daphnis database
    const existingUsername = await daphnis.user.findFirst({
      where: {
        username: formDataRaw.username,
      },
    });

    if (existingUsername) {
      return { error: "Username is currently taken" };
    }

    const existingEmail = await daphnis.user.findFirst({
      where: {
        email: formDataRaw.email,
      },
    });

    if (existingEmail) {
      return { error: "Email is already in use" };
    }

    // Check if access code exists in artemis database
    const existingAccessCode = await artemis.aime_card.findFirst({
      where: {
        access_code: formDataRaw.accessCode,
      },
    });

    const existingAccessCodeAndPlayedGame =
      await artemis.chuni_profile_data.findFirst({
        where: {
          user: existingAccessCode?.user,
        },
      });

    if (!existingAccessCode) {
      return { error: "Not in artemis's database, Nice try ^_^" };
    }

    const hashedPassword = await new Argon2id().hash(formDataRaw.password);
    const userId = generateId(15);

    const artemisUserId = existingAccessCode.user;

    type GameVersionKey = keyof typeof GameVersion;

    // need to make a record so we can get the game version from the db into daphnis where its stored as a string
    const NumberToGameVersionKey: Record<number, GameVersionKey> = {
      16: "LuminousPlus",
      15: "Luminous",
      14: "SunPlus",
      13: "Sun",
      12: "NewPlus",
      11: "New",
    };

    const currentGameVersion = existingAccessCodeAndPlayedGame?.version;
    const gameVersionKey = NumberToGameVersionKey[currentGameVersion ?? 0];
    const gameIdToName = gameVersionKey
      ? GameVersion[gameVersionKey]
      : undefined;

    await daphnis.user.create({
      data: {
        UserId: artemisUserId,
        id: userId,
        username: formDataRaw.username,
        email: formDataRaw.email,
        accessCode: formDataRaw.accessCode,
        gameVersion: gameIdToName,
        hashedPassword,
      },
    });

    // Create session and set cookie
    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
    console.log("Account created");

    // Redirect to home page
  } catch (error: any) {
    return { error: "Account creation failed: " + error.message };
  }
  redirect("/home");
};

export { signUp };

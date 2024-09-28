"use server";

import { getAuth } from "@/auth/queries/getauth";
import { daphnis } from "@/lib/prisma";
import { randomUUID } from "crypto";
import { randomBytes } from "crypto";

export async function generateShareToken(id: number): Promise<{
  token?: string;
  id?: string;
  error?: string;
}> {
  const { user } = await getAuth();

  if (!user || !user.id || typeof user.id !== "string") {
    return {
      error: "Invalid user or user ID",
    };
  }
  const gernatetoken = randomBytes(5).readUInt32BE(0).toString();

  const token = await daphnis.linksharingtoken.create({
    data: {
      playlogId: id, // sets the playlog id
      id: randomUUID(), // generates a random primary id for the share token
      userId: user.id, // attaches the userid from daphnis
      token: gernatetoken, // makes an expirable token thats added to the token column
      createdAt: new Date(), // created  at date
    },
  });

  return { token: token.token };
}

export async function shareScore(token: string) {
  const IsTokenValid = await daphnis.linksharingtoken.findUnique({
    where: {
      token,
    },
  });

  if (!IsTokenValid) {
    return {
      error: "invalid token",
    };
  }

  return { success: true };
}

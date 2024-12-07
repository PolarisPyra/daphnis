import { Lucia } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { daphnis } from "./prisma";

const adapter = new PrismaAdapter(daphnis.session, daphnis.user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false, //  Next.js doesn't allow Lucia to extend cookie expiration when rendering pages
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      // attributes has the type of DatabaseUserAttributes
      role: attributes.role,
      username: attributes.username,
      accessCode: attributes.accessCode,
      UserId: attributes.UserId
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

// add from userdb
interface DatabaseUserAttributes {
  role: string;
  username: string;
  accessCode: string;
  UserId: number;
}

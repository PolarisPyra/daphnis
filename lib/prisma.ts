import { PrismaClient as ArtemisClient } from "@/prisma/schemas/artemis/generated/artemis";
import { PrismaClient as DaphnisClient } from "@/prisma/schemas/daphnis/generated/daphnis";

// Singleton pattern for Daphnis client
const DaphnisClientSingleton = () => {
  if (process.env.NODE_ENV === "production") {
    return new DaphnisClient();
  }

  // In development mode, reuse existing global instance if available
  if (globalThis.daphnisClient) {
    return globalThis.daphnisClient as DaphnisClient;
  }
  const client = new DaphnisClient();
  globalThis.daphnisClient = client;
  return client;
};

// Singleton pattern for Artemis client
const ArtemisClientSingleton = () => {
  if (process.env.NODE_ENV === "production") {
    return new ArtemisClient();
  }

  // In development mode, reuse existing global instance if available
  if (globalThis.artemisClient) {
    return globalThis.artemisClient as ArtemisClient;
  }
  const client = new ArtemisClient();
  globalThis.artemisClient = client;
  return client;
};

// Exporting the singletons
export const daphnis = DaphnisClientSingleton();
export const artemis = ArtemisClientSingleton();

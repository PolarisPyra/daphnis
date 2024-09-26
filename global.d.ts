// global.d.ts
import { PrismaClient as DaphnisClient } from "@/prisma/schemas/daphnis/generated/daphnis";
import { PrismaClient as ArtemisClient } from "@/prisma/schemas/artemis/generated/artemis";

// adding types to global so primsa.ts doesnt freak out
declare global {
  var daphnisClient: DaphnisClient | undefined;
  var artemisClient: ArtemisClient | undefined;
}

import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { authConfig } from "../../auth/config";

export const userRouter = createTRPCRouter({
  getProviders: publicProcedure.query(async () => {
    const configuredProviders = authConfig.providers;
    console.log(configuredProviders)

    const providerData = configuredProviders.map((provider) => {
      if (typeof provider === 'function') {
        const resolvedProvider = provider({});
        return {
          id: resolvedProvider.id,
          name: resolvedProvider.name,
          type: resolvedProvider.type,
        };
      } else if (typeof provider === 'object') {
        const rawProvider: any = provider;
        return {
            id: rawProvider.id || undefined,
            name: rawProvider.name || undefined,
            type: rawProvider.type || undefined
        }
      }

      return null;
    }).filter(Boolean);

    return providerData;
  }),
});
import { createTRPCRouter } from "~/server/api/trpc";
import { submissionRouter } from "~/server/api/routers/submission";

export const appRouter = createTRPCRouter({
  submission: submissionRouter,
});

export type AppRouter = typeof appRouter;

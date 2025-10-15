import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const submissionRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        childFullName: z.string().min(1, "Child's full name is required"),
        childDateOfBirth: z.string().min(1, "Date of birth is required"),
        parentFullName: z.string().min(1, "Parent's full name is required"),
        parentPhoneNumber: z.string().min(1, "Phone number is required"),
        emergencyContactInfo: z.string().min(1, "Emergency contact is required"),
        allergiesMedicalConditions: z.string(),
        permissionToParticipate: z.boolean(),
        emergencyMedicalAuth: z.boolean(),
        photoVideoRelease: z.boolean(),
        signature: z.string().min(1, "Signature is required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.submission.create({
        data: {
          childFullName: input.childFullName,
          childDateOfBirth: new Date(input.childDateOfBirth),
          parentFullName: input.parentFullName,
          parentPhoneNumber: input.parentPhoneNumber,
          emergencyContactInfo: input.emergencyContactInfo,
          allergiesMedicalConditions: input.allergiesMedicalConditions,
          permissionToParticipate: input.permissionToParticipate,
          emergencyMedicalAuth: input.emergencyMedicalAuth,
          photoVideoRelease: input.photoVideoRelease,
          signature: input.signature,
        },
      });
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.submission.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.submission.findUnique({
        where: { id: input.id },
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.submission.delete({
        where: { id: input.id },
      });
    }),

  getStats: publicProcedure.query(async ({ ctx }) => {
    const total = await ctx.db.submission.count();
    const withPermissions = await ctx.db.submission.count({
      where: { permissionToParticipate: true },
    });
    const withPhotoRelease = await ctx.db.submission.count({
      where: { photoVideoRelease: true },
    });
    return { total, withPermissions, withPhotoRelease };
  }),
});

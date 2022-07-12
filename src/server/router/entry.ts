import { z } from 'zod';
import { createRouter } from './context';

export const entries = createRouter()
  .query('list', {
    async resolve({ ctx }) {
      const user = await ctx.prisma.user.findUnique({
        where: {
          email: ctx.session?.user?.email!,
        },
      });

      const userId = user?.id;
      const entries = await ctx.prisma.entry.findMany({
        where: {
          userId: userId,
        },
      });

      return { success: true, entries };
    },
  })
  .mutation('add', {
    input: z.object({
      userId: z.string(),
      initialText: z.string().min(1),
      correctedText: z.string().optional(),
      createdAt: z.string(),
      updatedAt: z.string(),
      tags: z.array(z.string()),
      emotions: z.array(z.string()),
    }),
    async resolve({ ctx, input }) {
      const entry = await ctx.prisma.entry.create({
        data: input,
        // select:{},
      });
      return { success: true, entry };
    },
  });

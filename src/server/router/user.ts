import { z } from 'zod';
import { createRouter } from './context';

export const users = createRouter()
  //not being used -- figure out ctx
  .query('me', {
    resolve({ ctx }) {
      return ctx.prisma.user.findUnique({
        where: {
          email: ctx.session?.user?.email!,
        },
      });
    },
  })
  .query('get', {
    input: z.object({
      email: z.string().email(),
    }),
    async resolve({ ctx, input }) {
      const user = await ctx.prisma!.user.findUnique({
        where: {
          email: input.email,
        },
      });
      //   if (ctx.req?.method === 'OPTIONS') {
      //     ctx.res?.status(200).end();
      //   }

      return { success: true, user };
    },
  });

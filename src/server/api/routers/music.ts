import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { eq, and } from "drizzle-orm/expressions";
import { musicTable } from "@/server/db/schema";

export const musicRouter = createTRPCRouter({
  getTieUpInfo: publicProcedure
    .input(
      z.object({
        artistName: z.string(),
        songName: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const result = await db
        .select({
          artistName: musicTable.artistName,
          songName: musicTable.songName,
          tieUpInfo: musicTable.tieUpInfo,
        })
        .from(musicTable)
        .where(
          and(
            eq(musicTable.artistName, input.artistName),
            eq(musicTable.songName, input.songName),
          ),
        )
        .limit(1);

      return result.length > 0 ? result[0] : null;
    }),

  upsertTieUpInfo: publicProcedure
    .input(
      z.object({
        artistName: z.string(),
        songName: z.string(),
        tieUpInfo: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const existing = await db
        .select()
        .from(musicTable)
        .where(
          and(
            eq(musicTable.artistName, input.artistName),
            eq(musicTable.songName, input.songName),
          ),
        )
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(musicTable)
          .set({
            tieUpInfo: input.tieUpInfo ?? null,
          })
          .where(
            and(
              eq(musicTable.artistName, input.artistName),
              eq(musicTable.songName, input.songName),
            ),
          );

        return { success: true, message: "Data updated successfully." };
      }

      // 新しいデータを挿入
      await db.insert(musicTable).values({
        artistName: input.artistName,
        songName: input.songName,
        tieUpInfo: input.tieUpInfo ?? null,
      });

      return { success: true, message: "Data inserted successfully." };
    }),
});

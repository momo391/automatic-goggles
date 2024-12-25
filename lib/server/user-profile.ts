import { db } from "@/db";
import { eq } from "drizzle-orm";
import { assetTable, SelectAsset, SelectUser, userTable } from "@/db/schema";

export const getUserProfile = async (
  user: SelectUser
): Promise<SelectAsset | null> => {
  const result: UserProfle[] = await db
    .select({ user: userTable, asset: assetTable })
    .from(userTable)
    .leftJoin(assetTable, eq(userTable.asset_id, assetTable.id))
    .where(eq(userTable.id, user.id))
    .limit(1);

  const { asset } = result[0];
  if (!asset) return asset;
  return asset;
};

export type UserProfle = { user: SelectUser; asset: SelectAsset | null };

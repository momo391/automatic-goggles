"use server";

import { z } from "zod";
import { logInSchema } from "@/app/auth/_schema/log-in";
import { NeonDbError } from "@neondatabase/serverless";
import { db } from "@/db";
import { InsertSession, sessionTable, userTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyPassword } from "@/lib/server/password";
import { createSession, generateSessionToken } from "@/lib/server/session";
import { setSessionTokenCookie } from "@/lib/server/cookies";

export const log_in = async (values: z.infer<typeof logInSchema>) => {
  try {
    const email: string = values.email;

    const result = await db
      .select({ password: userTable.password, user_id: userTable.id })
      .from(userTable)
      .where(eq(userTable.email, email));

    if (result.length < 1)
      return {
        where: "email",
        message: "Account not found",
      };

    const { password: hash, user_id } = result[0];

    if (!hash)
      return {
        where: "password",
        message: "Account corrupted",
      };

    const isUser: boolean = await verifyPassword(hash, values.password);
    if (!isUser)
      return {
        where: "password",
        message: "Wrong credentials",
      };

    const token: string = generateSessionToken();
    const session: InsertSession = await createSession(token, user_id);

    if (!session)
      return {
        where: "Database",
        message: "Can't create session",
      };

    await setSessionTokenCookie(token, session.expires_at);

    return {
      where: null,
      message: null,
    };
  } catch (err) {
    if (err instanceof NeonDbError) {
      return {
        where: "Database",
        message: "Something went wrong",
      };
    }
    return {
      where: "Server",
      message: "Something went wrong",
    };
  }
};

export type LogInResult =
  | { where: string; message: string }
  | { where: null; message: null };

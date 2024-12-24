"use server";

import { z } from "zod";
import { signUpSchema } from "@/app/auth/_schema/sign-up";
import { InsertSession, InsertUser, userTable } from "@/db/schema";
import { hashPassword } from "@/lib/server/password";
import { db } from "@/db";
import { createSession, generateSessionToken } from "@/lib/server/session";
import { setSessionTokenCookie } from "@/lib/server/cookies";
import { NeonDbError } from "@neondatabase/serverless";

export const sign_up = async (
  values: z.infer<typeof signUpSchema>
): Promise<SignUpResult> => {
  try {
    const user: InsertUser = {
      email: values.email,
      password: await hashPassword(values.password),
      username: `${values.last_name} ${values.first_name}`,
    };

    const result = await db
      .insert(userTable)
      .values(user)
      .returning({ user_id: userTable.id });

    const { user_id } = result[0];

    const token: string = generateSessionToken();
    const session: InsertSession = await createSession(token, user_id);

    await setSessionTokenCookie(token, session.expires_at);

    return { where: null, message: null };
  } catch (err) {
    if (err instanceof NeonDbError) {
      console.log("err: ", err);

      if (err?.constraint === "users_email_unique")
        return {
          where: "email",
          message: "email already used",
        };
      else
        return {
          where: "Database",
          message: "Something went wrong",
        };
    }
    return {
      where: "Server",
      message: "something went wrong",
    };
  }
};

export type SignUpResult =
  | { where: string; message: string }
  | { where: null; message: null };

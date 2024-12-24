"use server";

import { getCurrentSession } from "@/lib/cache/current-session";
import { LogOutButton } from "./_components/log-out-button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const Page = async () => {
  const { session } = await getCurrentSession();
  return (
    <>
      <div className="min-h-screen grid place-items-center">
        {session && <LogOutButton />}
        {!session && (
          <div className="flex items-center justify-center gap-4">
            <Link className={cn(buttonVariants())} href={"/auth/log-in"}>
              Log In
            </Link>

            <Link
              className={cn(buttonVariants({ variant: "secondary" }))}
              href={"/auth/sign-up"}
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default Page;

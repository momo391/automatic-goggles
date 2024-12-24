"use client";

import { Button } from "@/components/ui/button";
import { log_out } from "@/app/auth/actions";

export const LogOutButton = () => {
  return (
    <>
      <Button variant={"destructive"} onClick={log_out}>
        Log out
      </Button>
    </>
  );
};

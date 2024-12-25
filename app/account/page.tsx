"use server";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SelectAsset, SelectUser } from "@/db/schema";
import { getCurrentSession } from "@/lib/cache/current-session";
import { getUserProfile } from "@/lib/server/user-profile";
import { redirect } from "next/navigation";
import { LogOutButton } from "../_components/log-out-button";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Input } from "@/components/ui/input";

export default async function Page() {
  const { user } = await getCurrentSession();
  if (!user) redirect("/auth/log-in");
  const asset: SelectAsset | null = await getUserProfile(user);
  return (
    <>
      <div className="max-w-4xl w-screen h-full flex flex-col gap-4">
        <div className="flex items-center justify-between p-4 border rounded-xl">
          <div className="flex items-center justify-center gap-4">
            <ProfileAvatar asset={asset} user={user} />
            <p>{user?.username}</p>
          </div>
          <div>
            <LogOutButton />
          </div>
        </div>

        <div className="flex items-stretch w-1/2 justify-center flex-col gap-4">
          <PersonalInformationCard user={user} />
        </div>
      </div>
    </>
  );
}

export const ProfileAvatar = async ({
  asset,
  user,
}: Readonly<{ asset: SelectAsset | null; user: SelectUser }>) => {
  return (
    <>
      <Avatar>
        <AvatarImage src={asset?.url} />
        <AvatarFallback className="uppercase">
          {user?.username[0]}
        </AvatarFallback>
      </Avatar>
    </>
  );
};

export const PersonalInformationCard = async ({
  user,
}: Readonly<{ user: SelectUser }>) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Personel information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              <Label>Username</Label>
              <Input defaultValue={user?.username} disabled />
            </div>

            <div className="flex flex-col gap-4">
              <Label>Email</Label>
              <Input defaultValue={user?.email} disabled />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button>Edit</Button>
        </CardFooter>
      </Card>
    </>
  );
};

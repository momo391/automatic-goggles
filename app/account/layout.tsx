import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/cache/current-session";

export const metadata: Metadata = {
  title: "Outfit - account",
  description: "Generated by create next app",
};

export default async function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { session } = await getCurrentSession();
  if (!session) redirect("/");

  return (
    <>
      <div className="min-h-screen grid place-items-center p-4">{children}</div>
    </>
  );
}

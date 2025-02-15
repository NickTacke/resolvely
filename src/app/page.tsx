import Link from "next/link";

import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";
import { Button } from "~/components/ui/button";
import { signOut } from "next-auth/react";
import { AuthButton } from "~/components/ui/authbutton";

export default async function Home() {
  const session = await auth();

  return (
    <HydrateClient>
        <p className="text-2xl">
          {session && <span>Logged in as {session.user?.name}</span>}
        </p>
        <AuthButton session={session}></AuthButton>
        <Link
          href={session ? "/api/auth/signout" : "/api/auth/signin"}
          className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
        >
          {session ? "Sign out" : "Sign in"}
        </Link>
    </HydrateClient>
  );
}

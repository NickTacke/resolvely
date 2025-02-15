"use client";
import React from "react";
import { Button } from "~/components/ui/button";
import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import { Session } from "next-auth";

interface AuthButtonProps {
  session: Session | null;
}

const AuthButton: React.FC<AuthButtonProps> = (props) => {
  const session = props.session;

  return (
    <>
      {session ? (
        <Button
          onClick={() => {
            signOut();
          }}
        >
          Logout
        </Button>
      ) : (
        <Button
          onClick={() => {
            redirect("/api/auth/signin");
          }}
        >
          Login
        </Button>
      )}
    </>
  );
};

export { AuthButton };

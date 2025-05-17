import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

const AuthButtons = () => {
  const router = useRouter();
  return (
    <div className="flex items-center gap-4">
      <SignedOut>
        <SignInButton>
          <Button className="rounded-full bg-black text-white hover:bg-gray-800">
            Sign In
          </Button>
        </SignInButton>
        <SignUpButton>
          <Button className="rounded-full bg-black text-white hover:bg-gray-800">
            Sign Up
          </Button>
        </SignUpButton>
      </SignedOut>
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
      <Button
        className="rounded-full bg-black text-white hover:bg-gray-800"
        onClick={() => router.push("/components/Create")}
      >
        Get Started
      </Button>
    </div>
  );
};

export default AuthButtons;

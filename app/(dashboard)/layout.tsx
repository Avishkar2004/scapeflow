"use client";

import BreadcrumbHeader from "@/components/BreadcrumbHeader";
import DesktopSidebar from "@/components/Sidebar";
import { ModeToggle } from "@/components/ThemeModeToggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

import React from "react";

const UserButtonWrapper = () => {
  return (
    <SignedIn>
      <UserButton />
    </SignedIn>
  );
};

const SignInButton = () => {
  return (
    <SignedOut>
      <Button asChild>
        <Link href="/sign-in">Sign in</Link>
      </Button>
    </SignedOut>
  );
};

const DashboardContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen">
      <DesktopSidebar />
      <div className="flex flex-col flex-1 min-h-screen">
        <header className="flex items-center justify-between px-6 py-4 h-[50px] container">
          <BreadcrumbHeader />
          <div className="gap-1 flex items-center">
            <ModeToggle />
            <UserButtonWrapper />
            <SignInButton />
          </div>
        </header>
        <Separator />
        <div className="overflow-auto">
          <div className="flex-1 container py-4 text-accent-foreground">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

const UnauthenticatedContent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex h-screen">
      <div className="flex flex-col flex-1 min-h-screen">
        <header className="flex items-center justify-between px-6 py-4 h-[50px] container">
          <div></div>
          <div className="gap-1 flex items-center">
            <ModeToggle />
            <SignInButton />
          </div>
        </header>
        <Separator />
        <div className="overflow-auto">
          <div className="flex-1 container py-4 text-card-foreground">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SignedIn>
        <DashboardContent>{children}</DashboardContent>
      </SignedIn>
      <SignedOut>
        <UnauthenticatedContent>{children}</UnauthenticatedContent>
      </SignedOut>
    </>
  );
};

export default layout;

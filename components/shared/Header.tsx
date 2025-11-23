"use client"

import { navItemsDonor, navItemsOrganisation } from "@/constants";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import logo from "@/assets/logo.png";


export default function Header() {
    const { user } = useUser();

    // Get userType from Clerk's publicMetadata
    const userType = user?.publicMetadata?.userType as UserType | undefined;

    // Determine which nav items to show
    const navItems = userType === "organisation" ? navItemsOrganisation : navItemsDonor;

    return (
        <div className="flex justify-between items-center px-30 py-4">
            <div className="flex items-center gap-2 -mt-5 -ml-2 ">
                <Image
                    src={logo}
                    alt="SecondSpark"
                    width={80}
                    height={80}
                    className="object-contain"
                />
                <h1 className="text-2xl font-bold tracking-tight -ml-6">SecondSpark</h1>
            </div>

            <div className="flex gap-20">
                <div className="flex gap-15">
                    {navItems.map((item) => (
                        <Link key={item.href} href={item.href}>
                            {item.label}
                        </Link>
                    ))}
                </div>

                <SignedOut>
                    <div className="flex gap-2">
                        <Button asChild size="sm">
                            <Link href="/sign-in">Sign in</Link>
                        </Button>
                        <Button asChild size="sm">
                            <Link href="/sign-up">Sign up</Link>
                        </Button>
                    </div>
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </div>
        </div>
    )

}

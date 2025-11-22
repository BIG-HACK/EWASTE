"use client"

import { navItems } from "@/constants";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";


export default function Header() {
    return (
        <div className="flex justify-between items-center p-4 px-20">
            <div>
                <h1>EWASTE</h1>
            </div>
            <div className="flex gap-15">
                {navItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                        {item.label}
                    </Link>
                ))}
            </div>
            <div>
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

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function Home() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <h1>EWASTE</h1>
            <Button>
                <Link href="/dashboard">Get Started</Link>
            </Button>
        </div>
    );
}

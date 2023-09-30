//import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { UserButton } from "@clerk/nextjs"
import { ModeToggle } from "@/components/wrappers/theme-toggle"

export default function Home() {
    return (
        <main className="min-h-screen flex flex-col items-center  p-24 -bg-slate-700 gap-3">
            <p className="font-bold ">This is a protected route!</p>
            <Button variant="default">Click me bitch</Button>
            <UserButton afterSignOutUrl="/signin" />
            <ModeToggle />
        </main>
    )
}

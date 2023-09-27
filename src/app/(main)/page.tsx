//import Image from 'next/image'
import { Button } from "@/components/ui/button"

export default function Home() {
    return (
        <main className="min-h-screen flex-col items-center  p-24 bg-slate-700">
            <p className="font-bold ">This is a protected route!</p>
            <Button variant="default">Click me bitch</Button>
        </main>
    )
}

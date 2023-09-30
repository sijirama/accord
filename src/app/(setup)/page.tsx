import { initialProfile } from "@/lib/initial-profile"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import InitialModal from "@/components/custom/modals/initial-modals"

export default async function Home() {
    const profile = await initialProfile()

    const server = await db.server.findFirst({
        where: {
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    })

    if (server) {
        return redirect(`/server/${server.id}`)
    }

    return (
        <main className="min-h-screen flex flex-col justify-center items-center">
            <p className="font-extrabold text-2xl">Create a server!</p>
            <p className="font-extralight">{profile.name}</p>
            <p className="font-extralight">{profile.email}</p>
            <img src={`${profile.imageUrl}`} className="w-10 h-10 rounded-full hover:w-12 hover:h-12" />
            <InitialModal />
        </main>
    )
}

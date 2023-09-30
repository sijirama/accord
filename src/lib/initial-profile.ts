import { currentUser, redirectToSignIn } from "@clerk/nextjs"
import { type Profile } from "@prisma/client"
import { db } from "./db"

export async function initialProfile(): Promise<Profile> {
    const user = await currentUser() // get the current user
    if (!user) { // then redirect the user to signin
        return redirectToSignIn()
    }
    const profile = await db.profile.findUnique({
        where: {
            userId: user.id
        }
    })
    if (profile) { // then our user has no profile, so create one
        return profile
    }
    const newProfile = await db.profile.create({
        data: {
            userId: user.id,
            name: `${user.firstName} ${user.lastName}`,
            imageUrl: user.imageUrl,
            email: user.emailAddresses[0].emailAddress,
        }
    })
    return newProfile; // done
}

export type ProfileType = Awaited<ReturnType<typeof initialProfile>>

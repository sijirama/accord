import { db } from './db';

export async function getOrCreateConversation(
    memberOne: string,
    memberTwo: string
) {
    let conversation =
        (await findConversation(memberOne, memberTwo)) ||
        (await findConversation(memberTwo, memberOne));
    if (!conversation) {
        conversation = await createConversation(memberOne, memberTwo);
    }

    return conversation;
}

async function findConversation(memberOneId: string, memberTwoId: string) {
    return await db.conversation.findFirst({
        where: {
            AND: [{ memberOneId: memberOneId }, { memberTwoId: memberTwoId }],
        },
        include: {
            memberOne: {
                include: {
                    profile: true,
                },
            },
            memberTwo: {
                include: {
                    profile: true,
                },
            },
        },
    });
}

async function createConversation(memberOneId: string, memberTwoId: string) {
    try {
        return await db.conversation.create({
            data: {
                memberOneId,
                memberTwoId,
            },
            include: {
                memberOne: {
                    include: {
                        profile: true,
                    },
                },
                memberTwo: {
                    include: {
                        profile: true,
                    },
                },
            },
        });
    } catch (error) {
        return null;
    }
}

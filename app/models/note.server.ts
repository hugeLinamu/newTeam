import type { User, Note } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Note, noteStatus } from "@prisma/client";

// export function getNote({
//   id,
//   userId,
// }: Pick<Note, "id"> & {
//   userId: User["id"];
// }) {
//   return prisma.note.findFirst({
//     select: { id: true, body: true, title: true },
//     where: { id, userId },
//   });
// }

export function getPublicNoteList(page: number = 1) {
  return prisma.note.findMany({
    where: { status: "PUBLIC" },
    orderBy: {
      updatedAt: "desc",
    },
    take: 10,
    skip: 10 * (page - 1 > 0 ? page - 1 : 0),
    include: {
      user: {
        select: {
          nickname: true,
        },
      },
      _count: {
        select: {
          noteLike: true,
          noteComments: true,
        },
      },
    },
  });
}

export function getPublicNoteCount() {
  return prisma.note.aggregate({
    where: { status: "PUBLIC" },
    _count: true,
  });
}

export function getNote({ id }: Pick<Note, "id">) {
  return prisma.note.findFirst({
    where: { id },
    include: {
      noteComments: {
        include: {
          user: {
            select: {
              nickname: true,
              id: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      },
      _count: {
        select: {
          noteLike: true,
        },
      },
    },
  });
}

export function getNoteListItems({ userId }: { userId: User["id"] }) {
  return prisma.note.findMany({
    where: { userId },
    include: {
      user: {
        select: {
          nickname: true,
        },
      },
      _count: {
        select: {
          noteLike: true,
          noteComments: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export function getNoteCommentList({ userId }: { userId: User["id"] }) {
  return prisma.noteComment.findMany({
    where: { userId },
    include: {
      note: {
        include: {
          _count: {
            select: {
              noteLike: true,
              noteComments: true,
            },
          },
          user: true,
        },
      },
      user: true,
    },
    orderBy: { updatedAt: "desc" },
  });
}

export function createNote({
  body,
  title,
  userId,
  status,
}: Pick<Note, "body" | "title" | "status"> & {
  userId: User["id"];
}) {
  return prisma.note.create({
    data: {
      title,
      body,
      user: {
        connect: {
          id: userId,
        },
      },
      status,
    },
  });
}

export function deleteNote({ id }: Pick<Note, "id">) {
  return prisma.note.deleteMany({
    where: { id },
  });
}

export async function getRecommendNoteList({
  userId,
}: {
  userId: User["id"] | undefined;
}) {
  let notes = await prisma.note.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      isRecommend: true,
    },
    take: 5,
    include: {
      user: {
        select: {
          nickname: true,
        },
      },
      noteComments: {
        select: {
          user: {
            select: {
              nickname: true,
              id: true,
            },
          },
          body: true,
        },
      },
      noteLike: {
        select: {
          user: {
            select: {
              nickname: true,
              id: true,
            },
          },
        },
      },
    },
  });

  let ret: ((typeof notes)[number] & { isLiked: boolean })[] =
    await Promise.all(
      notes.map(async (note) => {
        return {
          ...note,
          isLiked: await liked({ noteId: note.id, userId }),
        };
      })
    );

  return ret;
}

export async function liked({
  noteId,
  userId,
}: {
  noteId: Note["id"];
  userId: User["id"] | undefined | null;
}) {
  if (!userId) {
    return false;
  }
  let like = await prisma.noteLike.findFirst({
    where: {
      noteId,
      userId,
    },
  });

  return !!like;
}

export async function noteLike({
  noteId,
  userId,
}: {
  noteId: Note["id"];
  userId: User["id"];
}) {
  let like = await prisma.noteLike.findFirst({
    where: {
      noteId,
      userId,
    },
  });

  if (like) {
    return prisma.noteLike.delete({
      where: {
        id: like.id,
      },
    });
  }
  return prisma.noteLike.create({
    data: {
      note: {
        connect: {
          id: noteId,
        },
      },
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function createNoteComment({
  noteId,
  userId,
  body,
}: {
  noteId: Note["id"];
  userId: User["id"];
  body: string;
}) {
  return prisma.noteComment.create({
    data: {
      body,
      note: {
        connect: {
          id: noteId,
        },
      },
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function updateNote({
  id,
  body,
  title,
  status,
}: {
  id: Note["id"];
  body: string;
  title: string;
  status: Note["status"];
}) {
  return prisma.note.update({
    where: {
      id,
    },
    data: {
      body,
      title,
      status,
    },
  });
}

export function checkNoteOwner({
  id,
  userId,
}: {
  id: Note["id"];
  userId: User["id"];
}) {
  return prisma.note.findFirst({
    where: {
      id,
      userId,
    },
  });
}

export function checkNoteCommentOwner({
  id,
  userId,
}: {
  id: Note["id"];
  userId: User["id"];
}) {
  return prisma.noteComment.findFirst({
    where: {
      id,
      userId,
    },
  });
}

export function deleteNoteComment({ id }: { id: Note["id"] }) {
  return prisma.noteComment.deleteMany({
    where: {
      id,
    },
  });
}

export function getLikedNoteList({ userId }: { userId: User["id"] }) {
  return prisma.noteLike.findMany({
    where: {
      userId,
    },
    include: {
      note: {
        include: {
          user: {
            select: {
              nickname: true,
            },
          },
          _count: {
            select: {
              noteLike: true,
              noteComments: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export function getNoteCommentLikeList({ userId }: { userId: User["id"] }) {
  return prisma.noteCommentLike.findMany({
    where: {
      userId,
    },
    include: {
      noteComment: {
        include: {
          note: {
            include: {
              user: {
                select: {
                  nickname: true,
                },
              },
              _count: {
                select: {
                  noteLike: true,
                  noteComments: true,
                },
              },
            },
          },
          user: {
            select: {
              nickname: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

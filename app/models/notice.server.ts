import type { Notice } from "@prisma/client";
import { prisma } from "~/db.server";

export async function getRecommendNoticeList() {
  let topNotice = await prisma.notice.findFirst({
    where: {
      isTop: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  let noticeList = await prisma.notice.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });
  return {
    topNotice,
    noticeList,
  };
}

export function getNoticeList(page: number = 1) {
  return prisma.notice.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
    skip: 10 * (page - 1 > 0 ? page - 1 : 0),
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export function getNoticeListCount() {
  return prisma.notice.aggregate({
    _count: true,
  });
}

export function getNoticeDetail(id: Notice["id"]) {
  return prisma.notice.findUnique({
    where: {
      id,
    },
  });
}

// create notice
export function createNotice({
  title,
  content,
  userId,
}: Pick<Notice, "title" | "content" | "userId">) {
  return prisma.notice.create({
    data: {
      title,
      content,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

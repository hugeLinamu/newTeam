import { prisma } from "~/db.server";
export function getActivityList() {
  return prisma.activity.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 4,
  });
}

//获取activity详情
export function getACD(aid: any) {
  return prisma.activity.findUnique({
    where: { id: aid },
  });
}
export function getTACL(tid: any) {
  return prisma.activity.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 4,
    where: { townId: tid },
  });
}
export function getTLST(aID: any) {
  return prisma.ticket.findMany({
    where: {
      activityId: aID,
      isHandle: false,
    },
  });
}

// 获取活动列表
export function getCJNDM(CinMdB: any, type?: any) {
  return prisma.activity.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 12,
    where: {
      type:
        type === undefined
          ? {
              not: "HD",
            }
          : type,
    },
    include: {
      ticket: {
        select: {
          tP: true,
        },
      },
    },
    skip: 6 * (CinMdB - 1 > 0 ? CinMdB - 1 : 0),
  });
}

// 获取活动总数
export function getAllCJNDM(type?: any) {
  return prisma.activity.count({
    orderBy: {
      createdAt: "desc",
    },
    take: 12,
    where: {
      type,
    },
  });
}

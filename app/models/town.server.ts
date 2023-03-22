import { prisma } from "~/db.server";
import type { Town } from "@prisma/client";
export function getRecommendTownList() {
  return prisma.town.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      isRecommend: true,
    },
    take: 6,
  });
}

export function getTownList(page: number = 1) {
  return prisma.town.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 6,
    skip: 6 * (page - 1 > 0 ? page - 1 : 0),
    select: {
      id: true,
      name: true,
      image: true,
      summary: true,
    },
  });
}

export function getAllTowns() {
  return prisma.town.findMany();
}

export function getTownListCount() {
  return prisma.town.aggregate({
    _count: true,
  });
}

export function getTownById(townId: Town["id"]) {
  return prisma.town.findUnique({
    where: {
      id: townId,
    },
  });
}

export function getTownDetail(townId: Town["id"]) {
  return prisma.town.findUnique({
    where: {
      id: townId,
    },
    include: {
      Note: {
        include: {
          user: {
            select: {
              nickname: true,
              id: true,
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
  });
}

export function updateTown(
  townId: Town["id"],
  data: {
    name: Town["name"];
    industry: Town["industry"];
    investment: Town["investment"];
    company: Town["company"];
    area: Town["area"];
    location: Town["location"];
    image: Town["image"];
    panoramaURL: Town["panoramaURL"];
    isRecommend: Town["isRecommend"];
  }
) {
  console.log(data.panoramaURL);
  return prisma.town.update({
    where: {
      id: townId,
    },
    data,
  });
}

export function getRandomTownList() {
  return prisma.town.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 4,
    skip: Math.floor(Math.random() * 10),
    select: {
      id: true,
      name: true,
      image: true,
    },
  });
}

export function getNoticeList(townId: Town["id"]) {
  return prisma.note.findMany({
    where: {
      townId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

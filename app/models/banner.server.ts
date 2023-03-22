import { prisma } from "~/db.server";

export function getBannerList() {
  return prisma.banner.findMany();
}

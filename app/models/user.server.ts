import type { Password, User } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";

export type { User } from "@prisma/client";

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          noteComment: true,
          noteLike: true,
          noteCommentLike: true,
          notes: true,
        },
      },
    },
  });
}

export async function updateUserById(
  id: User["id"],
  nickname: User["nickname"],
  account: User["account"],
  role: User["role"]
) {
  return prisma.user.update({
    where: { id },
    data: {
      nickname,
      account,
      role,
    },
  });
}

export async function getAllUser() {
  return prisma.user.findMany();
}

export async function getUserByaccount(account: User["account"]) {
  return prisma.user.findUnique({ where: { account } });
}

export async function createUser(account: User["account"], password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      account,
      nickname: Math.random() + "",
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });
}

export async function deleteUserByaccount(account: User["account"]) {
  return prisma.user.delete({ where: { account } });
}

export async function verifyLogin(
  account: User["account"],
  password: Password["hash"]
) {
  const userWithPassword = await prisma.user.findUnique({
    where: { account },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash
  );

  if (!isValid) {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}

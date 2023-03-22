import { NavLink, Outlet, Link, useLoaderData } from "@remix-run/react";
import { requireUser } from "~/session.server";
import type { LoaderArgs } from "@remix-run/node";
import { useUser } from "~/utils";
import type { User } from "@prisma/client";
import { json } from "@remix-run/node";

export async function loader({ request }: LoaderArgs) {
  const userData = await requireUser(request);
  return json({ userData });
}

function Role(role: User["role"]) {
  switch (role) {
    case "ADMIN":
      return "管理员";
    case "USER":
      return "用户";
    case "BUSINESS":
      return "商家";
    default:
      return "未知";
  }
}

export default function UserIndex() {
  const user = useUser();
  const { userData } = useLoaderData<typeof loader>();
  const navs = [
    { name: "我的笔记", to: "notes" },
    { name: "收藏笔记", to: "notesLike" },
    { name: "我的评论", to: "comments" },
  ];
  return (
    <div className="mx-auto w-[1200px]">
      <div className="flex py-8 ">
        <div className="relative flex-auto rounded ">
          <div className="border border-gray-200 p-10">
            <p className="text-xl font-semibold leading-5 text-black">
              欢迎，{user.nickname}
            </p>
            <p className="text-sm text-[#8a9aa9]">{Role(user.role)}</p>
            <div className="flex flex-row-reverse ">
              <Link
                to="edit"
                className="inline-block rounded  border border-[#62c3a5] bg-transparent py-2 px-4 text-[#62c3a5]"
              >
                编辑个人资料
              </Link>
            </div>
          </div>

          <div className="mt-4 border border-gray-200 ">
            <div className="flex w-full border-b">
              {navs.map((nav) => {
                return (
                  <NavLink
                    className={({ isActive }) =>
                      `"inline-block font-medium" w-24 py-4 text-center text-base ${
                        isActive
                          ? "border-b-2 border-[#62c3a5] text-[#62c3a5]"
                          : "text-[#8a9aa9]"
                      }`
                    }
                    to={nav.to}
                    key={nav.name}
                  >
                    {nav.name}
                  </NavLink>
                );
              })}
            </div>
            <div className="w-full p-8">
              <Outlet />
            </div>
          </div>
        </div>
        <div className="flex-[0_0_auto]leading-5  ml-4 w-80 ">
          <div className="fixed top-24 w-80">
            <div className="rounded border  border-gray-200 px-4 ">
              <div className=" border-b py-2 text-center text-base font-semibold">
                笔记
              </div>
              <div className="relative flex py-5 text-base font-medium after:absolute after:left-1/2 after:top-1/2 after:h-1/2 after:w-px after:-translate-x-1/2 after:-translate-y-1/2 after:bg-[#f3f3f4] after:content-['_']">
                <div className="flex-1 text-center ">
                  <p>发表了</p>
                  <p>{userData._count.notes}</p>
                </div>
                <div className="flex-1 text-center">
                  <p>点赞了</p>
                  <p>{userData._count.noteLike}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 rounded border border-gray-200  px-4 ">
              <div className=" border-b py-2 text-center text-base font-semibold">
                评论
              </div>
              <div className="relative flex py-5 text-base font-medium after:absolute after:left-1/2 after:top-1/2 after:h-1/2 after:w-px after:-translate-x-1/2 after:-translate-y-1/2 after:bg-[#f3f3f4] after:content-['_']">
                <div className="flex-1 text-center ">
                  <p>发表了</p>
                  <p>{userData._count.noteComment}</p>
                </div>
                <div className="flex-1 text-center">
                  <p>点赞了</p>
                  <p>{userData._count.noteCommentLike}</p>
                </div>
              </div>
            </div>
            <div className="mt-4  rounded border border-gray-200 ">
              <div className="flex justify-between rounded border-b  border-gray-200 py-4 px-4 text-sm">
                <span>最初加入于</span>
                <span>{new Date(userData.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between py-4 px-4 text-sm">
                <span>最后更新于</span>
                <span>{new Date(userData.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

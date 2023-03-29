import type { LoaderArgs } from "@remix-run/server-runtime";
import { requireAdmin } from "~/session.server";
import { useCatch, NavLink, Outlet, useMatches } from "@remix-run/react";
export async function loader({ request }: LoaderArgs) {
  await requireAdmin(request);
  return null;
}
export default function ManagerIndex() {
  const matches = useMatches();
  const links = [
    {
      title: "账号管理",
      link: "user",
      roles: ["ADMIN"],
    },
    {
      title: "小镇管理",
      link: "towns",
      roles: ["ADMIN", "BUSINESS"],
    },
    {
      title: "活动管理",
      link: "mcpnymd",
      roles: ["ADMIN", "BUSINESS"],
    },
    // {
    //   title: "笔记管理",
    //   link: "notes",
    // },
  ];
  return (
    <div className="mx-auto h-[calc(100vh-12rem)] w-[1200px] py-8">
      <div className="flex w-full flex-row rounded border border-[rgba(230,230,231,.5)]">
        {links.map((item, index) => {
          if (!item.roles.includes(matches[0].data?.user?.role)) return <></>;
          return (
            <NavLink
              to={item.link}
              key={index}
              className={({ isActive }) =>
                `leading relative rounded py-3 px-6 text-center text-base font-normal after:absolute after:left-1/2 after:bottom-0 after:h-0.5 after:w-8 after:-translate-x-1/2  after:bg-[#62c3a5] after:transition-all after:content-['_'] hover:after:opacity-100 ${
                  isActive
                    ? "font-medium text-[#252933] after:opacity-100"
                    : "text-[#515767] after:opacity-0"
                } `
              }
            >
              {item.title}
            </NavLink>
          );
        })}
      </div>
      <div className="h-[calc(100%-4rem)] ">
        <Outlet />
      </div>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Note not found</div>;
  }

  if (caught.status === 401) {
    return <div>Unauthorized</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}

import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { requireAdmin } from "~/session.server";
import { useCatch, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { getAllTowns } from "~/models/town.server";
export async function loader({ request }: LoaderArgs) {
  await requireAdmin(request);
  let users = await getAllTowns();

  return json({ users });
}

export default function Towns() {
  const data = useLoaderData<typeof loader>();
  console.log(data);
  return (
    <div className="flex h-full flex-row">
      <div className="flex-1 overflow-x-hidden border">
        <div>
          {data.users.map((item, index) => {
            return (
              <NavLink
                key={index}
                to={item.id}
                className={({ isActive }) =>
                  `${
                    isActive && "text-[#62c3a5]"
                  } block h-10 overflow-hidden whitespace-nowrap border-b border-dashed px-4 py-2 last:border-none`
                }
              >
                <span>{item.name}</span>
                <span className="text-gray-400">({item.id})</span>
              </NavLink>
            );
          })}
        </div>
      </div>
      <div className=" flex-[2_1_0%] overflow-x-hidden border">
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

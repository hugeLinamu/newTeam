import type { LoaderArgs } from "@remix-run/server-runtime";
import { redirect, json } from "@remix-run/server-runtime";
import { useLoaderData, Form, Link, useMatches } from "@remix-run/react";
import { getTownList, getTownListCount } from "~/models/town.server";

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get("page");
  if (!query) {
    return redirect("/towns?page=1");
  }
  const towns = await getTownList(parseInt(query));
  const count = await getTownListCount();
  return json({
    towns: {
      data: towns,
      pages: Math.ceil(count._count / 6),
      currentPage: parseInt(query),
    },
  });
}

export default function Towns() {
  const loaderData = useLoaderData<typeof loader>();
  const matches = useMatches();

  let ret = [];
  for (let i = 1; i <= loaderData.towns.pages; i++) {
    ret.push(
      <input
        type="submit"
        className={`${
          loaderData.towns.currentPage === i
            ? " bg-[#62c3a5] text-white"
            : " bg-[#ebebeb] text-[#868686] hover:bg-[#C1C1C1] hover:text-white"
        } h-8 w-8 cursor-pointer rounded-full  border border-[#F5F5F5] `}
        name="page"
        key={i}
        value={i}
      ></input>
    );
  }

  console.log(loaderData.towns);
  return (
    <>
      {matches[0].data?.user?.role === "BUSINESS" && (
        <div className="mx-auto mt-4 flex w-[1200px] flex-row-reverse">
          <Link
            to="/notice/new"
            className="rounded border  border-[#62c3a5] bg-transparent py-2 px-4 text-[#62c3a5]"
          >
            新建
          </Link>
        </div>
      )}

      {loaderData.towns.data.length > 0 ? (
        <>
          <div className="mx-auto grid w-[1200px] grid-cols-3 gap-12 py-8">
            {loaderData.towns.data.map((town) => {
              return (
                <Link
                  to={`/towns/${town.id}`}
                  key={town.id}
                  style={{ boxShadow: "0 0 10px 0 #C1C1C1" }}
                >
                  <img
                    src={town.image!}
                    alt={town.name}
                    className="block h-72 w-full"
                  ></img>
                  <div className="py-4 px-8">
                    <div className="my-2 text-center text-lg text-gray-700">
                      {town.name}
                    </div>
                    <div className=" text-sm text-gray-500">{town.summary}</div>
                  </div>
                </Link>
              );
            })}
          </div>

          <Form className="mx-auto flex w-full justify-center gap-3 pb-16">
            {...ret}
          </Form>
        </>
      ) : (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          暂无数据
        </div>
      )}
    </>
  );
}

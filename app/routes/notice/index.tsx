import type { LoaderArgs } from "@remix-run/server-runtime";
import { redirect, json } from "@remix-run/server-runtime";
import { useLoaderData, Form, Link, useMatches } from "@remix-run/react";
import { getNoticeList, getNoticeListCount } from "~/models/notice.server";

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get("page");
  if (!query) {
    return redirect("/notice?page=1");
  }
  const notice = await getNoticeList(parseInt(query));
  const count = await getNoticeListCount();
  return json({
    notice: {
      data: notice,
      pages: Math.ceil(count._count / 10),
      currentPage: parseInt(query),
    },
  });
}

export default function Notice() {
  const loaderData = useLoaderData<typeof loader>();
  const matches = useMatches();
  let ret = [];
  for (let i = 1; i <= loaderData.notice.pages; i++) {
    ret.push(
      <input
        type="submit"
        className={`${
          loaderData.notice.currentPage === i
            ? " bg-[#62c3a5] text-white"
            : " bg-[#ebebeb] text-[#868686] hover:bg-[#C1C1C1] hover:text-white"
        } h-8 w-8 cursor-pointer rounded-full  border border-[#F5F5F5] `}
        name="page"
        key={i}
        value={i}
      ></input>
    );
  }

  console.log(loaderData.notice);
  return (
    <>
      {matches[0].data?.user?.role === "ADMIN" && (
        <div className="mx-auto mt-4 flex w-[1200px] flex-row-reverse">
          <Link
            to="/notice/new"
            className="rounded border  border-[#62c3a5] bg-transparent py-2 px-4 text-[#62c3a5]"
          >
            新建
          </Link>
        </div>
      )}

      {loaderData.notice.data.length > 0 ? (
        <>
          <div className="mx-auto my-4  flex w-[1200px] flex-col ">
            {loaderData.notice.data.map((notice) => {
              return (
                <Link
                  to={`/notice/${notice.id}`}
                  key={notice.id}
                  className="flex justify-between border-b  border-dashed border-b-gray-500 border-opacity-25 py-2 last:border-none
                  hover:bg-gray-100"
                >
                  <span className="text-lg font-semibold">{notice.title}</span>
                  <span className="text-sm">
                    {new Date(notice.createdAt).toLocaleString()}
                  </span>
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

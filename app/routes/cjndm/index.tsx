import type { LoaderArgs } from "@remix-run/server-runtime";
import { redirect, json } from "@remix-run/server-runtime";
import { useLoaderData, Form, Link, useMatches } from "@remix-run/react";
import { getCJNDM, getAllCJNDM } from "~/models/activity.server";

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get("page");
  if (!query) {
    return redirect("/cjndm?page=1");
  }
  const towns = await getCJNDM(parseInt(query));
  const count = await getAllCJNDM();
  return json({
    towns: {
      data: towns,
      pages: Math.ceil(count / 6),
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
          <div className="mx-auto w-[1200px]  py-8">
            {loaderData.towns.data.map((town) => {
              return (
                <Link
                  to={`/cjndm/${town.id}`}
                  key={town.id}
                  style={{ boxShadow: "0 0 10px 0 #C1C1C1" }}
                  className=" mt-8 flex rounded-md"
                >
                  <img
                    src={town.img!}
                    alt={town.name}
                    className="block h-72 w-72 rounded-t"
                  ></img>
                  <div className="relative py-4 px-8">
                    <div className="my-2 text-lg font-semibold text-gray-700">
                      {town.name}
                    </div>
                    <div className="text-sm text-gray-500">{town.content}</div>
                    <div className="flex items-center text-sm text-gray-500">
                      <svg
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="2781"
                        width="15"
                        height="15"
                      >
                        <path
                          d="M817.339732 546.536584c29.074176-50.315966 43.836391-107.682511 43.836391-166.089759 0-190.028984-156.366304-344.617805-348.512509-344.617805-192.234209 0-348.579023 154.588821-348.579023 344.617805 0 58.048067 13.546527 115.666346 43.407626 165.138084C275.457144 658.183384 509.210979 985.566666 509.210979 985.566666S748.894873 664.984277 817.339732 546.536584zM249.83151 532.303418c-28.404933-45.222971-41.868573-98.236372-41.868573-151.856593 0-166.091806 136.718825-301.231669 304.700677-301.231669 167.933757 0 304.634162 135.139863 304.634162 301.231669 0 51.841715-13.601786 102.568027-39.382962 147.256832C718.195687 631.215172 511.223822 905.214616 511.223822 905.214616S309.389978 627.123994 249.83151 532.303418z"
                          fill="#272536"
                          p-id="2782"
                        ></path>
                        <path
                          d="M512.663614 194.994066c-88.360444 0-160.224168 71.013357-160.224168 158.399613 0 87.34737 71.863724 158.400636 160.224168 158.400636 88.314395 0 160.180166-71.053266 160.180166-158.400636C672.844803 266.008446 600.979032 194.994066 512.663614 194.994066M512.663614 468.408179c-64.193021 0-116.342752-51.585889-116.342752-115.0145 0-63.427588 52.14973-115.015523 116.342752-115.015523 64.105017 0 116.296703 51.587935 116.296703 115.015523C628.96134 416.823314 576.768631 468.408179 512.663614 468.408179"
                          fill="#272536"
                          p-id="2783"
                        ></path>
                      </svg>
                      {town.location ?? "未知"}
                    </div>

                    <div className=" absolute bottom-8  text-lg text-[#0086F5]">
                      {town.ticket.length > 0
                        ? "￥" + town.ticket[0].tP / 100 + " 起"
                        : "暂无空房"}
                    </div>
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

import type { LoaderArgs } from "@remix-run/server-runtime";

import { useLoaderData, useCatch } from "@remix-run/react";
import { json } from "@remix-run/node";

import { getACD, getTLST } from "~/models/activity.server";

export async function loader({ params }: LoaderArgs) {
  let townDetail = await getACD(+params.hdId!);
  let TLST = await getTLST(+params.hdId!);
  let TLSTO: any = {};
  TLST.forEach((item) => {
    if (!TLSTO[item.tN]) {
      TLSTO[item.tN] = {
        count: 1,
        price: item.tP,
      };
    } else {
      TLSTO[item.tN]["count"] = TLSTO[item.tN]["count"] + 1;
    }
  });
  if (!townDetail) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ townDetail, TLSTO });
}

export default function JDLDDetail() {
  const loaderData = useLoaderData<typeof loader>();
  console.log(loaderData);
  function tlsto() {
    for (const key in loaderData.TLSTO) {
      if (Object.prototype.hasOwnProperty.call(loaderData.TLSTO, key)) {
        const element = loaderData.TLSTO[key];
        return (
          <div key={key} className="flex">
            <div className="flex-1">
              <p className="font-bold">{key}</p>
            </div>

            <div className="flex flex-1 flex-row justify-end">
              <span className="text-2xl text-[#0086f6]">
                ￥ {element.price / 100}
              </span>
              <div className="ml-4 flex flex-col">
                <button className="bg-[#ff9500] px-4 py-2 text-white">
                  立即预订
                </button>

                <span className="text-sm font-light">
                  剩余:&nbsp;&nbsp;{element.count}
                </span>
              </div>
            </div>
          </div>
        );
      }
    }
  }

  return (
    <div className="mx-auto w-[1200px] py-16">
      <div
        className=" flex flex-row justify-between p-8"
        style={{ boxShadow: "0 0 10px 0 #C1C1C1" }}
      >
        <div>
          <h1 className="text-lg font-semibold">
            {loaderData["townDetail"].name}
          </h1>
          <p className=" pr-40">{loaderData["townDetail"].content}</p>
        </div>

        <p className="flex justify-between gap-16">
          <img
            src={loaderData["townDetail"].img!}
            alt="活动照片"
            className=" inline-block h-80 w-96 bg-gray-500 text-white"
          />
          <span className="flex flex-col gap-y-4 text-sm">
            <span className="flex flex-col">
              {loaderData["townDetail"].fw?.split("\n").map((item, index) => {
                return (
                  <span
                    key={index}
                    style={{
                      fontWeight: item.split("").length <= 6 ? 600 : "normal",
                    }}
                  >
                    {item}
                  </span>
                );
              })}
            </span>
          </span>
        </p>
      </div>
      <div
        className=" mt-8 flex flex-col gap-y-2 p-8"
        style={{ boxShadow: "0 0 10px 0 #C1C1C1" }}
      >
        {tlsto()}
      </div>
    </div>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return (
      <div className=" my-20 text-center ">
        <div className="mb-4 text-8xl text-[#62c3a5]">{caught.status}</div>
        <div className="text-3xl">没有找到该记录</div>
      </div>
    );
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}

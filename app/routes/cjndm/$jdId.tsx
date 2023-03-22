import type { LoaderArgs } from "@remix-run/server-runtime";

import { useLoaderData, useCatch } from "@remix-run/react";
import { json } from "@remix-run/node";

import { getACD, getTLST } from "~/models/activity.server";

export async function loader({ params }: LoaderArgs) {
  let townDetail = await getACD(+params.jdId!);
  let TLST = await getTLST(+params.jdId!);
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
              <p>
                1张1.5米双人床 | {Math.ceil(Math.random() * 10) + 10}m² |{" "}
                {Math.random() > 0.5 ? "有" : "无"}窗 | 禁烟
              </p>
            </div>
            <div className="flex-1 text-sm ">
              <p className="text-[#455873]">2份早餐</p>
              <p className="text-[#455873]">预定后30分钟内可退</p>
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
        className=" flex flex-col gap-y-2 p-8"
        style={{ boxShadow: "0 0 10px 0 #C1C1C1" }}
      >
        <h1 className="text-lg font-semibold">
          {loaderData["townDetail"].name}
        </h1>
        <p className="flex items-center">
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
          <span>{loaderData["townDetail"].location ?? "未知"}</span>
        </p>
        <p className="flex justify-between gap-16">
          <img
            src={loaderData["townDetail"].img!}
            alt="酒店照片"
            className=" inline-block h-80 w-96 bg-gray-500 text-white"
          />
          <span className="flex flex-col gap-y-4 text-sm">
            <span>
              <span className="font-bold">酒店设施：</span>
              {loaderData["townDetail"].ss?.split("\n").join("|")}
            </span>
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

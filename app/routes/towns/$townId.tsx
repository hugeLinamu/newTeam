import type { LoaderArgs } from "@remix-run/server-runtime";
import { getTownDetail, getRandomTownList } from "~/models/town.server";
import { useLoaderData, useCatch, Link } from "@remix-run/react";
import { json } from "@remix-run/node";

import { Title } from "..";
import { getTACL } from "~/models/activity.server";

// import { ClientOnly } from "remix-utils";

// import MarkdownIt from "markdown-it";
// import MdEditor from "react-markdown-editor-lite";

// import styleSheetUrl from "react-markdown-editor-lite/lib/index.css";

export async function loader({ params }: LoaderArgs) {
  let townDetail = await getTownDetail(params.townId!);
  let randomTownList = await getRandomTownList();
  let tacl = await getTACL(params.townId!);
  if (!townDetail) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ townDetail, randomTownList, tacl });
}

// export function links() {
//   return [{ rel: "stylesheet", href: styleSheetUrl }];
// }

export default function TownDetail() {
  const loaderData = useLoaderData<typeof loader>();

  console.log(loaderData);
  return (
    <div className="mx-auto w-[1200px] py-16">
      <Title content="小镇信息"></Title>
      <div className=" grid grid-cols-3 gap-8 gap-y-4 px-8 py-4 text-[#a3a3a3]">
        <div>
          小镇名称:{" "}
          <span className="ml-8 text-black">{loaderData.townDetail.name}</span>
        </div>
        <div>
          所属产业:{" "}
          <span className="ml-8 text-black">
            {loaderData.townDetail.industry}
          </span>
        </div>
        <div>
          投资规模:{" "}
          <span className="ml-8 text-black">
            {loaderData.townDetail.investment}
          </span>
        </div>
        <div>
          入驻企业:{" "}
          <span className="ml-8 text-black">
            {loaderData.townDetail.company}
          </span>
        </div>
        <div>
          规划面积:{" "}
          <span className="ml-8 text-black">{loaderData.townDetail.area}</span>
        </div>
        <div>
          小镇位置:{" "}
          <span className="ml-8 text-black">
            {loaderData.townDetail.location}
          </span>
        </div>
      </div>
      <Title content="小镇详情"></Title>
      <div>
        {(
          loaderData.townDetail.detail as {
            title: string;
            content: string;
          }[]
        ).map((item, index) => {
          return (
            <div key={index} className="my-4">
              <div className="flex items-center text-lg text-[#62c3a5]">
                <span className="mr-2 inline-block h-1 w-1 rounded-full bg-[#62c3a5]"></span>
                {item.title}
              </div>
              <div className="mt-2 text-[#666]">{item.content}</div>
            </div>
          );
        })}
      </div>

      <Title content="相关活动"></Title>
      {loaderData.tacl.length > 0 ? (
        <div className="my-4 grid grid-cols-4 gap-8">
          {loaderData.tacl.map((item) => {
            return (
              <Link
                key={item.id}
                to={`/act/${item.id}`}
                className="relative flex flex-col"
              >
                <div className="h-48 w-full bg-[#f5f5f5]"></div>
                <div className="absolute top-0 left-0 flex h-full w-full items-center justify-center whitespace-nowrap bg-[rgba(0,0,0,.4)] text-base text-white">
                  <span>{item.name}</span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="py-4 text-center">暂无数据</div>
      )}

      <Title content="相似小镇"></Title>
      {loaderData.randomTownList.length > 0 ? (
        <div className="my-4 grid grid-cols-4 gap-8">
          {loaderData.randomTownList.map((item) => {
            return (
              <Link
                key={item.id}
                to={`/towns/${item.id}`}
                className="relative flex flex-col"
              >
                <img
                  src={item.image!}
                  alt={item.name}
                  className="h-48 w-full bg-[#f5f5f5]"
                ></img>
                <div className="absolute top-0 left-0 flex h-full w-full items-center justify-center whitespace-nowrap bg-[rgba(0,0,0,.4)] text-base text-white">
                  <span>{item.name}</span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="py-4 text-center">暂无数据</div>
      )}

      <Title content="相关笔记"></Title>
      <div className="my-4">
        {loaderData.townDetail.Note.length > 0 ? (
          loaderData.townDetail.Note.map((note) => {
            return (
              <Link
                to={`/notes/${note.id}`}
                key={note.id}
                className="block border-b border-dashed border-b-gray-500 border-opacity-25 py-2
                  last:border-none hover:bg-gray-100"
              >
                <div className="mb-2 space-x-2">
                  <span className="text-sm leading-5 text-[#4e5969]">
                    {note.user.nickname}
                  </span>
                  <span className="inline-block h-3.5 w-px bg-[#e5e6eb] "></span>
                  <span className=" text-sm leading-5 text-[#86909c]  ">
                    {note.createdAt === note.updatedAt
                      ? `创建于${new Date(note.createdAt).toLocaleString()}`
                      : `最后修改于${new Date(
                          note.updatedAt
                        ).toLocaleString()}`}
                  </span>
                </div>
                <div className=" mb-2 overflow-hidden text-base font-bold leading-6 text-[#1d2129]">
                  {note.title}
                </div>
                <div
                  className=" overflow-hidden text-ellipsis text-xs font-normal leading-5 text-[#86909c]"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {note.summary ? note.summary : note.body}
                </div>
                <div className="mt-2 flex  gap-4">
                  <div className="flex items-center text-sm leading-5">
                    <i className="likeIcon block h-4 w-4 bg-cover" />
                    <span className="ml-1 text-[#4e5969]">
                      {note._count.noteLike}
                    </span>
                  </div>
                  <div className="flex items-center text-sm leading-5">
                    <i className="commentIcon block h-4 w-4 bg-cover" />
                    <span className="ml-1 text-[#4e5969]">
                      {note._count.noteComments}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="my-4 text-center">
            暂无相关笔记，点
            <Link to="/notes/new" className="text-[#62c3a5]">
              这里
            </Link>
            去创建相关笔记吧
          </div>
        )}
      </div>

      <Title content="全景预览"></Title>
      <div>
        {loaderData.townDetail.panoramaURL ? (
          <iframe
            title="panorama"
            src={loaderData.townDetail.panoramaURL}
          ></iframe>
        ) : (
          <div className="my-8 text-center">暂无预览图</div>
        )}
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

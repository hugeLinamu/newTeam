import type { LoaderArgs } from "@remix-run/server-runtime";
import { getNoticeDetail } from "~/models/notice.server";
import { json } from "@remix-run/node";
import { useCatch, useLoaderData } from "@remix-run/react";
import MarkdownIt from "markdown-it";

export async function loader({ params }: LoaderArgs) {
  let noticeDetail = await getNoticeDetail(parseInt(params.noticeId!));
  if (!noticeDetail) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ noticeDetail });
}

export default function NoticeDetail() {
  const loaderData = useLoaderData<typeof loader>();
  let content = new MarkdownIt({
    breaks: true,
    xhtmlOut: true,
  }).render(loaderData.noticeDetail.content);

  return (
    <div className="mx-auto w-[1200px] py-8">
      <div className=" text-center text-2xl font-bold">
        {loaderData.noticeDetail.title}
      </div>
      <div className="text-center text-sm text-[#aaaaaa]">
        {new Date(loaderData.noticeDetail.createdAt).toLocaleString()}
      </div>
      <div className="md" dangerouslySetInnerHTML={{ __html: content }}></div>
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

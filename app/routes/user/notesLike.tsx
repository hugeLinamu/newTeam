import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/node";
import { requireUserId } from "~/session.server";
import { getLikedNoteList } from "~/models/note.server";
import { useLoaderData, Link } from "@remix-run/react";

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const noteLikes = await getLikedNoteList({ userId });
  return json({ noteLikes });
}

export default function PersonalNotes() {
  const data = useLoaderData<typeof loader>();
  console.log(data);
  return (
    <>
      {data.noteLikes.length > 0 ? (
        data.noteLikes.map((noteLikes) => {
          return (
            <Link
              to={`/notes/${noteLikes.note.id}`}
              key={noteLikes.note.id}
              className="block w-full border-b border-dashed border-b-gray-500 border-opacity-25 py-2 last:border-none hover:bg-gray-100"
            >
              <div className="mb-2 w-full space-x-2">
                <span className="text-sm leading-5 text-[#4e5969]">
                  {noteLikes.note.user.nickname}
                </span>
                <span className="inline-block h-3.5 w-px bg-[#e5e6eb] "></span>
                <span className=" text-sm leading-5 text-[#86909c]  ">
                  {noteLikes.note.createdAt === noteLikes.note.updatedAt
                    ? `创建于${new Date(
                        noteLikes.note.createdAt
                      ).toLocaleString()}`
                    : `最后修改于${new Date(
                        noteLikes.note.updatedAt
                      ).toLocaleString()}`}
                </span>
              </div>
              <div className=" mb-2 overflow-hidden text-base font-bold leading-6 text-[#1d2129]">
                {noteLikes.note.title}
              </div>
              <div
                className="w-[790px] overflow-hidden text-ellipsis text-xs font-normal leading-5 text-[#86909c]"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {noteLikes.note.summary
                  ? noteLikes.note.summary
                  : noteLikes.note.body}
              </div>
              <div className="mt-2 flex  gap-4">
                <div className="flex items-center text-sm leading-5">
                  <i className="likeIcon block h-4 w-4 bg-cover" />
                  <span className="ml-1 text-[#4e5969]">
                    {noteLikes.note._count.noteLike}
                  </span>
                </div>
                <div className="flex items-center text-sm leading-5">
                  <i className="commentIcon block h-4 w-4 bg-cover" />
                  <span className="ml-1 text-[#4e5969]">
                    {noteLikes.note._count.noteComments}
                  </span>
                </div>
              </div>
            </Link>
          );
        })
      ) : (
        <>暂无数据</>
      )}
    </>
  );
}

import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/node";
import { requireUserId } from "~/session.server";
import { getNoteListItems } from "~/models/note.server";
import { useLoaderData, Link } from "@remix-run/react";

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const noteListItems = await getNoteListItems({ userId });
  return json({ noteListItems });
}

export default function PersonalNotes() {
  const data = useLoaderData<typeof loader>();
  console.log(data);
  return (
    <>
      {data.noteListItems.length > 0 ? (
        data.noteListItems.map((note) => {
          return (
            <Link
              to={`/notes/${note.id}`}
              key={note.id}
              className="block border-b border-dashed border-b-gray-500 border-opacity-25 py-2 last:border-none hover:bg-gray-100"
            >
              <div className="mb-2 space-x-2">
                <span className="text-sm leading-5 text-[#4e5969]">
                  {note.user.nickname}
                </span>
                <span className="inline-block h-3.5 w-px bg-[#e5e6eb] "></span>
                <span className=" text-sm leading-5 text-[#86909c]  ">
                  {note.createdAt === note.updatedAt
                    ? `创建于${new Date(note.createdAt).toLocaleString()}`
                    : `最后修改于${new Date(note.updatedAt).toLocaleString()}`}
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
        <>暂无笔记</>
      )}
    </>
  );
}

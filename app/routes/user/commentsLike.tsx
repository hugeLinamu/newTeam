import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/node";
import { requireUserId } from "~/session.server";
import { getNoteCommentLikeList } from "~/models/note.server";
import { useLoaderData, Link } from "@remix-run/react";

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const noteComments = await getNoteCommentLikeList({ userId });
  return json({ noteComments });
}

export default function PersonalComments() {
  const data = useLoaderData<typeof loader>();
  console.log(data);
  return (
    <>
      {data.noteComments.map((noteComment) => {
        return (
          <Link
            to={`/notes/${noteComment.noteComment.noteId}`}
            key={noteComment.id}
            className="block border-b border-dashed border-b-gray-500 border-opacity-25 py-2 last:border-none hover:bg-gray-100"
          >
            <div className="mb-2 space-x-2">
              <span className="text-sm leading-5 text-[#4e5969]">
                {noteComment.noteComment.note.title} @作者
                {noteComment.noteComment.user.nickname}
              </span>
              <span className="inline-block h-3.5 w-px bg-[#e5e6eb] "></span>
              <span className=" text-sm leading-5 text-[#86909c]  ">
                评论于{new Date(noteComment.createdAt).toLocaleString()}
              </span>
            </div>
            <div
              className=" overflow-hidden text-ellipsis font-normal leading-5 text-[#86909c]"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {noteComment.noteComment.body}
            </div>
          </Link>
        );
      })}
    </>
  );
}

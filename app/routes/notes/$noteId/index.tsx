import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  useActionData,
  useCatch,
  useLoaderData,
  useMatches,
  Link,
} from "@remix-run/react";
import invariant from "tiny-invariant";

import {
  deleteNote,
  getNote,
  createNoteComment,
  liked,
  noteLike,
  checkNoteOwner,
  checkNoteCommentOwner,
  deleteNoteComment,
} from "~/models/note.server";
import { requireUserId, requireAdmin, getUserId } from "~/session.server";
import MarkdownIt from "markdown-it";
import { useEffect, useRef } from "react";

export async function loader({ request, params }: LoaderArgs) {
  invariant(params.noteId, "noteId not found");
  const userId = await getUserId(request);
  const note = await getNote({ id: params.noteId });
  const isLiked = await liked({ noteId: params.noteId, userId: userId });

  if (!note) {
    throw new Response("Not Found", { status: 404 });
  }

  if (note?.status === "PRIVATE" && note.userId !== userId) {
    await requireAdmin(request);
  }

  return json({ note, isLiked });
}

export async function action({ request, params }: ActionArgs) {
  const userId = await requireUserId(request);
  invariant(params.noteId, "noteId not found");
  let formData = await request.formData();
  let intent = formData.get("intent");
  switch (intent) {
    case "delete":
      let _note = await checkNoteOwner({ userId, id: params.noteId });
      if (!_note) {
        await requireAdmin(request);
      }
      await deleteNote({ id: params.noteId });
      return redirect("/notes");
    case "comment":
      let commentText = formData.get("comment");
      if (typeof commentText !== "string" || commentText.length === 0) {
        return json(
          { errors: { msg: "comment is required" } },
          { status: 400 }
        );
      }
      await createNoteComment({
        userId,
        noteId: params.noteId,
        body: commentText,
      });
      return json({ errors: { msg: null } }, { status: 200 });
    case "noteLike":
      await noteLike({ userId, noteId: params.noteId });
      return json({ errors: { msg: null } }, { status: 200 });
    case "commentDel":
      let commentId = formData.get("commentId");
      if (typeof commentId !== "string" || commentId.length === 0) {
        return json(
          { errors: { msg: "commentId is required" } },
          { status: 400 }
        );
      }
      let _noteComment = await checkNoteCommentOwner({
        userId,
        id: commentId,
      });
      if (!_noteComment) {
        await requireAdmin(request);
      }

      await deleteNoteComment({ id: commentId });
      return json({ errors: { msg: null } }, { status: 200 });
    default:
      throw new Error("Unexpected action");
  }
}

export default function NoteDetailsPage() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const matches = useMatches();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current!.value = "";
  }, [actionData]);

  console.log(data);
  let content = new MarkdownIt({
    breaks: true,
    xhtmlOut: true,
  }).render(data.note.body);
  return (
    <div className="mx-auto w-[1200px] pb-6">
      <div className="pt-8 text-center text-2xl font-bold">
        {data.note.title}
      </div>
      <div
        className="md pt-4 pb-6 indent-8"
        dangerouslySetInnerHTML={{ __html: content }}
      ></div>
      <Form
        method="post"
        className="after:invisible after:clear-both after:block after:h-0 after:overflow-hidden after:content-['_']"
      >
        {(matches[0].data?.user?.id === data.note.userId ||
          matches[0].data?.user?.role === "ADMIN") && (
          <button
            type="submit"
            name="intent"
            value="delete"
            className="float-right rounded bg-[#62c3a428] py-2 px-4 text-[#62c3a5]"
          >
            删除
          </button>
        )}
        {matches[0].data?.user?.id === data.note.userId && (
          <Link
            type="submit"
            className="float-right mr-4 rounded bg-[#62c3a428] py-2 px-4 text-[#62c3a5]"
            to={`/notes/${data.note.id}/edit`}
          >
            修改
          </Link>
        )}
        <button
          type="submit"
          className={`float-right mr-4 flex items-center rounded py-2 px-4 ${
            data.isLiked
              ? "bg-[#62c3a5] text-white"
              : "bg-[#62c3a428] text-[#62c3a5] "
          }`}
          name="intent"
          value="noteLike"
        >
          <span
            className={`border-x-[5px]  border-b-[10px] border-x-transparent ${
              data.isLiked ? "border-b-white" : "border-b-[#62c3a5]"
            }`}
          ></span>
          <span className=" ml-1 ">{data.isLiked ? "已喜欢" : "喜欢"}</span>
          <span className=" ml-1 ">{data.note._count.noteLike}</span>
        </button>
      </Form>

      <hr className="my-4" />

      <div id="comments">
        <div className=" pb-2 text-lg font-semibold leading-8 text-[#252933]">
          评论
        </div>
        <Form method="post">
          <textarea
            cols={3}
            name="comment"
            className="min-h-[64px] w-full min-w-full max-w-full resize rounded border border-[#f2f3f5] bg-[#f2f3f5] py-2 px-4 text-sm leading-6 text-[#252933] outline-none focus:border-[#62c3a5] focus:bg-white"
            ref={textareaRef}
          />
          {actionData?.errors?.msg && (
            <div className="pt-1 text-red-700" id="body-error">
              {actionData.errors.msg}
            </div>
          )}
          <div className="flex flex-row-reverse py-4">
            <button
              type="submit"
              name="intent"
              value="comment"
              className=" rounded bg-[#62c3a428] py-2 px-4 text-[#62c3a5]"
            >
              发送
            </button>
          </div>
        </Form>
        <div className=" pb-2 text-lg font-semibold leading-8 text-[#252933]">
          全部评论 {data.note.noteComments.length}
        </div>
        {data.note.noteComments.length > 0 ? (
          data.note.noteComments.map((comment) => (
            <div
              key={comment.id}
              className="py-2 text-sm leading-6 text-[#252933]"
            >
              <div className="flex flex-row items-end">
                <div className="relative top-4 h-8 w-8 rounded-full bg-[#f2f3f5]">
                  <img
                    src="https://p3-passport.byteimg.com/img/user-avatar/dadbe1ef6beead8ced3271c54b8857d3~100x100.awebp"
                    alt="avatar"
                    className="rounded-full"
                  />
                </div>
                <div className="ml-2 font-medium">{comment.user.nickname}</div>
              </div>
              <div className="ml-10 text-[#515767]">{comment.body}</div>
              <div className="ml-10 flex justify-between ">
                <span className="text-[#5157677d]">
                  {"评论于" + new Date(comment.createdAt).toLocaleString()}
                </span>
                {matches[0].data?.user?.id === comment.userId ||
                matches[0].data?.user?.role === "ADMIN" ? (
                  <Form method="post">
                    <input type="hidden" name="intent" value="commentDel" />
                    <input type="hidden" name="commentId" value={comment.id} />
                    <button type="submit" className=" text-[rgb(245,63,63)]">
                      删除
                    </button>
                  </Form>
                ) : null}
              </div>
            </div>
          ))
        ) : (
          <div className="py-2 text-sm leading-6 text-[#252933]">暂无评论</div>
        )}
      </div>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Note not found</div>;
  }

  if (caught.status === 401) {
    return <div>Unauthorized</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}

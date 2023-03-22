import { Link, useLoaderData, Form } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { getPublicNoteList, getPublicNoteCount } from "~/models/note.server";
import { json, redirect } from "@remix-run/server-runtime";

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get("page");
  if (!query) {
    return redirect("/notes?page=1");
  }
  const notes = await getPublicNoteList(parseInt(query));
  const count = await getPublicNoteCount();
  return json({
    notes: {
      data: notes,
      pages: Math.ceil(count._count / 10),
      currentPage: parseInt(query),
    },
  });
}

export default function NoteIndexPage() {
  const loaderData = useLoaderData<typeof loader>();
  console.log(loaderData);
  let ret = [];
  for (let i = 1; i <= loaderData.notes.pages; i++) {
    ret.push(
      <input
        type="submit"
        className={`${
          loaderData.notes.currentPage === i
            ? " bg-[#62c3a5] text-white"
            : " bg-[#ebebeb] text-[#868686] hover:bg-[#C1C1C1] hover:text-white"
        } h-8 w-8 cursor-pointer rounded-full  border border-[#F5F5F5] `}
        name="page"
        key={i}
        value={i}
      ></input>
    );
  }
  return (
    <>
      <div className="mx-auto mt-4 flex w-[1200px] flex-row-reverse">
        <Link
          to="/notes/new"
          className="rounded border  border-[#62c3a5] bg-transparent py-2 px-4 text-[#62c3a5]"
        >
          新建
        </Link>
      </div>

      {loaderData.notes.data.length > 0 ? (
        <>
          <div className="mx-auto my-4  flex w-[1200px] flex-col ">
            {loaderData.notes.data.map((note) => {
              return (
                <Link
                  to={`/notes/${note.id}`}
                  key={note.id}
                  className=" border-b border-dashed border-b-gray-500 border-opacity-25 py-2 last:border-none
                  hover:bg-gray-100"
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
            })}
          </div>
          <Form className="mx-auto flex w-full justify-center gap-3 pb-16">
            {...ret}
          </Form>
        </>
      ) : (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          暂无数据，
          <Link to="new" className="text-blue-500 underline">
            现在创建一篇笔记
          </Link>
        </div>
      )}
    </>
  );
}

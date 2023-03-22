import { Form, Link } from "@remix-run/react";
import type { LinksFunction, LoaderArgs, ActionArgs } from "@remix-run/node";

import { json } from "@remix-run/node";

import { getBannerList } from "~/models/banner.server";
import { getRecommendNoticeList } from "~/models/notice.server";
import { getActivityList } from "~/models/activity.server";
import { getRecommendTownList } from "~/models/town.server";
import { getRecommendNoteList, noteLike } from "~/models/note.server";

import { requireUserId, getUserId } from "~/session.server";

import { useLoaderData } from "@remix-run/react";

import indexStylesheetUrl from "~/styles/index.css";

import Carousel from "~/components/Carousel/Carousel";

import type { Notice, Town } from "@prisma/client";
import type { SerializeFrom } from "@remix-run/node";

import invariant from "tiny-invariant";

export async function loader({ request }: LoaderArgs) {
  const banners = await getBannerList();
  const notices = await getRecommendNoticeList();
  const activitys = await getActivityList();
  const recommendTowns = await getRecommendTownList();
  let userId = await getUserId(request);
  const recommendNotes = await getRecommendNoteList({ userId });
  return json({
    banners,
    notices,
    activitys,
    towns: recommendTowns,
    notes: recommendNotes,
  });
}

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData();

  let intent = formData.get("intent");

  switch (intent) {
    case "noteLike": {
      let noteId = formData.get("noteId");
      invariant(noteId, "noteId not found");
      if (typeof noteId !== "string") {
        return json(
          {
            errors: { noteId: "noteId is invalid" },
          },
          { status: 400 }
        );
      }
      await noteLike({ userId, noteId });

      return null;
    }
    default: {
      return json(
        {
          errors: { intent: "Invalid intent" },
        },
        { status: 404 }
      );
    }
  }
}

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: indexStylesheetUrl }];
};

export const Title = (props: { content: string }) => {
  return (
    <div className="relative w-fit text-xl opacity-90 after:absolute after:-bottom-px after:left-0 after:h-1.5 after:w-full after:bg-gradient-to-r after:from-[#62c3a5] after:to-white after:content-['_']">
      {props.content}
    </div>
  );
};

const Divder = () => {
  return <div className="my-4 border-t border-dashed border-gray-300"></div>;
};

const Notices = (props: {
  topNotice: SerializeFrom<Notice> | null;
  noticeList: SerializeFrom<Notice>[];
}) => {
  return (
    <>
      {props.topNotice && (
        <>
          <div className="my-8">
            <Link
              to={`/notice/${props.topNotice.id}`}
              className="cursor-pointer text-3xl hover:text-[#62c3a5] active:text-[#62c3a5]"
            >
              {props.topNotice.title}
            </Link>
            <p
              className="mt-4 overflow-hidden text-ellipsis text-sm text-gray-600"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
              }}
            >
              {props.topNotice.summary}
            </p>
            <div className="mt-2 flex justify-between  text-sm">
              <div className="text-gray-400">
                {new Date(props.topNotice.createdAt).toLocaleDateString()}
              </div>
              <Link
                to={`/notice/${props.topNotice.id}`}
                className="cursor-pointer text-[#62c3a5]"
              >
                更多
              </Link>
            </div>
          </div>
          <Divder />
        </>
      )}
      {props.noticeList.length > 0 ? (
        props.noticeList.map((notice) => {
          return (
            <Link
              to={`/notice/${notice.id}`}
              key={notice.id}
              className="my-3 flex justify-between"
            >
              <div className=" flex items-center">
                <span className="inline-block h-1 w-1 rounded-full bg-[#62c3a5]"></span>
                <span className="ml-2 cursor-pointer text-lg font-light text-gray-500 hover:text-[#62c3a5] active:text-[#62c3a5]">
                  {notice.title}
                </span>
              </div>
              <div className="text-sm text-gray-400">
                {new Date(notice.createdAt).toLocaleDateString()}
              </div>
            </Link>
          );
        })
      ) : (
        <div className="text-center text-gray-400">暂无公告</div>
      )}
      <Divder />
    </>
  );
};

// const Activitys = (props: { activityList: SerializeFrom<Activity>[] }) => {
//   return (
//     <>
//       {props.activityList.length > 0 ? (
//         <div className="my-8 grid grid-cols-4 gap-8">
//           {props.activityList.map((activity) => {
//             return (
//               <Link
//                 to={activity.link}
//                 key={activity.id}
//                 className=" text-center"
//               >
//                 <img
//                   src={activity.image}
//                   alt={activity.name}
//                   className="h-40 w-full"
//                 ></img>
//                 <p className="mt-4">{activity.name}</p>
//               </Link>
//             );
//           })}
//         </div>
//       ) : (
//         <div className="text-center text-gray-400">暂无活动</div>
//       )}
//       <Divder />
//     </>
//   );
// };

const Towns = (props: { townList: SerializeFrom<Town>[] }) => {
  return (
    <>
      {props.townList.length > 0 ? (
        <>
          <div className="my-8 grid grid-cols-3 gap-16">
            {props.townList.map((town) => {
              return (
                <Link
                  key={town.id}
                  className="relative rounded border border-gray-200"
                  style={{
                    boxShadow: "0 0 10px 0 #C1C1C1",
                  }}
                  to={`/towns/${town.id}`}
                >
                  <img
                    src={town.image!}
                    alt={town.name}
                    className="relative top-0 left-0 right-0 h-60 w-full rounded-t"
                  ></img>
                  <div className="p-4">
                    <p className=" text-2xl font-normal">{town.name}</p>
                    <p className=" mt-2 text-base text-gray-500">
                      {town.summary}
                    </p>
                    <div className=" font-base mt-4 block h-10 w-32 bg-[#62c3a5] text-center leading-10 text-white">
                      了解更多
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          <Divder />
        </>
      ) : (
        <div className="text-center text-gray-400">暂无小镇</div>
      )}
    </>
  );
};

const Notes = (props: {
  noteList: SerializeFrom<typeof getRecommendNoteList>;
}) => {
  return (
    <>
      {props.noteList.length > 0 ? (
        <div className="my-8">
          {props.noteList.map((notes, index) => {
            return (
              <div key={notes.id}>
                <div className="my-2">
                  <Link to={`/notes/${notes.id}`}>
                    <p className="mt-2 text-xl font-medium">{notes.title}</p>
                    <p className="text-sm font-light text-gray-400">
                      {notes.user.nickname}{" "}
                      {notes.updatedAt === notes.createdAt ? (
                        <>
                          发布于{" "}
                          {new Date(notes.createdAt).toLocaleDateString()}
                        </>
                      ) : (
                        <>
                          更新于{" "}
                          {new Date(notes.updatedAt).toLocaleDateString()}
                        </>
                      )}
                    </p>
                    <p className="mt-2 text-base tracking-wide">
                      {notes.summary ? (
                        <>{notes.summary}</>
                      ) : (
                        <>{notes.body.substring(0, 300)}...</>
                      )}
                    </p>
                  </Link>

                  <Form method="post">
                    <input type="hidden" name="noteId" value={notes.id}></input>
                    <button
                      type="submit"
                      className={`mt-4 mb-2 flex items-center rounded  py-1 px-2 ${
                        notes.isLiked
                          ? "bg-[#62c3a5] text-white"
                          : "bg-[#62c3a428] text-[#62c3a5] "
                      }`}
                      name="intent"
                      value="noteLike"
                    >
                      <span
                        className={`border-x-[5px] border-b-[10px] border-x-transparent ${
                          notes.isLiked
                            ? "border-b-white"
                            : "border-b-[#62c3a5]"
                        }`}
                      ></span>
                      <span className=" ml-1 ">
                        {notes.isLiked ? "已喜欢" : "喜欢"}
                      </span>
                      <span className=" ml-1 ">{notes.noteLike.length}</span>
                    </button>
                  </Form>
                </div>
                {index === props.noteList.length - 1 ? <></> : <hr />}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-gray-400">暂无小镇</div>
      )}
    </>
  );
};

export default function Index() {
  const loaderData = useLoaderData<typeof loader>();
  return (
    <main className="relative min-h-screen">
      <Carousel banners={loaderData.banners} />
      <div className="my-8 mx-auto max-w-[1200px] py-8">
        <Title content="最新公告"></Title>
        <Notices {...loaderData.notices}></Notices>
        {/* <Title content="最新活动"></Title> */}
        {/* <Activitys activityList={loaderData.activitys}></Activitys> */}
        <Title content="小镇推荐"></Title>
        <Towns townList={loaderData.towns}></Towns>
        <Title content="推荐笔记"></Title>
        <Notes noteList={loaderData.notes}></Notes>
      </div>
    </main>
  );
}

import type { ActionArgs, LoaderArgs } from "@remix-run/server-runtime";
// import { redirect } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { getCHNDMDetail } from "~/models/activity.server";
import { requireAdmin } from "~/session.server";
import { Form, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { createElement } from "react";

export async function loader({ request, params }: LoaderArgs) {
  await requireAdmin(request);
  if (!params.mcpnymdId) {
    throw new Error("mcpnymdId is required");
  }
  let user = await getCHNDMDetail(params.mcpnymdId);
  return json({ user });
}

export async function action({ request, params }: ActionArgs) {
  await requireAdmin(request);
  // const formData = await request.formData();
  invariant(params.mcpnymdId, "mcpnymdId is required");

  // let nickname = formData.get("nickname");
  // if (typeof nickname !== "string") {
  //   throw new Error("nickname is required");
  // }
  // let account = formData.get("account");
  // if (typeof account !== "string") {
  //   throw new Error("account is required");
  // }

  // let role = formData.get("role");
  // if (Role.ADMIN !== role && Role.BUSINESS !== role && Role.USER !== role) {
  //   throw new Error("role is required");
  // }

  // await updateUserById(params.mcpnymdId, nickname, account, role);

  return null;
}

export function Input({
  defaultValue,
  key,
  name,
  label,
  tagName = "input",
}: {
  defaultValue: any;
  key: any;
  name: any;
  label: string;
  tagName?: string;
}) {
  return (
    <label className="flex items-center justify-between border-y py-4 px-4">
      <span className=" inline-block text-left text-sm font-medium text-[#333]">
        {label}
      </span>
      {createElement(tagName, {
        defaultValue,
        key,
        name,
        className:
          "w-full min-w-[100px] max-w-[540px] border border-[#ddd] bg-[#fafafa] px-2 py-1 text-[#1d2129] outline-none focus:border-[#1d7dfa] focus:bg-[#fff] focus:shadow-none active:border-[#1d7dfa] active:bg-[#fff] active:shadow-none",
      })}
      {/* <input
        type="text"
        name={name}
        defaultValue={defaultValue}
        key={key}
        className="w-full min-w-[100px] max-w-[540px] border border-[#ddd] bg-[#fafafa] px-2 py-1 text-[#1d2129] outline-none 
    focus:border-[#1d7dfa] focus:bg-[#fff] focus:shadow-none 
    active:border-[#1d7dfa] active:bg-[#fff] active:shadow-none"
      /> */}
    </label>
  );
}

export default function UserEdit() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div className="h-full w-full ">
      <Form method="post" className="flex flex-col py-8 px-16">
        {Input({
          defaultValue: user?.name,
          key: user?.name,
          name: "name",
          label: "名称",
        })}
        {Input({
          defaultValue: user?.content,
          key: user?.content,
          name: "content",
          label: "内容",
          tagName: "textarea",
        })}

        <button
          type="submit"
          className="mt-8 rounded border  border-[#62c3a5] bg-transparent py-2 px-4 text-[#62c3a5]"
        >
          提交
        </button>
      </Form>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

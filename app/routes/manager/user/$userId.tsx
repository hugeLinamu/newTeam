import type { ActionArgs, LoaderArgs } from "@remix-run/server-runtime";
// import { redirect } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { getUserById, updateUserById } from "~/models/user.server";
import { requireAdmin } from "~/session.server";
import { Form, useLoaderData } from "@remix-run/react";
import { Role } from "@prisma/client";
import { useEffect, useState } from "react";
import invariant from "tiny-invariant";

export async function loader({ request, params }: LoaderArgs) {
  await requireAdmin(request);
  if (!params.userId) {
    throw new Error("userId is required");
  }
  let user = await getUserById(params.userId);
  return json({ user });
}

export async function action({ request, params }: ActionArgs) {
  await requireAdmin(request);
  const formData = await request.formData();
  invariant(params.userId, "userId is required");

  let nickname = formData.get("nickname");
  if (typeof nickname !== "string") {
    throw new Error("nickname is required");
  }
  let account = formData.get("account");
  if (typeof account !== "string") {
    throw new Error("account is required");
  }

  let role = formData.get("role");
  if (Role.ADMIN !== role && Role.BUSINESS !== role && Role.USER !== role) {
    throw new Error("role is required");
  }

  await updateUserById(params.userId, nickname, account, role);

  return null;
}

export function Input({
  defaultValue,
  key,
  name,
  label,
}: {
  defaultValue: any;
  key: any;
  name: any;
  label: string;
}) {
  return (
    <label className="flex items-center justify-between border-y py-4 px-4">
      <span className=" inline-block text-left text-sm font-medium text-[#333]">
        {label}
      </span>
      <input
        type="text"
        name={name}
        defaultValue={defaultValue}
        key={key}
        className="w-full min-w-[100px] max-w-[540px] border border-[#ddd] bg-[#fafafa] px-2 py-1 text-[#1d2129] outline-none 
    focus:border-[#1d7dfa] focus:bg-[#fff] focus:shadow-none 
    active:border-[#1d7dfa] active:bg-[#fff] active:shadow-none"
      />
    </label>
  );
}

export default function UserEdit() {
  const { user } = useLoaderData<typeof loader>();
  const [selected, setSelected] = useState(user?.role);

  useEffect(() => {
    setSelected(user?.role);
  }, [user]);
  let chagne: React.ChangeEventHandler<HTMLSelectElement> = function (e) {
    setSelected(e.target.value as "USER" | "ADMIN" | "BUSINESS");
  };

  return (
    <div className="h-full w-full ">
      <Form method="post" className="flex flex-col py-8 px-16">
        {Input({
          defaultValue: user?.nickname,
          key: user?.nickname,
          name: "nickname",
          label: "昵称",
        })}
        {Input({
          defaultValue: user?.account,
          key: user?.account,
          name: "account",
          label: "账号",
        })}
        <label className="flex items-center justify-between border-b py-4 px-4">
          <span className=" inline-block text-left text-sm font-medium text-[#333]">
            权限
          </span>
          <select
            className="w-full min-w-[100px] max-w-[540px] border border-[#ddd]  bg-[#fafafa] px-2 py-1 text-[#1d2129] "
            name="role"
            id="role"
            value={selected}
            onChange={chagne}
          >
            <option value={Role.USER}>用户</option>
            <option value={Role.BUSINESS}>商家</option>
            <option value={Role.ADMIN}>管理员</option>
          </select>
        </label>
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

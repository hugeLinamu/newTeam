import type { ActionArgs, LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { getTownById, updateTown } from "~/models/town.server";
import { requireAdmin } from "~/session.server";
import { Form, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { Input } from "../user/$userId";

export async function loader({ request, params }: LoaderArgs) {
  await requireAdmin(request);
  if (!params.townId) {
    throw new Error("userId is required");
  }
  let town = await getTownById(params.townId);
  return json({ town });
}

export async function action({ request, params }: ActionArgs) {
  await requireAdmin(request);
  const formData = await request.formData();
  invariant(params.townId, "userId is required");

  let name = formData.get("name");
  if (typeof name !== "string") {
    throw new Error("name is required");
  }
  let industry = formData.get("industry");
  if (typeof industry !== "string") {
    throw new Error("industry is required");
  }
  let investment = formData.get("investment");
  if (typeof investment !== "string") {
    throw new Error("investment is required");
  }
  let company = formData.get("company");
  if (typeof company !== "string") {
    throw new Error("company is required");
  }
  let area = formData.get("area");
  if (typeof area !== "string") {
    throw new Error("area is required");
  }
  let location = formData.get("location");
  if (typeof location !== "string") {
    throw new Error("location is required");
  }
  let image = formData.get("image");
  if (typeof image !== "string") {
    throw new Error("image is required");
  }
  let panoramaURL = formData.get("panoramaURL");
  if (typeof panoramaURL !== "string") {
    throw new Error("panoramaURL is required");
  }
  let status = formData.get("status");
  let isRecommend = !!status;

  await updateTown(params.townId, {
    name,
    industry,
    investment,
    company,
    area,
    location,
    image,
    panoramaURL,
    isRecommend,
  });

  return null;
}

export default function UserEdit() {
  const { town } = useLoaderData<typeof loader>();
  //   const [detail, setDetail] = useState(
  //     town?.detail as { title: string; content: string }[]
  //   );
  console.log(town);

  return (
    <div className="h-full w-full ">
      <Form method="post" className="flex flex-col py-8 px-16">
        <Input
          defaultValue={town?.name}
          key={town?.name}
          name="name"
          label="小镇名称"
        />
        <Input
          defaultValue={town?.industry}
          key={town?.industry}
          name="industry"
          label="产业"
        />
        <Input
          defaultValue={town?.investment}
          key={town?.investment}
          name="investment"
          label="投资规模"
        />
        <Input
          defaultValue={town?.company}
          key={town?.company}
          name="company"
          label="入住企业"
        />
        <Input
          defaultValue={town?.area}
          key={town?.area}
          name="area"
          label="面积"
        />
        <Input
          defaultValue={town?.location}
          key={town?.location}
          name="location"
          label="位置"
        />
        <Input
          defaultValue={town?.image}
          key={town?.image}
          name="image"
          label="图片"
        />
        <Input
          defaultValue={town?.panoramaURL}
          key={town?.panoramaURL}
          name="panoramaURL"
          label="全景地图地址"
        />
        <label className="float-left mt-4 flex items-center rounded border border-[#62c3a5]  bg-transparent   py-2 px-4 text-[#62c3a5]">
          <input type="checkbox" name="status" defaultValue="1" />
          <span className=" ml-2 cursor-pointer text-sm leading-none">
            是否推荐
          </span>
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

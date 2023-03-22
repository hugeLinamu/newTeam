import type {
  ActionArgs,
  LinksFunction,
  SerializeFrom,
  LoaderArgs,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useCatch } from "@remix-run/react";
import invariant from "tiny-invariant";
import * as React from "react";

import { updateNote, getNote, checkNoteOwner } from "~/models/note.server";
import type { noteStatus } from "~/models/note.server";
import { requireUserId, requireAdmin, getUserId } from "~/session.server";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";

import { ClientOnly } from "remix-utils";

import mdEditorStylesheetUrl from "react-markdown-editor-lite/lib/index.css";

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: mdEditorStylesheetUrl,
    },
  ];
};

export async function loader({ request, params }: LoaderArgs) {
  invariant(params.noteId, "noteId not found");
  const userId = await getUserId(request);
  const note = await getNote({ id: params.noteId });

  if (!note) {
    throw new Response("Not Found", { status: 404 });
  }

  if (note?.status === "PRIVATE" && note.userId !== userId) {
    await requireAdmin(request);
  }

  return json({ note });
}

export async function action({ request, params }: ActionArgs) {
  let userId = await requireUserId(request);
  let _note = await checkNoteOwner({ userId, id: params.noteId! });
  if (_note == null) {
    await requireAdmin(request);
  }
  const formData = await request.formData();
  const title = formData.get("title");
  const body = formData.get("body");
  const isPrivate = formData.get("status");
  let status: noteStatus = "PUBLIC";
  if (isPrivate) {
    status = "PRIVATE";
  } else {
    status = "PUBLIC";
  }

  if (typeof title !== "string" || title.length === 0) {
    return json(
      { errors: { title: "Title is required", body: null } },
      { status: 400 }
    );
  }

  if (typeof body !== "string" || body.length === 0) {
    return json(
      { errors: { title: null, body: "Body is required" } },
      { status: 400 }
    );
  }
  console.log(title, body, params.noteId!);

  const note = await updateNote({
    title,
    body,
    id: params.noteId!,
    status,
  });

  return redirect(`/notes/${note.id}`);
}

const fallbackInput = (
  inputRef: React.RefObject<HTMLTextAreaElement>,
  actionData?: SerializeFrom<typeof action>
) => {
  return (
    <>
      <textarea
        name="body"
        ref={inputRef}
        aria-invalid={actionData?.errors?.body ? true : undefined}
        aria-errormessage={actionData?.errors?.body ? "body-error" : undefined}
        className="w-full rounded-xl border py-2 px-3 leading-6"
        rows={6}
        placeholder="内容"
      />
      {actionData?.errors?.body && (
        <div className="pt-1 text-red-700" id="body-error">
          {actionData.errors.body}
        </div>
      )}
    </>
  );
};

export default function EditNotePage() {
  const actionData = useActionData<typeof action>();
  const loaderData = useLoaderData<typeof loader>();

  const titleRef = React.useRef<HTMLInputElement>(null);
  const bodyRef = React.useRef<HTMLTextAreaElement>(null);
  const mdRef = React.useRef<MdEditor>(null);

  const mdParser = new MarkdownIt({
    breaks: true,
    xhtmlOut: true,
  });

  const [formText, setFormText] = React.useState<string>("");

  function handleEditorChange({ text }: { text: string }) {
    setFormText(text);
  }

  React.useEffect(() => {
    if (actionData?.errors?.title) {
      titleRef.current?.focus();
    } else if (actionData?.errors?.body) {
      bodyRef.current?.focus();
    }
  }, [actionData]);
  React.useEffect(() => {
    setTimeout(() => {
      titleRef.current!.value = loaderData.note.title;
      !!bodyRef.current && (bodyRef.current.value = loaderData.note.body);
      mdRef.current!.setText(loaderData.note.body);
    }, 0);
  }, [loaderData]);

  return (
    <div className="mx-auto w-[1200px] py-8">
      <Form
        method="post"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          width: "100%",
        }}
      >
        <input
          type="text"
          name="title"
          ref={titleRef}
          aria-invalid={actionData?.errors?.title ? "true" : "false"}
          aria-errormessage={
            actionData?.errors?.title ? "title-error" : undefined
          }
          className="h-12 rounded-xl border px-4  leading-[3rem]"
          placeholder="标题"
        />

        {actionData?.errors?.title && (
          <div className="pt-1 text-red-700" id="title-error">
            {actionData.errors.title}
          </div>
        )}

        <ClientOnly fallback={fallbackInput(bodyRef, actionData)}>
          {() => {
            return (
              <>
                <input type="hidden" value={formText} name="body" />
                <MdEditor
                  style={{ height: "500px", width: "100%" }}
                  renderHTML={(text) => mdParser.render(text)}
                  onChange={handleEditorChange}
                  ref={mdRef}
                />
                {actionData?.errors?.body && (
                  <div className="pt-1 text-red-700" id="body-error">
                    {actionData.errors.body}
                  </div>
                )}
              </>
            );
          }}
        </ClientOnly>

        <div className="after:invisible after:clear-both after:block after:h-0 after:overflow-hidden after:content-['_']">
          <label className="float-left flex items-center rounded border border-[#62c3a5] bg-transparent  py-2   px-4 text-[#62c3a5]">
            <input type="checkbox" name="status" defaultValue="1" />
            <span className=" ml-2 cursor-pointer text-sm leading-none">
              私密
            </span>
          </label>

          <button
            type="submit"
            className=" float-right rounded border  border-[#62c3a5] bg-transparent py-2 px-4 text-[#62c3a5]"
          >
            保存
          </button>
        </div>
      </Form>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

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

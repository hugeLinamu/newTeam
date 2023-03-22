import type { ActionArgs, LinksFunction, SerializeFrom } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";

import * as React from "react";

import { createNotice } from "~/models/notice.server";
import { requireUserId, requireAdmin } from "~/session.server";
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

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);
  await requireAdmin(request);
  const formData = await request.formData();
  const title = formData.get("title");
  const body = formData.get("body");

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

  const note = await createNotice({ title, content: body, userId });

  return redirect(`/notice/${note.id}`);
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

export default function NewNotePage() {
  const actionData = useActionData<typeof action>();
  const titleRef = React.useRef<HTMLInputElement>(null);
  const bodyRef = React.useRef<HTMLTextAreaElement>(null);
  const mdParser = new MarkdownIt({
    breaks: true,
    xhtmlOut: true,
  });

  const [formText, setFormText] = React.useState<string>("");

  function handleEditorChange({ text }: { text: string }) {
    setFormText(text);
  }

  React.useEffect(() => {
    console.log(actionData);
    if (actionData?.errors?.title) {
      titleRef.current?.focus();
    } else if (actionData?.errors?.body) {
      bodyRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="mx-auto w-[1200px] py-4">
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

        <div className="text-right">
          <button
            type="submit"
            className="rounded border  border-[#62c3a5] bg-transparent py-2 px-4 text-[#62c3a5]"
          >
            保存
          </button>
        </div>
      </Form>
    </div>
  );
}

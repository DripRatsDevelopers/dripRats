import cloudinaryLoader from "@/lib/cloudinaryUtils";
import { cn } from "@/lib/utils";
import Image, { ImageProps } from "next/image";
import { useState } from "react";

const DripratsImage = ({ alt, ...props }: ImageProps) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <Image
        loader={cloudinaryLoader}
        alt={alt}
        {...props}
        onLoad={(e) => {
          setLoaded(true);
          if (props.onLoad) {
            props.onLoad(e);
          }
        }}
        className={cn(
          "transition-opacity duration-500 object-cover",
          loaded ? "opacity-100" : "opacity-0",
          props.className
        )}
      />
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#111] via-[#222] to-[#111] animate-pulse z-0">
          <span className="text-white/50 text-sm tracking-wider font-medium">
            DRIPRATS
          </span>
        </div>
      )}
    </>
  );
};

export default DripratsImage;

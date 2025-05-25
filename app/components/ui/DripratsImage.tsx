import cloudinaryLoader from "@/lib/cloudinaryUtils";
import Image, { ImageProps } from "next/image";

const DripratsImage = ({ alt, ...props }: ImageProps) => {
  return (
    <Image
      loader={cloudinaryLoader}
      alt={alt}
      {...props}
      placeholder="blur"
      blurDataURL="/BlurImage.png"
    />
  );
};

export default DripratsImage;

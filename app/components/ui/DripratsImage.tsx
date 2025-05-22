import cloudinaryLoader from "@/lib/cloudinaryUtils";
import Image, { ImageProps } from "next/image";

const DripratsImage = ({ alt, ...props }: ImageProps) => {
  return (
    <Image
      loader={cloudinaryLoader}
      placeholder="blur"
      blurDataURL="/BlurImage.png"
      alt={alt}
      {...props}
    />
  );
};

export default DripratsImage;

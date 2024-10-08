import { useState } from "react";
import { Skeleton } from "../ui/skeleton";

interface ImageCellProps {
  jacketPath: string | undefined;
}

const ImageCell: React.FC<ImageCellProps> = ({ jacketPath }) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
  };

  const formattedJacketPath = jacketPath?.replace(".dds", ".png");

  return (
    <div className="flex h-[100px] w-[100px]">
      {formattedJacketPath ? (
        <img
          src={`/jacketArts/${formattedJacketPath}`}
          alt="Jacket"
          className={`${isLoading ? "hidden" : ""} max-h-full max-w-full`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      ) : (
        <Skeleton className="block h-[100px] w-[100px]" />
      )}
    </div>
  );
};

export default ImageCell;

"use client";
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
          className={`${isLoading ? "hidden" : ""}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      ) : (
        <Skeleton className="inline-block h-[100px] w-[100px]" />
      )}
    </div>
  );
};

export default ImageCell;

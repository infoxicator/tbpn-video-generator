import React from "react";
import { Spinner } from "./Spinner";

export const Loading: React.FC<{
  title?: string;
  subtitle?: string;
  compact?: boolean;
}> = ({
  title = "Rendering video preview…",
  subtitle = "Preparing composition, fonts, and assets",
  compact = false,
}) => {
  return (
    <div className={compact ? "py-6" : "py-16"}>
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <Spinner size={56} />
        <div className="space-y-1">
          <p className="text-lg font-semibold">{title}</p>
          <p className="text-subtitle text-sm">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export default Loading;


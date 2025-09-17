import { z } from "zod";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorComp } from "./Error";
import { Spinner } from "./Spinner";
import { StoryResponse } from "~/remotion/schemata";

type ShareState = "idle" | "submitting" | "error";

export const RenderControls: React.FC<{
  inputProps: z.infer<typeof StoryResponse>;
}> = ({ inputProps }) => {
  const navigate = useNavigate();
  const [state, setState] = useState<ShareState>("idle");
  const [error, setError] = useState<string | null>(null);

  const handleShare = useCallback(async () => {
    if (state === "submitting") return;
    setState("submitting");
    setError(null);

    try {
      const response = await fetch("/api/story-shares", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ storyData: inputProps }),
      });

      if (!response.ok) {
        throw new Error("Failed to create share link.");
      }

      const json = await response.json();
      if (json?.type !== "success" || typeof json?.data?.id !== "string") {
        throw new Error("Unexpected response from share service.");
      }

      navigate(`/share/${json.data.id}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      setState("error");
      return;
    }

    setState("idle");
  }, [inputProps, navigate, state]);

  const isSubmitting = state === "submitting";

  return (
    <div className="mx-auto w-full max-w-[360px]">
      <button
        type="button"
        onClick={handleShare}
        disabled={isSubmitting}
        className={`group relative flex h-12 w-full items-center justify-center overflow-hidden rounded-full border px-6 transition-all duration-200 border-[#1bd494] bg-[linear-gradient(90deg,rgba(8,45,34,0.92),rgba(4,25,18,0.9))] shadow-[0_0_24px_rgba(31,255,177,0.12)] ${
          isSubmitting
            ? "opacity-70 cursor-wait"
            : "hover:border-[#25ffb5] hover:shadow-[0_0_32px_rgba(37,255,181,0.2)]"
        }`}
      >
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[radial-gradient(circle_at_top,rgba(45,255,183,0.35),rgba(0,0,0,0))]"
          aria-hidden
        />
        {isSubmitting ? (
          <div className="relative flex items-center gap-3 text-[#dfffee]">
            <Spinner size={24} color="#27ffc0" />
            <span className="tbpn-subheadline text-xs tracking-[0.3em] uppercase">Preparing share link…</span>
          </div>
        ) : (
          <div className="relative flex items-center gap-3 text-[#dfffee]">
            <span className="h-2.5 w-2.5 rounded-full bg-[#27ffc0] shadow-[0_0_12px_rgba(39,255,192,0.8)]" />
            <span className="tbpn-subheadline text-xs tracking-[0.32em] uppercase">Share this rumor reel</span>
          </div>
        )}
      </button>
      {error ? (
        <div className="mt-3">
          <ErrorComp message={error} />
        </div>
      ) : null}
    </div>
  );
};

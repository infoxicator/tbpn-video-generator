import { Player } from "@remotion/player";
import { type FC } from "react";
import {
  DURATION_IN_FRAMES,
  COMPOSITION_FPS,
  COMPOSITION_HEIGHT,
  COMPOSITION_WIDTH,
} from "./remotion/constants.mjs";
import "./app.css";
import { z } from "zod";
import { Main } from "./remotion/components/Main";
import { StoryResponse } from "./remotion/schemata";
import { Loading } from "./components/Loading";
import { Spacing } from "./components/Spacing";

interface SuccessLoaderData {
  status: "success";
  storyData: z.infer<typeof StoryResponse>;
  shareUrl: string;
  shareId: string;
}

interface ErrorLoaderData {
  status: "error";
  message: string;
  shareUrl: string;
}

type LoaderData = SuccessLoaderData | ErrorLoaderData;

export async function clientLoader({ params, request }: { params: { shareId?: string }; request: Request }) {
  const shareId = params.shareId;
  const currentUrl = new URL(request.url);

  if (!shareId) {
    return {
      status: "error",
      message: "Missing share identifier.",
      shareUrl: currentUrl.origin,
    } satisfies LoaderData;
  }

  try {
    const res = await fetch(`https://imageplustexttoimage.mcp-ui-flows-nanobanana.workers.dev/api/payloads/${shareId}`);
    if (!res.ok) {
      const message = res.status === 404 ? "We couldn't find that rumor reel." : "Unable to load shared story.";
      return {
        status: "error",
        message,
        shareUrl: `${currentUrl.origin}/share/${shareId}`,
      } satisfies LoaderData;
    }
    const json = await res.json();
    if (json?.type === "error") {
      return {
        status: "error",
        message: typeof json.message === "string" ? json.message : "Unable to load shared story.",
        shareUrl: `${currentUrl.origin}/share/${shareId}`,
      } satisfies LoaderData;
    }

    const parsed = StoryResponse.safeParse(json?.payload);
    if (!parsed.success) {
      return {
        status: "error",
        message: "Shared story data is corrupted.",
        shareUrl: `${currentUrl.origin}/share/${shareId}`,
      } satisfies LoaderData;
    }

    return {
      status: "success",
      storyData: parsed.data,
      shareId,
      shareUrl: `${currentUrl.origin}/share/${shareId}`,
    } satisfies LoaderData;
  } catch (error) {
    console.error("Failed to load shared story", error);
    return {
      status: "error",
      message: "Something glitched while loading this reel.",
      shareUrl: `${currentUrl.origin}/share/${shareId}`,
    } satisfies LoaderData;
  }
}

export function HydrateFallback() {
  return (
    <div className="bg-[#05060d] tbpn-body min-h-screen text-[#f4f6ff] pb-16">
      <div className="max-w-screen-lg m-auto px-6 md:px-10 pt-20">
        <div className="mx-auto w-full max-w-[360px]">
          <div className="relative overflow-hidden rounded-[28px] mb-12 mt-8 border border-[#19cc8d] shadow-[0_45px_140px_rgba(12,64,46,0.55)] aspect-[9/16]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#072f22] via-[#041912] to-[#010705]" aria-hidden />
            <div className="absolute -inset-8 bg-[radial-gradient(circle_at_top,#29ffb6_0%,rgba(10,44,32,0)_65%)] opacity-30" aria-hidden />
            <div className="relative flex h-full w-full items-center justify-center">
              <Loading
                compact
                title="Loading shared rumor reel…"
                subtitle="Cue the ticker tape"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const ShareToTwitterButton: FC<{ shareUrl: string }> = ({ shareUrl }) => {
  const handleClick = () => {
    const tweetText = "Rumor reel just dropped from the MCP-UI newsroom.";
    const intentUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(tweetText)}`;
    window.open(intentUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="group relative flex h-12 w-full items-center justify-center overflow-hidden rounded-full border border-[#1bd494] px-6 transition-all duration-200 bg-[linear-gradient(90deg,rgba(8,45,34,0.92),rgba(4,25,18,0.9))] shadow-[0_0_24px_rgba(31,255,177,0.12)] hover:border-[#25ffb5] hover:shadow-[0_0_32px_rgba(37,255,181,0.2)]"
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[radial-gradient(circle_at_top,rgba(45,255,183,0.35),rgba(0,0,0,0))]"
        aria-hidden
      />
      <div className="relative flex items-center gap-3 text-[#dfffee]">
        <span className="tbpn-subheadline text-xs tracking-[0.32em] uppercase">Share on Twitter</span>
      </div>
    </button>
  );
};

export default function SharedRumorReel({ loaderData }: { loaderData: LoaderData }) {
  if (loaderData.status === "error") {
    return (
      <div className="bg-[#05060d] tbpn-body min-h-screen text-[#f4f6ff] pb-16">
        <div className="max-w-screen-md m-auto px-6 md:px-10 pt-24 text-center">
          <div className="mx-auto max-w-md rounded-[28px] border border-[#ff88d5] bg-[#2b0a25] px-6 py-8 shadow-[0_0_45px_rgba(255,119,200,0.35)]">
            <h1 className="tbpn-headline text-2xl text-white">Rumor reel missing</h1>
            <p className="mt-4 text-sm text-[#ffd8f1]">{loaderData.message}</p>
          </div>
        </div>
      </div>
    );
  }

  const inputProps: z.infer<typeof StoryResponse> = loaderData.storyData;

  return (
    <div className="bg-[#05060d] tbpn-body min-h-screen text-[#f4f6ff] pb-16">
      <div className="max-w-screen-lg m-auto px-6 md:px-10 pt-20">
        <div className="mx-auto w-full max-w-[360px]">
          <div className="overflow-hidden rounded-[28px] shadow-[0_35px_110px_rgba(0,0,0,0.55)] border border-[#124c38] mb-12 mt-8 aspect-[9/16]">
            <Player
              component={Main}
              inputProps={inputProps}
              durationInFrames={DURATION_IN_FRAMES}
              fps={COMPOSITION_FPS}
              compositionHeight={COMPOSITION_HEIGHT}
              compositionWidth={COMPOSITION_WIDTH}
              style={{ width: "100%", height: "100%" }}
              controls
              autoPlay
              loop
            />
          </div>
        </div>

        <div className="mx-auto w-full max-w-[360px]">
          <ShareToTwitterButton shareUrl={loaderData.shareUrl} />
        </div>

        <Spacing />
        <Spacing />
        <Spacing />
        <Spacing />
      </div>
    </div>
  );
}

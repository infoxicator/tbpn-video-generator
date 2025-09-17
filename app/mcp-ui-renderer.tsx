import { Player } from "@remotion/player";
import { useMemo } from "react";
import {
  DURATION_IN_FRAMES,
  COMPOSITION_FPS,
  COMPOSITION_HEIGHT,
  COMPOSITION_WIDTH,
} from "./remotion/constants.mjs";
import "./app.css";
import { z } from "zod";
import { Main } from "./remotion/components/Main";
import { RenderControls } from "./components/RenderControls";
import { Spacing } from "./components/Spacing";
import { StoryResponse } from "./remotion/schemata";
import { useMcpUiInit, waitForRenderData } from "./utils/mcp";
import sampleResponse from "./remotion/components/Sample/response.json";
import { Loading } from "./components/Loading";

export async function clientLoader({ request }: { request: Request }) {
  try {
    const renderData = await waitForRenderData(StoryResponse, {
      signal: request.signal,
      timeoutMs: 3_000,
    });
    return renderData;
  } catch (error) {
    console.error("error", error);
    return sampleResponse;
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
                title="Rendering video…"
                subtitle="🤖 *beep boop* rumor mill spinning up"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Index({ loaderData }: { loaderData: z.infer<typeof StoryResponse> }) {
  const storyData = loaderData;
  useMcpUiInit();

  const inputProps: z.infer<typeof StoryResponse> = useMemo(() => {
    return storyData;
  }, [storyData]);

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
        <RenderControls inputProps={inputProps} />
        <Spacing />
        <Spacing />
        <Spacing />
        <Spacing />
        {/* <Tips></Tips> */}
      </div>
    </div>
  );
}

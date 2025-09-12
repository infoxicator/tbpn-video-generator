import { Player } from "@remotion/player";
import { useMemo, useState } from "react";
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
import  sampleResponse  from "./remotion/components/Sample/response.json";
import { Loading } from "./components/Loading";

export async function clientLoader({ request }: { request: Request }) {
  try {
    const renderData = await waitForRenderData(
      StoryResponse,
      { signal: request.signal, timeoutMs: 3_000 },
    )
    return renderData
  } catch (error) {
    console.error('error', error)
    return sampleResponse
  }
}

export function HydrateFallback() {
  return (
    <div className="max-w-screen-md m-auto mb-5">
      <div className="overflow-hidden rounded-geist shadow-[0_0_200px_rgba(0,0,0,0.15)] mb-10 mt-16 bg-background">
        <div className="aspect-[9/16] flex items-center justify-center">
          <Loading compact title="Rendering video…" subtitle="🤖 *beep boop* AI neurons firing... pixels assembling... magic happening..." />
        </div>
      </div>
    </div>
  );
}

export default function Index({ loaderData }: { loaderData: z.infer<typeof StoryResponse> } ) {
  const storyData = loaderData
  useMcpUiInit()
  const [text, setText] = useState("MCP-Ui 🤝 Remotion");

  const inputProps: z.infer<typeof StoryResponse> = useMemo(() => {
    return storyData
  }, [storyData]);

  return (
    <div>
      <div className="max-w-screen-md m-auto mb-5">
        <div className="overflow-hidden rounded-geist shadow-[0_0_200px_rgba(0,0,0,0.15)] mb-10 mt-16">
          <Player
            component={Main}
            inputProps={inputProps}
            durationInFrames={DURATION_IN_FRAMES}
            fps={COMPOSITION_FPS}
            compositionHeight={COMPOSITION_HEIGHT}
            compositionWidth={COMPOSITION_WIDTH}
            style={{
              // Can't use tailwind class for width since player's default styles take presedence over tailwind's,
              // but not over inline styles
              width: "100%",
            }}
            controls
            autoPlay
            loop
          />
        </div>
        <RenderControls
          text={text}
          setText={setText}
          inputProps={inputProps}
        ></RenderControls>
        <Spacing></Spacing>
        <Spacing></Spacing>
        <Spacing></Spacing>
        <Spacing></Spacing>
        {/* <Tips></Tips> */}
      </div>
    </div>
  );
}

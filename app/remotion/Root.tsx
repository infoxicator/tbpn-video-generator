import { Composition } from "remotion";
import {
  DURATION_IN_FRAMES,
  COMPOSITION_FPS,
  COMPOSITION_HEIGHT,
  COMPOSITION_ID,
  COMPOSITION_WIDTH,
} from "./constants.mjs";
import { Main } from "./components/Main";
import  sampleResponse  from "./components/Sample/response.json";


export const RemotionRoot = () => {
  const inputProps = sampleResponse;
  return (
    <>
      <Composition
        id={COMPOSITION_ID}
        inputProps={inputProps}
        // @ts-expect-error Remotion typing expects loose props; component is compatible at runtime
        component={Main}
        durationInFrames={DURATION_IN_FRAMES}
        fps={COMPOSITION_FPS}
        width={COMPOSITION_WIDTH}
        height={COMPOSITION_HEIGHT}
        defaultProps={inputProps}
      />
    </>
  );
};

import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { ImageTextSlide } from "./ImageTextSlide";
import { TitleSlide } from "./TitleSlide";
import { EndSlide } from "./EndSlide";
import { StoryData } from "../types";

interface StorySlidesProps {
  storyData: StoryData;
}

export const StorySlides: React.FC<StorySlidesProps> = ({ storyData }) => {
  const { durationInFrames } = useVideoConfig();

  const slides = storyData.slides ?? [];
  const mainImage = storyData.mainImage ?? slides[0]?.image;
  const detailSlides = slides;
  const detailCount = detailSlides.length;

  const titleDuration = Math.max(90, Math.floor(storyData.title.length * 1.5));
  const endDuration = 90;
  const remainingFrames = durationInFrames - titleDuration - endDuration;
  const safeRemainingFrames = Math.max(0, remainingFrames);
  const timingSlideCount = Math.max(detailCount, 1);
  const slideDuration = Math.floor(safeRemainingFrames / timingSlideCount);
  const slideRemainder = safeRemainingFrames % timingSlideCount;

  let sequenceOffset = titleDuration;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#031f16",
      }}
    >
      <Sequence durationInFrames={titleDuration}>
        <TitleSlide
          title={storyData.title}
          image={mainImage}
        />
      </Sequence>

      {detailSlides.map((slide, index) => {
        const extraFrame = index < slideRemainder ? 1 : 0;
        const durationForSlide = slideDuration + extraFrame;
        if (durationForSlide <= 0) {
          return null;
        }
        const from = sequenceOffset;
        sequenceOffset += durationForSlide;

        return (
          <Sequence key={`slide-${index}`} from={from} durationInFrames={durationForSlide}>
            <ImageTextSlide
              image={slide?.image}
              text={slide?.text}
              slideIndex={index}
              totalSlides={detailCount || 1}
            />
          </Sequence>
        );
      })}

      <Sequence from={durationInFrames - endDuration} durationInFrames={endDuration}>
        <EndSlide callToAction="Like and subscribe, create your own" title="Thanks for watching!" />
      </Sequence>
    </AbsoluteFill>
  );
};

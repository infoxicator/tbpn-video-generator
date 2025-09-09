import {
  AbsoluteFill,
  Sequence,
  useVideoConfig,
} from "remotion";
import { ImageTextSlide } from "./ImageTextSlide";
import { TitleSlide } from "./TitleSlide";
import { EndSlide } from "./EndSlide";
import { splitTextIntoFourParts, prepareImageArray } from "../utils/textSplitter";
import { StoryData } from "../types";

interface StorySlidesProps {
  storyData: StoryData;
}

export const StorySlides: React.FC<StorySlidesProps> = ({ storyData }) => {
  const { durationInFrames } = useVideoConfig();

  // Process the data
  const textParts = splitTextIntoFourParts(storyData.aiSummary);
  const imageArray = prepareImageArray(storyData.images);

  // Calculate timing for the complete story flow
  const titleDuration = Math.floor(storyData.title.length * 1.5); // Dynamic title duration based on length
  const endDuration = 90; // 3 seconds for end frame
  const remainingFrames = durationInFrames - titleDuration - endDuration;
  const slideDuration = Math.floor(remainingFrames / 4);
  const slideRemainder = remainingFrames % 4;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000",
      }}
    >
      {/* Title Sequence */}
      <Sequence durationInFrames={titleDuration}>
        <TitleSlide title={storyData.title} />
      </Sequence>

      {/* Image & Text Slide 1 */}
      <Sequence
        from={titleDuration}
        durationInFrames={slideDuration + (slideRemainder > 0 ? 1 : 0)}
      >
        <ImageTextSlide
          image={imageArray[0]}
          text={textParts[0]}
          slideIndex={0}
        />
      </Sequence>

      {/* Image & Text Slide 2 */}
      <Sequence
        from={titleDuration + slideDuration + (slideRemainder > 0 ? 1 : 0)}
        durationInFrames={slideDuration + (slideRemainder > 1 ? 1 : 0)}
      >
        <ImageTextSlide
          image={imageArray[1]}
          text={textParts[1]}
          slideIndex={1}
        />
      </Sequence>

      {/* Image & Text Slide 3 */}
      <Sequence
        from={titleDuration + 2 * slideDuration + (slideRemainder > 0 ? 1 : 0) + (slideRemainder > 1 ? 1 : 0)}
        durationInFrames={slideDuration + (slideRemainder > 2 ? 1 : 0)}
      >
        <ImageTextSlide
          image={imageArray[2]}
          text={textParts[2]}
          slideIndex={2}
        />
      </Sequence>

      {/* Image & Text Slide 4 */}
      <Sequence
        from={titleDuration + 3 * slideDuration + (slideRemainder > 0 ? 1 : 0) + (slideRemainder > 1 ? 1 : 0) + (slideRemainder > 2 ? 1 : 0)}
        durationInFrames={slideDuration}
      >
        <ImageTextSlide
          image={imageArray[3]}
          text={textParts[3]}
          slideIndex={3}
        />
      </Sequence>

      {/* End Frame with Call to Action */}
      <Sequence
        from={durationInFrames - endDuration}
        durationInFrames={endDuration}
      >
        <EndSlide 
          callToAction="Hit the link to read more..."
          title="Thanks for watching!"
        />
      </Sequence>
    </AbsoluteFill>
  );
};
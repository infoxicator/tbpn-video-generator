import { StorySlides } from "./StorySlides";
import { StoryData } from "../types";

export const Main = (props: StoryData) => {
  console.log('props', props)
  return <StorySlides storyData={props} />;
};

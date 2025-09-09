import { StorySlides } from "./StorySlides";
import { StoryData } from "../types";
import response from './Sample/response.json';

const storyData: StoryData = response as StoryData;

export const Main = () => {
  return <StorySlides storyData={storyData} />;
};

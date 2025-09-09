export interface StoryData {
	title: string;
	images: string[];
	date: string;
	aiSummary: string;
}

export interface BigBadGroupProps {
	images: string[];
	aiSummary: string;
	title: string;
}

export interface ImageSlideGroupProps {
	imgs: string[];
	durationInFrames?: number;
}

export interface LogoFrameProps {
	index: number;
	img: string;
}

export interface TitleProps {
	titleText: string;
}

export interface TextSlideGroupProps {
	strings: string[];
	durationInFrames: number;
}

export interface EndFrameProps {
	callToAction: string;
}

export interface ImageTestProps {
	img: string;
	index: number;
	frames: number;
}
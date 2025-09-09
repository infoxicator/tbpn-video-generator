// Type declarations for Sample components
declare module './ImageSlideGroup' {
  interface ImageSlideGroupProps {
    imgs: string[];
    durationInFrames?: number;
  }
  export const ImageSlideGroup: React.FC<ImageSlideGroupProps>;
}

declare module './LogoFrame' {
  interface LogoFrameProps {
    index: number;
    img: string;
  }
  export const LogoFrame: React.FC<LogoFrameProps>;
}

declare module './Title' {
  interface TitleProps {
    titleText: string;
  }
  export const Title: React.FC<TitleProps>;
}

declare module './TextSlideGroup' {
  interface TextSlideGroupProps {
    strings: string[];
    durationInFrames: number;
  }
  export const TextSlideGroup: React.FC<TextSlideGroupProps>;
}

declare module './EndFrame' {
  interface EndFrameProps {
    callToAction: string;
  }
  export const EndFrame: React.FC<EndFrameProps>;
}

declare module './textBreaker' {
  export function textBreaker(text: string): string[];
}
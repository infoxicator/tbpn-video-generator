import {
  AbsoluteFill,
  Img,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

interface ImageTextSlideProps {
  image: string;
  text: string;
  slideIndex: number;
}

export const ImageTextSlide: React.FC<ImageTextSlideProps> = ({
  image,
  text,
  slideIndex,
}) => {
  const frame = useCurrentFrame();
  const videoConfig = useVideoConfig();

  // Calculate slide duration for proper timing
  const slideDuration = videoConfig.durationInFrames;
  
  // Text slide-in animation (matching original TextTest component)
  const slideIn = spring({
    frame,
    config: {
      mass: 0.5,
    },
    from: 1080,
    to: 0,
    fps: 30,
  });

  // Text slide-out animation (matching original TextTest component)
  const slideOut = spring({
    frame: frame - ((slideDuration / 10) * 9),
    config: {
      mass: 0.1,
    },
    from: 0,
    to: 700,
    fps: 30,
  });

  return (
    <AbsoluteFill>
      {/* Background Image */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <Img
          src={image}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          onError={() => {
            console.warn(`Failed to load image: ${image}`);
          }}
        />
      </AbsoluteFill>

      {/* Text Content with original styling */}
      {text && (
        <div
          style={{
            transform: `translateY(${slideOut}px)`,
            transformOrigin: "bottom center",
            display: 'flex',
            alignItems: 'center',
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}
        >
          <div
            style={{
              marginTop: 'auto',
              padding: '3rem',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-end',
              transform: `translateX(${slideIn}px)`,
              width: '100%',
            }}
          >
            <div
              style={{
                transform: 'skew(20deg)',
                backgroundColor: '#5716A2',
                border: '10px solid #731DD8',
                padding: 20,
                borderRadius: '15px',
                maxWidth: '80%',
              }}
            >
              <div
                style={{
                  transform: 'skew(-20deg)',
                }}
              >
                <p
                  style={{
                    color: '#ffffff',
                    fontSize: '3.5rem',
                    marginTop: 0,
                    marginBottom: 0,
                    marginRight: 60,
                    marginLeft: 60,
                    fontFamily: 'verdana',
                    textAlign: 'center',
                    lineHeight: 1.2,
                  }}
                >
                  {text}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Slide indicator */}
      <AbsoluteFill
        style={{
          justifyContent: "flex-start",
          alignItems: "center",
          paddingTop: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "8px",
          }}
        >
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              style={{
                width: "60px",
                height: "3px",
                backgroundColor:
                  index === slideIndex
                    ? "#FFD166"  // Yellow accent color from original
                    : "rgba(255, 255, 255, 0.3)",
                borderRadius: "2px",
              }}
            />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
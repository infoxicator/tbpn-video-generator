import {
  AbsoluteFill,
  Img,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

interface ImageTextSlideProps {
  image?: string;
  text?: string;
  slideIndex: number;
  totalSlides: number;
}

const accentColor = "#19c48a";

export const ImageTextSlide: React.FC<ImageTextSlideProps> = ({
  image,
  text,
  slideIndex,
  totalSlides,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const textLift = spring({
    frame,
    fps,
    from: 80,
    to: 0,
    config: {
      damping: 120,
      stiffness: 180,
    },
  });

  const placement = (() => {
    switch (slideIndex) {
      case 1:
        return {
          wrapper: {
            top: 120,
            bottom: "auto" as const,
            justifyContent: "flex-start" as const,
            alignItems: "flex-start" as const,
          },
          textAlign: "left" as const,
        };
      case 2:
        return {
          wrapper: {
            top: 120,
            bottom: "auto" as const,
            justifyContent: "flex-end" as const,
            alignItems: "flex-start" as const,
          },
          textAlign: "right" as const,
        };
      case 3:
        return {
          wrapper: {
            top: "50%" as const,
            left: 0,
            right: 0,
            bottom: "auto" as const,
            transform: "translateY(-50%)",
            justifyContent: "center" as const,
            alignItems: "center" as const,
          },
          textAlign: "center" as const,
          maxWidth: "70%",
        };
      default:
        return {
          wrapper: {
            justifyContent: "flex-end" as const,
            alignItems: "flex-end" as const,
          },
          textAlign: "left" as const,
        };
    }
  })();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#05291f",
        overflow: "hidden",
        position: "relative",
        color: "#ffffff",
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      }}
    >
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        {image ? (
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
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#0d3a2b",
            }}
          />
        )}
      </AbsoluteFill>

      {/* Overlay tint */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(135deg, rgba(5, 56, 38, 0.7), rgba(4, 31, 23, 0.9))",
        }}
      />

      {/* Texture */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.14) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          opacity: 0.25,
          pointerEvents: "none",
        }}
      />

      {/* Text content */}
      {text && (
        <div
          style={{
            position: "absolute",
            left: 80,
            right: 80,
            bottom: 120,
            display: "flex",
            zIndex: 5,
            ...placement.wrapper,
          }}
        >
          <div
            style={{
              transform: `translateY(${textLift}px)`,
              background: "rgba(9, 74, 52, 0.92)",
              borderRadius: 26,
              padding: "38px 44px",
              maxWidth: placement.maxWidth ?? "62%",
              border: "1px solid rgba(255,255,255,0.2)",
              boxShadow: "0 24px 48px rgba(0, 0, 0, 0.45)",
            }}
          >
            <p
              style={{
                fontSize: 40,
                lineHeight: 1.3,
                margin: 0,
                fontWeight: 600,
                textAlign: placement.textAlign,
              }}
            >
              {text}
            </p>
          </div>
        </div>
      )}

      {/* Slide indicator */}
      <AbsoluteFill
        style={{
          justifyContent: "flex-start",
          alignItems: "center",
          paddingTop: 60,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 10,
            zIndex: 6,
          }}
        >
          {Array.from({ length: totalSlides }).map((_, index) => (
            <div
              key={`indicator-${index}`}
              style={{
                width: 68,
                height: 6,
                backgroundColor:
                  index === slideIndex
                    ? accentColor
                    : "rgba(255, 255, 255, 0.3)",
                borderRadius: 12,
                boxShadow:
                  index === slideIndex
                    ? "0 0 18px rgba(25, 196, 138, 0.6)"
                    : undefined,
              }}
            />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

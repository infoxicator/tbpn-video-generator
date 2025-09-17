import {
  AbsoluteFill,
  Img,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type TitleSlideProps = {
  title: string;
  image?: string;
};

const fallbackGradient = "linear-gradient(180deg, #0b5a3d 0%, #043226 100%)";

export const TitleSlide: React.FC<TitleSlideProps> = ({ title, image }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = title.split(" ").map((word) => ` ${word} `);

  return (
    <AbsoluteFill
      style={{
        background: fallbackGradient,
        position: "relative",
        overflow: "hidden",
        color: "#ffffff",
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
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
            console.warn(`Failed to load main image: ${image}`);
          }}
        />
      ) : null}

      <AbsoluteFill
        style={{
          background: "linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.7))",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "72px 0 0 0",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
            padding: "32px 80px",
            borderRadius: 0,
            background: "linear-gradient(90deg, rgba(0,0,0,0.65), rgba(0,0,0,0.2))",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            boxShadow: "0 18px 38px rgba(0,0,0,0.45)",
            width: "100%",
          }}
        >
          <span
            style={{
              letterSpacing: 6,
              textTransform: "uppercase",
              fontWeight: 700,
              fontSize: 32,
              backgroundColor: "rgba(25, 196, 138, 0.18)",
              color: "#ffffff",
              padding: "12px 36px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.35)",
              boxShadow: "0 10px 24px rgba(0,0,0,0.35)",
            }}
          >
            Breaking News
          </span>

          <h1
            style={{
              margin: 0,
              fontSize: 120,
              lineHeight: 1,
              fontWeight: 900,
              textTransform: "uppercase",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 12,
              textAlign: "center",
              width: "100%",
            }}
          >
            {words.map((word, index) => {
              const scale = spring({
                frame: frame - index * 5,
                fps,
                config: {
                  damping: 120,
                  stiffness: 200,
                  mass: 0.4,
                },
              });

              return (
                <span
                  key={`word-${index}`}
                  style={{
                    display: "inline-block",
                    transform: `scale(${scale})`,
                    textShadow:
                      "0 14px 28px rgba(0,0,0,0.55), 0 0 18px rgba(0,0,0,0.4)",
                  }}
                >
                  {word}
                </span>
              );
            })}
          </h1>
        </div>
      </div>
    </AbsoluteFill>
  );
};

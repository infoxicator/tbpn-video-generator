import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

interface TitleSlideProps {
  title: string;
}

export const TitleSlide: React.FC<TitleSlideProps> = ({ title }) => {
  const frame = useCurrentFrame();
  const videoConfig = useVideoConfig();
  
  // Split title into words for animation (matching original implementation)
  const text = title.split(' ').map((t) => ` ${t} `);

  return (
    <AbsoluteFill
      style={{
        height: '100%',
        width: '100%',
        backgroundColor: '#5716A2',
        padding: 50,
        color: '#FFD166',
      }}
    >
      <p style={{
        fontSize: 80,
        color: '#ffffff',
        fontFamily: 'SF Pro Text, Helvetica, Arial',
        margin: 0,
        marginBottom: 20,
      }}>
        NEWS FLASH
      </p>
      
      <h1
        style={{
          fontFamily: 'SF Pro Text, Helvetica, Arial',
          fontWeight: 'bold',
          fontSize: 140,
          textAlign: 'left',
          width: '100%',
          margin: 0,
        }}
      >
        {text.map((t, i) => {
          return (
            <span
              key={i}
              style={{
                marginLeft: 10,
                marginRight: 10,
                transform: `scale(${spring({
                  fps: videoConfig.fps,
                  frame: frame - i * 5,
                  config: {
                    damping: 100,
                    stiffness: 200,
                    mass: 0.5,
                  },
                })})`,
                display: 'inline-block',
              }}
            >
              {t}
            </span>
          );
        })}
      </h1>
    </AbsoluteFill>
  );
};
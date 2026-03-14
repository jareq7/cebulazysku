import { AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring, useVideoConfig, Img } from "remotion";

export interface OfferVideoProps {
  bankName: string;
  offerName: string;
  reward: number;
  conditions: { label: string }[];
  pros: string[];
  bankLogo: string;
}

// 9:16 vertical (1080x1920) — TikTok/Reels/Shorts format
// 15s at 30fps = 450 frames

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const OfferVideo: React.FC<any> = ({
  bankName,
  offerName,
  reward,
  conditions,
  pros,
  bankLogo,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0f172a", fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* Scene 1: Hook — reward amount (0-120 frames, 0-4s) */}
      <Sequence from={0} durationInFrames={120}>
        <HookScene reward={reward} bankName={bankName} bankLogo={bankLogo} />
      </Sequence>

      {/* Scene 2: Offer name + what to do (120-300 frames, 4-10s) */}
      <Sequence from={120} durationInFrames={180}>
        <ConditionsScene offerName={offerName} conditions={conditions} />
      </Sequence>

      {/* Scene 3: Pros + CTA (300-450 frames, 10-15s) */}
      <Sequence from={300} durationInFrames={150}>
        <CtaScene pros={pros} reward={reward} />
      </Sequence>
    </AbsoluteFill>
  );
};

const HookScene: React.FC<{ reward: number; bankName: string; bankLogo: string }> = ({
  reward,
  bankName,
  bankLogo,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scaleReward = spring({ frame, fps, config: { damping: 12, stiffness: 100 } });
  const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
        opacity: fadeIn,
      }}
    >
      {bankLogo && (
        <Img
          src={bankLogo}
          style={{
            width: 120,
            height: 120,
            borderRadius: 24,
            objectFit: "contain",
            backgroundColor: "white",
            padding: 12,
            marginBottom: 40,
          }}
        />
      )}
      <div
        style={{
          fontSize: 48,
          color: "#94a3b8",
          textAlign: "center",
          marginBottom: 20,
        }}
      >
        {bankName}
      </div>
      <div
        style={{
          fontSize: 160,
          fontWeight: 900,
          color: "#10b981",
          transform: `scale(${scaleReward})`,
          textAlign: "center",
          lineHeight: 1,
        }}
      >
        {reward} zł
      </div>
      <div
        style={{
          fontSize: 42,
          color: "#e2e8f0",
          marginTop: 24,
          textAlign: "center",
        }}
      >
        premii za założenie konta
      </div>
    </AbsoluteFill>
  );
};

const ConditionsScene: React.FC<{
  offerName: string;
  conditions: { label: string }[];
}> = ({ offerName, conditions }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        padding: 60,
      }}
    >
      <div
        style={{
          fontSize: 36,
          color: "#10b981",
          fontWeight: 700,
          marginBottom: 40,
          textTransform: "uppercase",
          letterSpacing: 2,
        }}
      >
        Co trzeba zrobić?
      </div>
      <div style={{ fontSize: 28, color: "#94a3b8", marginBottom: 30 }}>
        {offerName}
      </div>
      {conditions.slice(0, 4).map((c, i) => {
        const delay = i * 12;
        const slideIn = spring({ frame: frame - delay, fps, config: { damping: 15 } });
        const opacity = interpolate(frame - delay, [0, 10], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              marginBottom: 24,
              opacity,
              transform: `translateX(${interpolate(slideIn, [0, 1], [-100, 0])}px)`,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                backgroundColor: "#10b981",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                color: "white",
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {i + 1}
            </div>
            <div style={{ fontSize: 32, color: "#e2e8f0", lineHeight: 1.3 }}>
              {c.label}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const CtaScene: React.FC<{ pros: string[]; reward: number }> = ({ pros, reward }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pulse = interpolate(Math.sin(frame * 0.15), [-1, 1], [1, 1.05]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
      }}
    >
      {pros.slice(0, 3).map((pro, i) => {
        const delay = i * 15;
        const fadeIn = interpolate(frame - delay, [0, 15], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 20,
              opacity: fadeIn,
            }}
          >
            <span style={{ fontSize: 32, color: "#10b981" }}>✓</span>
            <span style={{ fontSize: 30, color: "#e2e8f0" }}>{pro}</span>
          </div>
        );
      })}
      <div
        style={{
          marginTop: 60,
          padding: "28px 56px",
          backgroundColor: "#10b981",
          borderRadius: 20,
          transform: `scale(${pulse})`,
        }}
      >
        <div style={{ fontSize: 40, fontWeight: 800, color: "white", textAlign: "center" }}>
          Odbierz {reward} zł
        </div>
      </div>
      <div
        style={{
          fontSize: 28,
          color: "#64748b",
          marginTop: 32,
          textAlign: "center",
        }}
      >
        cebulazysku.pl
      </div>
    </AbsoluteFill>
  );
};

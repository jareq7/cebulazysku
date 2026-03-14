import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Img,
  Audio,
  staticFile,
} from "remotion";

export interface OfferVideoProps {
  bankName: string;
  offerName: string;
  reward: number;
  conditions: { label: string }[];
  pros: string[];
  bankLogo: string;
  voiceoverUrl?: string;
  musicStartFrom?: number;
}

// 9:16 vertical (1080×1920)
// 70s at 30fps = 2100 frames
// Synced to 69s voiceover — every scene timed to narration

const TOTAL = 2100;
const FPS = 30;

// Seconds to frames helper
const s = (sec: number) => Math.round(sec * FPS);

function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/** Bank logo — local staticFile or letter fallback */
const BankLogo: React.FC<{
  bankLogo: string; bankName: string; size: number; borderRadius: number; padding?: number;
}> = ({ bankLogo, bankName, size, borderRadius, padding = 24 }) => {
  if (!bankLogo) {
    return (
      <div style={{
        width: size, height: size, borderRadius,
        backgroundColor: "#10b981",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.5, fontWeight: 800, color: "white",
      }}>
        {bankName.charAt(0)}
      </div>
    );
  }
  const src = bankLogo.startsWith("http") ? bankLogo : staticFile(bankLogo);
  return (
    <Img src={src} style={{
      width: size, height: size, borderRadius,
      objectFit: "contain", backgroundColor: "white", padding,
    }} />
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const OfferVideo: React.FC<any> = ({
  bankName, offerName, reward, conditions, pros, bankLogo,
  voiceoverUrl, musicStartFrom,
}) => {
  const musicOffset = musicStartFrom ?? Math.floor((hashString(bankName) % 60) * FPS);

  return (
    <AbsoluteFill style={{ backgroundColor: "#0f172a", fontFamily: "Inter, system-ui, sans-serif" }}>
      <AbsoluteFill style={{
        background: "radial-gradient(ellipse at 50% 30%, rgba(16,185,129,0.12) 0%, transparent 70%)",
      }} />

      {/* Background music */}
      <Audio
        src={staticFile("audio/jingle.mp3")}
        startFrom={musicOffset}
        volume={(f) => {
          const fadeIn = interpolate(f, [0, 30], [0, 1], { extrapolateRight: "clamp" });
          const fadeOut = interpolate(f, [TOTAL - 30, TOTAL], [1, 0], { extrapolateLeft: "clamp" });
          return (voiceoverUrl ? 0.08 : 0.25) * fadeIn * fadeOut;
        }}
      />

      {/* Voiceover — synced from frame 0 */}
      {voiceoverUrl && (
        <Audio
          src={voiceoverUrl.startsWith("/") ? staticFile(voiceoverUrl.slice(1)) : voiceoverUrl}
          volume={0.9}
        />
      )}

      {/*
        VOICEOVER SYNC MAP (ffmpeg silencedetect -28dB d=0.5):
        0.0–1.8:   "Siedemset dwadzieścia złotych."
        2.5–5.5:   "Tyle możesz dostać za założenie konta w mBanku."
        6.3–9.9:   "Żeby dostać premię, musisz spełnić kilka prostych warunków."
        10.6–15.3: "Po pierwsze: otwórz konto online. To dosłownie kilka minut."
        17.1–20.2: "Po drugie: wykonaj cztery transakcje kartą."
        20.7–22.3: "I po trzecie: ustaw przelew cykliczny."
        22.9–23.4: "To wszystko."
        25.2–26.7: "Ale... wiesz jak to jest."
        26.7–29.3: "Promocja trwa miesiąc. Masz swoje sprawy."
        30.0–33.6: "I nagle okazuje się, że zapomniałeś o jednym warunku."
        34.3–38.2: "Premia przepada. A mogłeś mieć 720 złotych."
        39.1–~42:  "Właśnie dlatego powstała Cebula Zysku."
        42–51.3:   "Rejestrujesz się... tracker... widzisz co zrobiłeś."
        52.0–55.4: "Bez podawania danych bankowych. Bez logowania do banku."
        56.0–61.2: "Po prostu zaznaczasz co zrobiłeś — a my pilnujemy."
        61.7–63.6: "Krok po kroku. Bez stresu. Za darmo."
        65.3–68.9: "Wejdź na cebulazysku pe el i zacznij obierać premie."
      */}

      {/* 1. Intro — kwota (0–6.3s) */}
      <Sequence from={s(0)} durationInFrames={s(6.3)}>
        <IntroScene reward={reward} />
      </Sequence>

      {/* 2. Bank + "musisz spełnić warunki" (6.3–10.6s) */}
      <Sequence from={s(6.3)} durationInFrames={s(4.3)}>
        <BankScene bankName={bankName} bankLogo={bankLogo} offerName={offerName} />
      </Sequence>

      {/* 3. Warunki po kolei (10.6–25.2s) */}
      <Sequence from={s(10.6)} durationInFrames={s(14.6)}>
        <ConditionsScene conditions={conditions} />
      </Sequence>

      {/* 4. Problem — zapominasz (25.2–39.1s) */}
      <Sequence from={s(25.2)} durationInFrames={s(13.9)}>
        <ProblemScene reward={reward} />
      </Sequence>

      {/* 5. Rozwiązanie — Cebula Zysku + tracker (39.1–64.1s) */}
      <Sequence from={s(39.1)} durationInFrames={s(25.0)}>
        <TrackerScene conditions={conditions} bankName={bankName} reward={reward} bankLogo={bankLogo} />
      </Sequence>

      {/* 6. CTA (64.1–69s) */}
      <Sequence from={s(64.1)} durationInFrames={s(4.9)}>
        <CtaScene reward={reward} />
      </Sequence>

      {/* Watermark */}
      <Watermark />
    </AbsoluteFill>
  );
};

// ─── Watermark ───────────────────────────────────────────────────
const Watermark: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 90], [0, 0.35], { extrapolateRight: "clamp" });
  return (
    <div style={{
      position: "absolute", top: 40, right: 40,
      display: "flex", alignItems: "center", gap: 12, opacity,
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: 14,
        backgroundColor: "rgba(255,255,255,0.9)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 5,
      }}>
        <Img src={staticFile("logo-icon.png")} style={{ width: 42, height: 42 }} />
      </div>
    </div>
  );
};

// ─── 1. Intro: "720 zł. Tyle możesz dostać..." (7.8s) ──────────
const IntroScene: React.FC<{ reward: number }> = ({ reward }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 20, stiffness: 60 } });
  const rewardFade = interpolate(frame, [s(0.5), s(1.5)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const progress = spring({ frame: Math.max(0, frame - s(0.5)), fps, config: { damping: 20, stiffness: 40 } });
  const displayReward = Math.round(interpolate(progress, [0, 1], [0, reward]));
  const subtitleFade = interpolate(frame, [s(2.5), s(3.5)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 80 }}>
      <div style={{
        width: 220, height: 220, borderRadius: 110,
        backgroundColor: "rgba(255,255,255,0.95)",
        display: "flex", alignItems: "center", justifyContent: "center",
        transform: `scale(${logoScale})`,
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)", marginBottom: 50,
      }}>
        <Img src={staticFile("logo-icon.png")} style={{ width: 160, height: 160 }} />
      </div>

      <div style={{
        fontSize: 200, fontWeight: 900, color: "#10b981",
        textAlign: "center", lineHeight: 1, opacity: rewardFade,
        textShadow: "0 0 100px rgba(16,185,129,0.4)",
      }}>
        {displayReward}
        <span style={{ fontSize: 100 }}> zł</span>
      </div>

      <div style={{
        fontSize: 52, color: "#94a3b8", marginTop: 24,
        textAlign: "center", opacity: subtitleFade, fontWeight: 600,
      }}>
        tyle możesz dostać za konto
      </div>
    </AbsoluteFill>
  );
};

// ─── 2. Bank: "musisz spełnić warunki" (2.8s) ──────────────────
const BankScene: React.FC<{
  bankName: string; bankLogo: string; offerName: string;
}> = ({ bankName, bankLogo, offerName }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const textFade = interpolate(frame, [s(0.3), s(0.8)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 80 }}>
      <div style={{ transform: `scale(${scale})`, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <BankLogo bankLogo={bankLogo} bankName={bankName} size={260} borderRadius={48} />
      </div>
      <div style={{ opacity: textFade, textAlign: "center", marginTop: 40 }}>
        <div style={{ fontSize: 76, fontWeight: 800, color: "#e2e8f0" }}>{bankName}</div>
        <div style={{ fontSize: 40, color: "#94a3b8", marginTop: 12, lineHeight: 1.3, padding: "0 40px" }}>{offerName}</div>
      </div>
    </AbsoluteFill>
  );
};

// ─── 3. Conditions: "Po pierwsze... To wszystko." (16.1s) ───────
const ConditionsScene: React.FC<{ conditions: { label: string }[] }> = ({ conditions }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const items = conditions.slice(0, 4);
  // Voiceover timing within this scene (scene starts at 10.6s global):
  // 0s: "Po pierwsze: otwórz konto online." (10.6s global)
  // 6.5s: "Po drugie: wykonaj transakcje." (17.1s global)
  // 10.1s: "Po trzecie: ustaw przelew." (20.7s global)
  // 12.3s: "To wszystko." (22.9s global)
  const conditionStarts = [s(0), s(6.5), s(10.1), s(12.3)];

  return (
    <AbsoluteFill style={{ justifyContent: "center", padding: "0 80px" }}>
      <div style={{
        fontSize: 52, color: "#94a3b8", fontWeight: 600, marginBottom: 50,
        opacity: interpolate(frame, [0, s(0.5)], [0, 1], { extrapolateRight: "clamp" }),
      }}>
        Co trzeba zrobić?
      </div>

      {items.map((c, i) => {
        const start = conditionStarts[i] ?? s(i * 3);
        const slideIn = spring({ frame: Math.max(0, frame - start), fps, config: { damping: 16, stiffness: 80 } });
        const checkStart = start + s(2);
        const checkProgress = spring({ frame: Math.max(0, frame - checkStart), fps, config: { damping: 12, stiffness: 120 } });
        const isChecked = checkProgress > 0.5;

        return (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 30, marginBottom: 40,
            opacity: interpolate(slideIn, [0, 0.2], [0, 1]),
            transform: `translateX(${interpolate(slideIn, [0, 1], [-80, 0])}px)`,
          }}>
            <div style={{
              width: 80, height: 80, borderRadius: 40,
              backgroundColor: isChecked ? "#10b981" : "#1e293b",
              border: "3px solid #10b981",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <span style={{ fontSize: 38, color: "white", fontWeight: 700 }}>
                {isChecked ? "✓" : String(i + 1)}
              </span>
            </div>
            <div style={{ fontSize: 46, color: "#e2e8f0", lineHeight: 1.3, fontWeight: 500 }}>
              {c.label}
            </div>
          </div>
        );
      })}

      {/* "To wszystko." synced at ~12.3s */}
      <div style={{
        fontSize: 56, color: "#10b981", fontWeight: 700, marginTop: 30, textAlign: "center",
        opacity: interpolate(frame, [s(12.3), s(13.5)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}>
        To wszystko.
      </div>
    </AbsoluteFill>
  );
};

// ─── 4. Problem: "Ale wiesz... premia przepada." (15.7s) ───────
const ProblemScene: React.FC<{ reward: number }> = ({ reward }) => {
  const frame = useCurrentFrame();

  // Timing within this scene (starts at 25.2s global):
  // 0s: "Ale... wiesz jak to jest." (25.2s)
  // 1.5s: "Promocja trwa miesiąc. Masz swoje sprawy." (26.7s)
  // 4.8s: "I nagle okazuje się, że zapomniałeś..." (30.0s)
  // 9.1s: "Premia przepada." (34.3s)
  // 10.6s: "A mogłeś mieć 720 zł." (35.8s)

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 80px" }}>
      <div style={{
        fontSize: 56, color: "#94a3b8", textAlign: "center", lineHeight: 1.5,
        opacity: interpolate(frame, [0, s(0.8)], [0, 1], { extrapolateRight: "clamp" }),
        marginBottom: 40,
      }}>
        Ale... wiesz jak to jest.
      </div>

      <div style={{
        fontSize: 48, color: "#cbd5e1", textAlign: "center", lineHeight: 1.6,
        opacity: interpolate(frame, [s(1.5), s(2.3)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        marginBottom: 40,
      }}>
        Promocja trwa miesiąc.{"\n"}Masz swoje sprawy.
      </div>

      <div style={{
        fontSize: 48, color: "#cbd5e1", textAlign: "center", lineHeight: 1.5,
        opacity: interpolate(frame, [s(4.8), s(5.6)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        marginBottom: 50,
      }}>
        Zapomniałeś o jednym warunku.
      </div>

      <div style={{
        fontSize: 72, color: "#f87171", fontWeight: 800, textAlign: "center",
        opacity: interpolate(frame, [s(9.1), s(10)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}>
        Premia przepada.
      </div>

      <div style={{
        fontSize: 44, color: "#64748b", textAlign: "center", marginTop: 16,
        opacity: interpolate(frame, [s(10.6), s(11.4)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}>
        A mogłeś mieć {reward} zł.
      </div>
    </AbsoluteFill>
  );
};

// ─── 5. Solution: Cebula Zysku + tracker + objection handling (21.7s) ──
const TrackerScene: React.FC<{
  conditions: { label: string }[]; bankName: string; reward: number; bankLogo: string;
}> = ({ conditions, bankName, reward, bankLogo }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timing within this scene (starts at 39.1s global):
  // 0–2.9s: "Właśnie dlatego powstała Cebula Zysku." (39.1s)
  // 2.9–12.2s: "Rejestrujesz się... tracker..." (42.0s)
  // 12.9–16.3s: "Bez podawania danych bankowych..." (52.0s)
  // 16.9–22.1s: "Po prostu zaznaczasz co zrobiłeś..." (56.0s)
  // 22.6–24.5s: "Krok po kroku. Bez stresu. Za darmo." (61.7s)

  const phase1End = s(4.5);     // Logo reveal ends
  const phase2Start = s(3.5);   // Tracker card starts sliding in
  const objectionStart = s(12.9); // "Bez podawania danych..."

  const solutionFade = interpolate(frame, [0, s(0.8)], [0, 1], { extrapolateRight: "clamp" });
  const solutionOut = interpolate(frame, [s(3.5), phase1End], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const cardSlide = spring({ frame: Math.max(0, frame - phase2Start), fps, config: { damping: 18, stiffness: 60 } });
  const progressValue = interpolate(frame, [s(5), s(12)], [0, 66], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const headerFade = interpolate(frame, [phase2Start, s(4.5)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Objection busters
  const obj1Fade = interpolate(frame, [objectionStart, s(13.9)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const obj2Fade = interpolate(frame, [s(16.9), s(17.9)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const closerFade = interpolate(frame, [s(22.6), s(23.4)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const conditionItems = conditions.slice(0, 3);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 50px" }}>
      {/* Phase 1: "Właśnie dlatego powstała Cebula Zysku" */}
      {frame < s(4.5) && (
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
          opacity: Math.min(solutionFade, solutionOut),
        }}>
          <div style={{
            width: 200, height: 200, borderRadius: 100,
            backgroundColor: "rgba(255,255,255,0.95)",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: 40, boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          }}>
            <Img src={staticFile("logo-icon.png")} style={{ width: 150, height: 150 }} />
          </div>
          <div style={{ fontSize: 52, color: "#94a3b8", textAlign: "center", fontWeight: 600, marginBottom: 12 }}>
            Właśnie dlatego powstała
          </div>
          <div style={{ fontSize: 76, color: "#10b981", fontWeight: 900, textAlign: "center" }}>
            Cebula Zysku
          </div>
        </div>
      )}

      {/* Phase 2: Tracker + objections */}
      {frame >= phase2Start && (
        <>
          <div style={{
            fontSize: 40, color: "#94a3b8", fontWeight: 600,
            textAlign: "center", marginBottom: 20, opacity: headerFade,
          }}>
            Twój osobisty tracker promocji
          </div>

          {/* Tracker card */}
          <div style={{
            transform: `translateY(${interpolate(cardSlide, [0, 1], [80, 0])}px) scale(0.88)`,
            opacity: interpolate(cardSlide, [0, 0.3], [0, 1]),
            width: 960, backgroundColor: "#ffffff", borderRadius: 28,
            border: "2px solid #e2e8f0", boxShadow: "0 30px 80px rgba(0,0,0,0.25)",
            overflow: "hidden",
          }}>
            <div style={{
              padding: "28px 36px 0 36px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <BankLogo bankLogo={bankLogo} bankName={bankName} size={56} borderRadius={14} padding={6} />
                <div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: "#0f172a" }}>{bankName}</div>
                  <div style={{ fontSize: 18, color: "#64748b" }}>Konto osobiste</div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 42, fontWeight: 800, color: "#059669" }}>{reward} zł</div>
                <div style={{ fontSize: 18, color: "#64748b" }}>{Math.round(progressValue)}%</div>
              </div>
            </div>

            <div style={{ padding: "14px 36px 0 36px" }}>
              <div style={{
                width: "100%", height: 12, backgroundColor: "#e2e8f0", borderRadius: 6, overflow: "hidden",
              }}>
                <div style={{ width: `${progressValue}%`, height: "100%", backgroundColor: "#10b981", borderRadius: 6 }} />
              </div>
            </div>

            <div style={{ margin: "16px 36px 0 36px", height: 1, backgroundColor: "#f1f5f9" }} />

            <div style={{ padding: "12px 36px 24px 36px" }}>
              {conditionItems.map((c, i) => {
                const itemDelay = s(5) + i * s(1.5);
                const itemFade = interpolate(frame, [itemDelay, itemDelay + s(0.5)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                const isDone = i < 2;
                const count = isDone ? 5 : Math.round(interpolate(frame, [s(8), s(12)], [1, 3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

                return (
                  <div key={i} style={{
                    opacity: itemFade, marginBottom: i < conditionItems.length - 1 ? 10 : 0,
                    padding: "12px 18px", borderRadius: 12,
                    border: `2px solid ${isDone ? "#a7f3d0" : "#e2e8f0"}`,
                    backgroundColor: isDone ? "#ecfdf5" : "#fff",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: 7,
                          backgroundColor: isDone ? "#10b981" : "#f1f5f9",
                          border: isDone ? "none" : "2px solid #cbd5e1",
                          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                        }}>
                          {isDone && <span style={{ fontSize: 18, color: "white", fontWeight: 700 }}>✓</span>}
                        </div>
                        <div style={{ fontSize: 22, fontWeight: 600, color: isDone ? "#047857" : "#0f172a" }}>{c.label}</div>
                      </div>
                      <div style={{ fontSize: 24, fontWeight: 700, color: isDone ? "#059669" : "#0f172a" }}>
                        {count}/5
                      </div>
                    </div>
                    <div style={{ marginTop: 8, width: "100%", height: 6, backgroundColor: "#e2e8f0", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ width: `${Math.min(100, (count / 5) * 100)}%`, height: "100%", backgroundColor: isDone ? "#10b981" : "#3b82f6", borderRadius: 3 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Objection busters — below tracker card */}
          <div style={{ marginTop: 28, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 16, opacity: obj1Fade,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 22, backgroundColor: "#10b981",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <span style={{ fontSize: 26, color: "white" }}>✓</span>
              </div>
              <span style={{ fontSize: 36, color: "#e2e8f0", fontWeight: 500 }}>
                Bez danych bankowych
              </span>
            </div>

            <div style={{
              display: "flex", alignItems: "center", gap: 16, opacity: obj2Fade,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 22, backgroundColor: "#10b981",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <span style={{ fontSize: 26, color: "white" }}>✓</span>
              </div>
              <span style={{ fontSize: 36, color: "#e2e8f0", fontWeight: 500 }}>
                Ty zaznaczasz — my pilnujemy
              </span>
            </div>
          </div>

          {/* "Krok po kroku. Bez stresu. Za darmo." */}
          <div style={{
            fontSize: 48, color: "#10b981", fontWeight: 700,
            textAlign: "center", marginTop: 30, opacity: closerFade,
          }}>
            Krok po kroku. Bez stresu. Za darmo.
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};

// ─── 6. CTA: "Wejdź na cebulazysku.pl" (5.9s) ──────────────────
const CtaScene: React.FC<{ reward: number }> = ({ reward }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, s(0.5)], [0, 1], { extrapolateRight: "clamp" });
  const buttonScale = spring({ frame: Math.max(0, frame - s(0.8)), fps, config: { damping: 14, stiffness: 80 } });
  const pulse = interpolate(Math.sin(frame * 0.12), [-1, 1], [0.97, 1.03]);
  const glow = interpolate(Math.sin(frame * 0.08), [-1, 1], [0.2, 0.7]);
  const logoFade = interpolate(frame, [s(1.5), s(2.5)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 70px", opacity: fadeIn }}>
      {/* Big CTA */}
      <div style={{
        padding: "40px 80px", backgroundColor: "#10b981", borderRadius: 28,
        transform: `scale(${buttonScale * pulse})`,
        boxShadow: `0 0 ${80 * glow}px rgba(16,185,129,${glow})`,
        marginBottom: 40,
      }}>
        <div style={{ fontSize: 64, fontWeight: 900, color: "white", textAlign: "center" }}>
          Obierz {reward} zł
        </div>
      </div>

      {/* Logo + site */}
      <div style={{
        display: "flex", alignItems: "center", gap: 18, opacity: logoFade,
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: 22,
          backgroundColor: "rgba(255,255,255,0.95)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 8,
        }}>
          <Img src={staticFile("logo-icon.png")} style={{ width: 60, height: 60 }} />
        </div>
        <div style={{ fontSize: 56, color: "#10b981", fontWeight: 800 }}>
          cebulazysku.pl
        </div>
      </div>

      <div style={{
        fontSize: 36, color: "#64748b", marginTop: 24, textAlign: "center",
        opacity: logoFade,
      }}>
        Rejestracja za darmo
      </div>
    </AbsoluteFill>
  );
};

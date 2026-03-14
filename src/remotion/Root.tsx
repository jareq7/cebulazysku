import { Composition } from "remotion";
import { OfferVideo, OfferVideoProps } from "./OfferVideo";

const defaultProps: OfferVideoProps = {
  bankName: "mBank",
  offerName: "eKonto z zyskiem do 720 zł",
  reward: 720,
  conditions: [
    { label: "Otwórz konto online" },
    { label: "Wykonaj 4 transakcje kartą" },
    { label: "Ustaw przelew cykliczny" },
  ],
  pros: [
    "Konto bez opłat",
    "Darmowa karta wielowalutowa",
    "Premia w 30 dni od spełnienia warunków",
  ],
  bankLogo: "bank-mbank.png",
  voiceoverUrl: "/audio/voiceovers/test-mbank.mp3",
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="OfferVideo"
        component={OfferVideo}
        durationInFrames={2100}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={defaultProps}
      />
    </>
  );
};

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
  bankLogo: "https://leadstar.pl/img/programs/mbank.png",
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="OfferVideo"
        component={OfferVideo}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={defaultProps}
      />
    </>
  );
};

"use client";

import { Player } from "@remotion/player";
import { OfferVideo, OfferVideoProps } from "@/remotion/OfferVideo";

export function OfferVideoPlayer({ offer }: { offer: OfferVideoProps }) {
  return (
    <div className="rounded-2xl overflow-hidden border shadow-sm">
      <Player
        component={OfferVideo}
        inputProps={offer}
        durationInFrames={450}
        fps={30}
        compositionWidth={1080}
        compositionHeight={1920}
        style={{ width: "100%", aspectRatio: "9/16" }}
        controls
        autoPlay
        loop
      />
    </div>
  );
}

import { useState, useCallback, useEffect } from "react";
import {
  getHintOverlays,
  subscribeHintOverlay,
  getHintOverlayIds,
} from "./hintOverlays";
import { HintOverlayBox } from "./HintOverlayBox";

export const useHintOverlays = (canvasZoneId: string) => {
  const [hintNodes, setHintNodes] = useState<React.ReactNode[]>([]);

  const setNodesCb = useCallback(() => {
    console.log("setNodesCb function ran");
    const hintOverlays = getHintOverlays();
    const hintHoverlayIds = Array.from(getHintOverlayIds(canvasZoneId));
    const hintNodes = hintHoverlayIds.map((hoverlayId) => {
      const hintOverlay = hintOverlays[hoverlayId];
      return (
        <HintOverlayBox
          {...hintOverlay}
          // Since overlays are already inside the iframe, we don't need to scale
          // overlays again.
          scale={1}
          key={hintOverlay.overlayId}
        />
      );
    });
    setHintNodes(hintNodes);
  }, [canvasZoneId]);

  useEffect(() => {
    console.log("setNodesCb when an overlay ds changes");
    // set nodes whenever a overlay data structure is changed
    subscribeHintOverlay(canvasZoneId, () => {
      setNodesCb();
    });
  }, [setNodesCb, canvasZoneId]);

  useEffect(() => {
    console.log("setNodesCb when screen dimension changes");
    // set nodes whenever dimension of screen changes
    setNodesCb();
  }, [setNodesCb]);
  return hintNodes;
};

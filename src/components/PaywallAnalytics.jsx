import { useEffect } from "react";
import { trackProductEvent } from "../lib/productAnalytics";

// À monter uniquement dans un écran qui affiche effectivement un blocage.
export default function PaywallAnalytics({ chapterId, levelId, offerContext }) {
  useEffect(() => {
    trackProductEvent("paywall_viewed", { chapterId, levelId, offerContext });
  }, [chapterId, levelId, offerContext]);
  return null;
}

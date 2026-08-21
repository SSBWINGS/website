import { getPublished } from "@/lib/content";
import Preloader from "./Preloader";

/** Reads the CMS `preloader` doc to decide whether the aeroplane Lottie plays.
 *  When off, only the centred SSBWINGS word animation is shown. */
export default async function PreloaderSection() {
  const doc = await getPublished<{ lottie: string }>("preloader", { lottie: "on" });
  return <Preloader lottie={doc.lottie !== "off"} />;
}

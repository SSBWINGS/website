import type { MetadataRoute } from "next";

/** Web app manifest. Browsers use it for "add to home screen", and Google
 *  reads its icons alongside the favicon. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SSBWINGS — SSB Interview Coaching",
    short_name: "SSBWINGS",
    description: "SSB interview coaching in Noida, mentored by ex-SSB assessors.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf6ec",
    theme_color: "#0a1524",
    icons: [
      { src: "/icon.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512-round.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}

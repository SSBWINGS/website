/** Hero showcase slides — plain data, importable from BOTH server and client.
 *  (Values exported from a "use client" module become client references on the
 *  server, so this must live outside the component file.) */
export type HeroSlide = {
  image: string;
  /** Commissioned officer's name (optional). */
  name?: string;
  /** Academy they passed out from — shown on the right. */
  academy?: string;
  /** Course/term they passed out in — shown on the left. */
  term?: string;
};

export const HERO_SLIDES: HeroSlide[] = [
  { image: "/images/pipping-ceremony.jpg", academy: "IMA Dehradun", term: "Spring Term 2025" },
  { image: "/images/hero-parade.jpg", academy: "OTA Chennai", term: "Autumn Term 2025" },
  { image: "/images/ima-guard.jpg", academy: "INA Ezhimala", term: "Spring Term 2025" },
  { image: "/images/ota-sunrise.jpg", academy: "AFA Dundigal", term: "Combined Graduation 2025" },
];

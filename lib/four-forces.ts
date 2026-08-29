export type ForceCard = {
  name: string;
  motto: string;
  desc: string;
  image: string;
  alt: string;
  scrim: string;
  accent: string;
  icon: string;
  entries: string[];
  blog: string;
};

export type FourForcesDoc = {
  kicker: string;
  title: string;
  subtitle: string;
  cards: ForceCard[];
};

export const FOUR_FORCES_CARDS: ForceCard[] = [
  {
    name: "Indian Army", motto: "Service Before Self",
    desc: "IMA, OTA & ACC entries through NDA, CDS, TES, TGC & NCC. The olive greens begin on the GTO ground.",
    image: "/images/services/army-op.jpg",
    alt: "Indian Army soldiers conducting check-point operations during a peacekeeping exercise",
    scrim: "rgba(40,48,20,0.82)", accent: "#9ab04a", icon: "⭐",
    entries: ["NDA", "CDS IMA/OTA", "TES", "TGC", "ACC"], blog: "/blog/join-indian-army",
  },
  {
    name: "Indian Navy", motto: "Sham No Varunah",
    desc: "INA Ezhimala & beyond — 10+2 B.Tech, Navy SSC (GS/X, Pilot, Logistics, ATC). Command the deep blue.",
    image: "/images/services/navy-op.jpg",
    alt: "Indian Navy frigate INS Shivalik underway at sea",
    scrim: "rgba(15,38,80,0.82)", accent: "#5aa0e0", icon: "⚓",
    entries: ["10+2 B.Tech", "GS(X)", "Pilot SSC", "Logistics", "ATC"], blog: "/blog/join-indian-navy",
  },
  {
    name: "Indian Air Force", motto: "Touch the Sky with Glory",
    desc: "AFA Hyderabad through AFCAT, NDA & NCC. Flying & Ground Duty (Tech & Non-Tech) — reach for the skies.",
    image: "/images/services/airforce-op.jpg",
    alt: "Indian Air Force Su-30 MKI fighters during Exercise Iron Fist",
    scrim: "rgba(20,55,90,0.80)", accent: "#7cc0ef", icon: "✈",
    entries: ["AFCAT", "NDA (Air)", "Flying", "Ground Duty", "NCC"], blog: "/blog/join-indian-air-force",
  },
  {
    name: "Indian Coast Guard", motto: "Vayam Rakshamah",
    desc: "Assistant Commandant entry — protecting India's coasts & seas. Guard the shoreline, day and night.",
    image: "/images/services/coastguard-op.jpg",
    alt: "Indian Coast Guard ships sailing in formation during an exercise",
    scrim: "rgba(20,45,72,0.80)", accent: "#63b3e8", icon: "🛡️",
    entries: ["Asst. Commandant", "GD Branch", "Tech", "Pilot / Navigator", "Law"], blog: "/blog/join-indian-coast-guard",
  },
];

export const FOUR_FORCES: FourForcesDoc = {
  kicker: "Four Forces · One Dream",
  title: 'Which <span class="tricolour-text">Uniform</span> Calls You?',
  subtitle:
    "Army, Navy, Air Force or Coast Guard — the SSB is common, but the interview, PIQ and career path are not. We prepare you for your exact service and entry.",
  cards: FOUR_FORCES_CARDS,
};

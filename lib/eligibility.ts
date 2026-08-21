/** SSB entry eligibility rules (indicative — official notifications are final).
 *  Pure & dependency-free so it runs on the client for the interactive finder. */

export type Gender = "male" | "female";
export type Marital = "unmarried" | "married";
export type Education = "10+2" | "graduate" | "engineering" | "law" | "postgraduate";

export type EligibilityInput = {
  age: number;
  gender: Gender;
  marital: Marital;
  education: Education;
  pcm: boolean; // Physics/Chemistry/Maths at 10+2 (needed for several tech entries)
};

export type Entry = {
  id: string;
  name: string;
  service: "Army" | "Navy" | "Air Force" | "Coast Guard";
  stage: string;
  minAge: number;
  maxAge: number;
  genders: Gender[];
  education: Education[];
  requiresUnmarried: boolean;
  requiresPcm?: boolean;
  how: string;
};

// engineering graduates also satisfy a plain "graduate" requirement
const gradOk = (e: Education) => e === "graduate" || e === "engineering" || e === "postgraduate" || e === "law";

export const ENTRIES: Entry[] = [
  { id: "nda-army", name: "NDA & NA (Army)", service: "Army", stage: "After 10+2", minAge: 16.5, maxAge: 19.5, genders: ["male", "female"], education: ["10+2"], requiresUnmarried: true, how: "UPSC NDA written → SSB → Medical" },
  { id: "nda-navy", name: "NDA (Naval)", service: "Navy", stage: "After 10+2", minAge: 16.5, maxAge: 19.5, genders: ["male", "female"], education: ["10+2"], requiresUnmarried: true, requiresPcm: true, how: "UPSC NDA written → SSB → Medical" },
  { id: "nda-air", name: "NDA (Air)", service: "Air Force", stage: "After 10+2", minAge: 16.5, maxAge: 19.5, genders: ["male", "female"], education: ["10+2"], requiresUnmarried: true, requiresPcm: true, how: "UPSC NDA written → AFSB → PABT → Medical" },
  { id: "tes", name: "10+2 TES (Technical Entry)", service: "Army", stage: "After 10+2", minAge: 16.5, maxAge: 19.5, genders: ["male"], education: ["10+2"], requiresUnmarried: true, requiresPcm: true, how: "JEE Mains shortlist → SSB → Medical (no written)" },
  { id: "navy-btech", name: "10+2 B.Tech Cadet (Navy)", service: "Navy", stage: "After 10+2", minAge: 16.5, maxAge: 19.5, genders: ["male"], education: ["10+2"], requiresUnmarried: true, requiresPcm: true, how: "JEE Mains shortlist → SSB → Medical" },
  { id: "cds-ima", name: "CDS – IMA", service: "Army", stage: "After Graduation", minAge: 19, maxAge: 24, genders: ["male"], education: ["graduate", "engineering", "postgraduate"], requiresUnmarried: true, how: "UPSC CDS written → SSB → Medical" },
  { id: "cds-ota", name: "CDS – OTA (SSC)", service: "Army", stage: "After Graduation", minAge: 19, maxAge: 25, genders: ["male", "female"], education: ["graduate", "engineering", "postgraduate", "law"], requiresUnmarried: true, how: "UPSC CDS written → SSB → Medical" },
  { id: "cds-navy", name: "CDS – INA (Navy)", service: "Navy", stage: "After Graduation", minAge: 19, maxAge: 24, genders: ["male"], education: ["engineering"], requiresUnmarried: true, how: "UPSC CDS written → SSB → Medical" },
  { id: "tgc", name: "TGC (Technical Graduate)", service: "Army", stage: "After Graduation", minAge: 20, maxAge: 27, genders: ["male"], education: ["engineering"], requiresUnmarried: true, how: "Merit shortlist → SSB → Medical" },
  { id: "ssc-tech", name: "SSC (Tech) – Men & Women", service: "Army", stage: "After Graduation", minAge: 20, maxAge: 27, genders: ["male", "female"], education: ["engineering"], requiresUnmarried: false, how: "Merit shortlist → SSB → Medical" },
  { id: "afcat-flying", name: "AFCAT – Flying Branch", service: "Air Force", stage: "After Graduation", minAge: 20, maxAge: 24, genders: ["male", "female"], education: ["graduate", "engineering", "postgraduate"], requiresUnmarried: true, how: "AFCAT written → AFSB → PABT → Medical" },
  { id: "afcat-tech", name: "AFCAT – Ground Duty (Tech)", service: "Air Force", stage: "After Graduation", minAge: 20, maxAge: 26, genders: ["male", "female"], education: ["engineering"], requiresUnmarried: false, how: "AFCAT written → AFSB → Medical" },
  { id: "afcat-nontech", name: "AFCAT – Ground Duty (Non-Tech)", service: "Air Force", stage: "After Graduation", minAge: 20, maxAge: 26, genders: ["male", "female"], education: ["graduate", "engineering", "postgraduate"], requiresUnmarried: false, how: "AFCAT written → AFSB → Medical" },
  { id: "jag", name: "JAG (Judge Advocate General)", service: "Army", stage: "After Graduation", minAge: 21, maxAge: 27, genders: ["male", "female"], education: ["law"], requiresUnmarried: false, how: "Merit shortlist → SSB → Medical" },
  { id: "ncc-army", name: "NCC Special Entry", service: "Army", stage: "After Graduation", minAge: 19, maxAge: 25, genders: ["male", "female"], education: ["graduate", "engineering", "postgraduate"], requiresUnmarried: true, how: "Needs NCC 'C' certificate → SSB → Medical (no written)" },
  { id: "navy-ssc-exec", name: "SSC Executive – GS(X) & Technical (Navy)", service: "Navy", stage: "After Graduation", minAge: 19, maxAge: 24, genders: ["male", "female"], education: ["graduate", "engineering"], requiresUnmarried: true, how: "Shortlist on eligibility → SSB → Medical" },
  { id: "navy-ssc-pilot", name: "SSC Pilot / Observer (Navy)", service: "Navy", stage: "After Graduation", minAge: 19, maxAge: 24, genders: ["male", "female"], education: ["graduate", "engineering"], requiresUnmarried: true, how: "SSB → PABT (Pilot Aptitude) → Medical" },
  { id: "navy-ssc-logistics", name: "SSC Logistics / ATC / Education / Law (Navy)", service: "Navy", stage: "After Graduation", minAge: 19, maxAge: 25, genders: ["male", "female"], education: ["graduate", "engineering", "law"], requiresUnmarried: true, how: "Shortlist → SSB → Medical" },
  { id: "cds-afa", name: "CDS – AFA (Air Force)", service: "Air Force", stage: "After Graduation", minAge: 19, maxAge: 24, genders: ["male"], education: ["graduate", "engineering"], requiresUnmarried: true, requiresPcm: true, how: "UPSC CDS written → AFSB → PABT → Medical" },
  { id: "af-met", name: "Meteorology Entry (Air Force)", service: "Air Force", stage: "After Graduation", minAge: 20, maxAge: 26, genders: ["male", "female"], education: ["postgraduate"], requiresUnmarried: false, how: "AFCAT written → AFSB → Medical" },
  { id: "cg-gd", name: "Coast Guard AC – General Duty", service: "Coast Guard", stage: "After Graduation", minAge: 21, maxAge: 25, genders: ["male"], education: ["graduate", "engineering"], requiresUnmarried: true, requiresPcm: true, how: "CGCAT → Selection Board → Medical" },
  { id: "cg-pilot", name: "Coast Guard AC – Pilot / Navigator", service: "Coast Guard", stage: "After Graduation", minAge: 19, maxAge: 27, genders: ["male"], education: ["graduate", "engineering"], requiresUnmarried: true, how: "CGCAT → Selection Board → PABT → Medical" },
  { id: "cg-tech", name: "Coast Guard AC – Technical", service: "Coast Guard", stage: "After Graduation", minAge: 21, maxAge: 25, genders: ["male"], education: ["engineering"], requiresUnmarried: true, how: "CGCAT → Selection Board → Medical" },
];

export function findEligible(input: EligibilityInput): Entry[] {
  return ENTRIES.filter((e) => {
    if (input.age < e.minAge || input.age > e.maxAge) return false;
    if (!e.genders.includes(input.gender)) return false;
    if (e.requiresUnmarried && input.marital !== "unmarried") return false;
    if (e.requiresPcm && !input.pcm) return false;
    // education match (engineering/PG satisfy graduate-level entries)
    const eduOk = e.education.includes(input.education) ||
      (e.education.includes("graduate") && gradOk(input.education));
    return eduOk;
  });
}

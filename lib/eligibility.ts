/** SSB entry eligibility rules (indicative — official notifications are final).
 *  Pure & dependency-free so it runs on the client for the interactive finder.
 *
 *  Rules verified against the 2026–27 notification cycle. Two things worth
 *  knowing when reading them:
 *   - `requiresPhysicsMaths` means Physics AND Maths in Class 12 (Chemistry is
 *     additionally required by the JEE-based entries, but the finder does not
 *     split that out — it would only ever produce false exclusions).
 *   - Entries reserved for serving personnel are flagged with `serving`, so a
 *     civilian never sees them and a soldier is not told they're ineligible.
 */

export type Gender = "male" | "female";
export type Marital = "unmarried" | "married";
export type Education = "10+2" | "graduate" | "engineering" | "law" | "postgraduate";

export type EligibilityInput = {
  age: number;
  gender: Gender;
  marital: Marital;
  education: Education;
  /** Physics & Maths in Class 12. */
  pcm: boolean;
  /** Already serving in the Armed Forces (soldier / sailor / airman / JCO / NCO). */
  serving?: boolean;
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
  /** Physics & Maths at 10+2. */
  requiresPcm?: boolean;
  /** Only open to candidates already in uniform. */
  serving?: boolean;
  how: string;
};

// engineering graduates also satisfy a plain "graduate" requirement
const gradOk = (e: Education) => e === "graduate" || e === "engineering" || e === "postgraduate" || e === "law";

export const ENTRIES: Entry[] = [
  // ── After 10+2 ────────────────────────────────────────────────────────────
  { id: "nda-army", name: "NDA & NA (Army)", service: "Army", stage: "After 10+2", minAge: 16.5, maxAge: 19.5, genders: ["male", "female"], education: ["10+2"], requiresUnmarried: true, how: "UPSC NDA written → SSB → Medical" },
  { id: "nda-navy", name: "NDA (Naval)", service: "Navy", stage: "After 10+2", minAge: 16.5, maxAge: 19.5, genders: ["male", "female"], education: ["10+2"], requiresUnmarried: true, requiresPcm: true, how: "UPSC NDA written → SSB → Medical" },
  { id: "nda-air", name: "NDA (Air)", service: "Air Force", stage: "After 10+2", minAge: 16.5, maxAge: 19.5, genders: ["male", "female"], education: ["10+2"], requiresUnmarried: true, requiresPcm: true, how: "UPSC NDA written → AFSB → PABT → Medical" },
  { id: "tes", name: "10+2 TES (Technical Entry)", service: "Army", stage: "After 10+2", minAge: 16.5, maxAge: 19.5, genders: ["male"], education: ["10+2"], requiresUnmarried: true, requiresPcm: true, how: "JEE Mains shortlist → SSB → Medical (no written)" },
  // Open to women as well as men — INA Ezhimala has inducted women B.Tech cadets since 2021.
  { id: "navy-btech", name: "10+2 B.Tech Cadet (Navy)", service: "Navy", stage: "After 10+2", minAge: 16.5, maxAge: 19.5, genders: ["male", "female"], education: ["10+2"], requiresUnmarried: true, requiresPcm: true, how: "JEE Mains (CRL) shortlist → SSB → Medical" },

  // ── After graduation ──────────────────────────────────────────────────────
  { id: "cds-ima", name: "CDS – IMA", service: "Army", stage: "After Graduation", minAge: 19, maxAge: 24, genders: ["male"], education: ["graduate", "engineering", "postgraduate"], requiresUnmarried: true, how: "UPSC CDS written → SSB → Medical" },
  { id: "cds-ota", name: "CDS – OTA (SSC)", service: "Army", stage: "After Graduation", minAge: 19, maxAge: 25, genders: ["male", "female"], education: ["graduate", "engineering", "postgraduate", "law"], requiresUnmarried: true, how: "UPSC CDS written → SSB → Medical" },
  { id: "cds-navy", name: "CDS – INA (Navy)", service: "Navy", stage: "After Graduation", minAge: 19, maxAge: 24, genders: ["male"], education: ["engineering"], requiresUnmarried: true, how: "UPSC CDS written → SSB → Medical" },
  // CDS AFA opens at 20, not 19.
  { id: "cds-afa", name: "CDS – AFA (Air Force)", service: "Air Force", stage: "After Graduation", minAge: 20, maxAge: 24, genders: ["male"], education: ["graduate", "engineering"], requiresUnmarried: true, requiresPcm: true, how: "UPSC CDS written → AFSB → PABT → Medical" },
  { id: "tgc", name: "TGC (Technical Graduate)", service: "Army", stage: "After Graduation", minAge: 20, maxAge: 27, genders: ["male"], education: ["engineering"], requiresUnmarried: true, how: "Merit shortlist → SSB → Medical" },
  // SSC(T)-Men and SSCW(T) both admit only unmarried candidates.
  { id: "ssc-tech", name: "SSC (Tech) – Men & Women", service: "Army", stage: "After Graduation", minAge: 20, maxAge: 27, genders: ["male", "female"], education: ["engineering"], requiresUnmarried: true, how: "Merit shortlist → SSB → Medical" },
  // Flying branch needs Physics & Maths in Class 12.
  { id: "afcat-flying", name: "AFCAT – Flying Branch", service: "Air Force", stage: "After Graduation", minAge: 20, maxAge: 24, genders: ["male", "female"], education: ["graduate", "engineering", "postgraduate"], requiresUnmarried: true, requiresPcm: true, how: "AFCAT written → AFSB → PABT/CPSS → Medical" },
  { id: "afcat-tech", name: "AFCAT – Ground Duty (Tech)", service: "Air Force", stage: "After Graduation", minAge: 20, maxAge: 26, genders: ["male", "female"], education: ["engineering"], requiresUnmarried: false, how: "AFCAT written → AFSB → Medical (marriage permitted only above 25)" },
  { id: "afcat-nontech", name: "AFCAT – Ground Duty (Non-Tech)", service: "Air Force", stage: "After Graduation", minAge: 20, maxAge: 26, genders: ["male", "female"], education: ["graduate", "engineering", "postgraduate"], requiresUnmarried: false, how: "AFCAT written → AFSB → Medical (marriage permitted only above 25)" },
  // JAG requires candidates to be unmarried at application and through training.
  { id: "jag", name: "JAG (Judge Advocate General)", service: "Army", stage: "After Graduation", minAge: 21, maxAge: 27, genders: ["male", "female"], education: ["law"], requiresUnmarried: true, how: "LLB 55% → merit shortlist → SSB → Medical" },
  { id: "ncc-army", name: "NCC Special Entry", service: "Army", stage: "After Graduation", minAge: 19, maxAge: 25, genders: ["male", "female"], education: ["graduate", "engineering", "postgraduate"], requiresUnmarried: true, how: "Needs NCC 'C' certificate → SSB → Medical (no written)" },
  { id: "navy-ssc-exec", name: "SSC Executive – GS(X) & Technical (Navy)", service: "Navy", stage: "After Graduation", minAge: 19, maxAge: 25, genders: ["male", "female"], education: ["graduate", "engineering"], requiresUnmarried: true, how: "Shortlist on eligibility → SSB → Medical" },
  { id: "navy-ssc-pilot", name: "SSC Pilot / Observer (Navy)", service: "Navy", stage: "After Graduation", minAge: 19, maxAge: 24, genders: ["male", "female"], education: ["graduate", "engineering"], requiresUnmarried: true, requiresPcm: true, how: "SSB → PABT (Pilot Aptitude) → Medical" },
  { id: "navy-ssc-logistics", name: "SSC Logistics / ATC / Education / Law (Navy)", service: "Navy", stage: "After Graduation", minAge: 19, maxAge: 25, genders: ["male", "female"], education: ["graduate", "engineering", "law"], requiresUnmarried: true, how: "Shortlist → SSB → Medical" },
  { id: "af-met", name: "Meteorology Entry (Air Force)", service: "Air Force", stage: "After Graduation", minAge: 20, maxAge: 26, genders: ["male", "female"], education: ["postgraduate"], requiresUnmarried: false, how: "AFCAT written → AFSB → Medical" },

  // ── Coast Guard ───────────────────────────────────────────────────────────
  { id: "cg-gd", name: "Coast Guard AC – General Duty", service: "Coast Guard", stage: "After Graduation", minAge: 21, maxAge: 25, genders: ["male"], education: ["graduate", "engineering"], requiresUnmarried: true, requiresPcm: true, how: "CGCAT → Selection Board → Medical" },
  // Women enter General Duty through the separate Short Service Appointment.
  { id: "cg-gd-women", name: "Coast Guard AC – GD (Women, SSA)", service: "Coast Guard", stage: "After Graduation", minAge: 21, maxAge: 25, genders: ["female"], education: ["graduate", "engineering"], requiresUnmarried: true, requiresPcm: true, how: "CGCAT → Selection Board → Medical (Short Service Appointment)" },
  { id: "cg-pilot", name: "Coast Guard AC – Pilot / Navigator", service: "Coast Guard", stage: "After Graduation", minAge: 19, maxAge: 27, genders: ["male", "female"], education: ["graduate", "engineering"], requiresUnmarried: true, how: "CGCAT → Selection Board → PABT → Medical" },
  { id: "cg-tech", name: "Coast Guard AC – Technical", service: "Coast Guard", stage: "After Graduation", minAge: 21, maxAge: 25, genders: ["male"], education: ["engineering"], requiresUnmarried: true, how: "CGCAT → Selection Board → Medical" },

  // ── Service entries (already in uniform) ──────────────────────────────────
  // ACC and SCO are the classic "Sipahi to Officer" routes; both admit married
  // candidates, which is what separates them from every civilian entry above.
  { id: "acc", name: "ACC (Army Cadet College)", service: "Army", stage: "Serving soldiers", minAge: 20, maxAge: 27, genders: ["male"], education: ["10+2", "graduate", "engineering", "postgraduate", "law"], requiresUnmarried: false, serving: true, how: "Min 2 years' service → ACC written → SSB → Medical" },
  { id: "sco", name: "SCO (Special Commissioned Officer)", service: "Army", stage: "Serving soldiers", minAge: 28, maxAge: 35, genders: ["male"], education: ["10+2", "graduate", "engineering", "postgraduate", "law"], requiresUnmarried: false, serving: true, how: "5–28 years' service → screening → SSB → Medical" },
  { id: "pc-sl", name: "PC (SL) – Permanent Commission (Special List)", service: "Army", stage: "Serving JCOs / NCOs", minAge: 28, maxAge: 35, genders: ["male"], education: ["10+2", "graduate", "engineering", "postgraduate", "law"], requiresUnmarried: false, serving: true, how: "Serving JCO/NCO/OR → screening → SSB → Medical" },
];

export function findEligible(input: EligibilityInput): Entry[] {
  const serving = input.serving === true;
  return ENTRIES.filter((e) => {
    // Service-only entries are hidden from civilians; civilian entries stay
    // visible to serving personnel, who can still apply for them.
    if (e.serving && !serving) return false;
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

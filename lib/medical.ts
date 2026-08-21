export type MedicalStage = { step: string; title: string; detail: string; icon: string };
export type MedicalStandard = { academy: string; height: string; weight: string; vision: string; notes: string };
export type MedicalFaqItem = { q: string; a: string };

export type MedicalDoc = {
  kicker: string;
  title: string;
  subtitle: string;
  processTitle: string;
  processIntro: string;
  stages: MedicalStage[];
  standardsTitle: string;
  standardsIntro: string;
  standards: MedicalStandard[];
  commonTitle: string;
  common: string[];
  appealTitle: string;
  appealBody: string;
  image1: string;
  image2: string;
  faqs: MedicalFaqItem[];
};

export const MEDICAL: MedicalDoc = {
  kicker: "After the Recommendation",
  title: 'The SSB <span class="tricolour-text">Medical</span> Process & Standards',
  subtitle:
    "Recommendation is only half the gate — the Medical Board decides who actually joins. Here is the complete medical process, the standards for each academy, and how the appeal system works.",

  processTitle: "The Medical Board — Step by Step",
  processIntro:
    "Recommended candidates report to a Military Hospital (MH) or Command Hospital immediately after the Conference. The board typically runs 3–5 days and is thorough, unhurried and strictly by the book.",
  stages: [
    { icon: "📋", step: "Day 0", title: "Reporting & Documentation", detail: "You report to the designated Military Hospital with your recommendation letter, ID and medical history. Height, weight and BMI are recorded first — this is where most borderline cases are flagged." },
    { icon: "🩺", step: "Day 1", title: "General Physical Examination", detail: "A full head-to-toe examination: build, skin, lymph nodes, hernia sites, varicocele, hydrocele, flat foot, knock knees, scars and any deformity. Blood pressure and pulse are taken at rest." },
    { icon: "👁", step: "Day 1–2", title: "Vision & ENT", detail: "Visual acuity (distant and near), colour perception (Ishihara), myopia/hypermetropia limits, squint and fundus examination. ENT covers hearing tests, nasal septum (DNS), tonsils and sinuses." },
    { icon: "🦷", step: "Day 2", title: "Dental Examination", detail: "Dental health is scored on the Dental Points system — a minimum of 14 dental points is generally required, with attention to caries, gum disease and bite alignment." },
    { icon: "🧪", step: "Day 2–3", title: "Laboratory Investigations", detail: "Blood tests (CBC, blood sugar, LFT, KFT, HIV, HBsAg), urine analysis including a narcotics screen, ECG, chest X-ray, ultrasound of the abdomen, and an X-ray of any suspect joint." },
    { icon: "🧠", step: "Day 3", title: "Specialist Reviews", detail: "Any finding is referred to the relevant specialist — Orthopaedics, Ophthalmology, ENT, Surgery or Medicine — who records the final opinion in your medical documents." },
    { icon: "📝", step: "Final Day", title: "Board Verdict", detail: "You are declared FIT, TEMPORARY UNFIT (with a review date and the defect noted), or UNFIT. The verdict, the reason and your appeal rights are explained and handed to you in writing." },
  ],

  standardsTitle: "Standards by Service & Academy",
  standardsIntro:
    "Indicative standards for male candidates at sea level; women's standards and service-specific relaxations differ. Always confirm against the official notification for your entry.",
  standards: [
    { academy: "IMA / OTA (Army)", height: "157.5 cm (min)", weight: "As per height–age table (±10% acceptable)", vision: "6/6 in better eye, 6/9 in worse; myopia up to −3.5D", notes: "Correctable vision allowed within limits. Flat foot, knock knees and colour blindness are common causes of rejection." },
    { academy: "INA (Navy)", height: "157 cm (min)", weight: "Proportionate to height & age", vision: "6/6 in better eye, 6/9 in worse (uncorrected 6/12); no colour blindness", notes: "Stricter colour-vision standard (CP-1/CP-2). Sea-going fitness and hearing standards apply." },
    { academy: "AFA (Air Force — Flying)", height: "162.5 cm (min); leg length 99–120 cm", weight: "As per IAF height–weight table", vision: "6/6 in one eye, 6/9 in other; hypermetropia +3.5D max; no myopia at entry", notes: "The strictest branch: LASIK permitted within IAF rules; PABT/CPSS clearance required. Sitting height and thigh length are measured." },
    { academy: "AFA (Air Force — Ground Duty)", height: "157.5 cm (min)", weight: "As per height–age table", vision: "6/6 in better eye; myopia up to −3.5D corrected to 6/6", notes: "Relaxed vision compared to Flying branch; colour perception requirement varies by branch." },
    { academy: "ICG Academy (Coast Guard)", height: "157 cm (min)", weight: "Proportionate to height & age", vision: "6/6 & 6/9 uncorrected; 6/6 in better eye corrected", notes: "Sea-service fitness standards. Good hearing and normal colour perception required." },
  ],

  commonTitle: "Most Common Reasons for Rejection",
  common: [
    "Flat foot (pes planus) — no visible arch when standing",
    "Knock knees or bow legs beyond permissible gap",
    "Colour blindness / poor colour perception (especially Navy & Flying)",
    "Myopia or hypermetropia beyond the branch limit",
    "Deviated nasal septum (DNS) obstructing airflow",
    "Under- or over-weight beyond the ±10% band",
    "Varicocele, hydrocele or an untreated hernia",
    "Poor dental points, active caries or gum disease",
    "Piles, fistula or fissure",
    "Recent fractures, implants or restricted joint movement",
    "Tattoos beyond permitted body areas and size",
    "High blood pressure or resting ECG abnormalities",
  ],

  appealTitle: "If You're Declared Unfit — The Appeal System",
  appealBody:
    "<p>An unfit verdict is <strong>not the end</strong>. You have two levels of appeal, and many candidates join after winning them.</p><ul><li><strong>Appeal Medical Board (AMB)</strong> — apply within 42 days at the designated Military Hospital. Bring treatment records and specialist opinions for the specific defect.</li><li><strong>Review Medical Board (RMB)</strong> — the final appeal, held at a Command Hospital, if the AMB upholds the unfit verdict.</li></ul><p>Temporary defects — weight, dental points, minor DNS, treatable conditions — are often correctable before your review date. Start treatment immediately and document everything.</p>",

  image1: "/images/gto-training.jpg",
  image2: "/images/ima-guard.jpg",

  faqs: [
    { q: "How long after the SSB is the medical?", a: "Usually immediately — recommended candidates are sent to the Military Hospital the day after the Conference, and the board runs 3–5 days." },
    { q: "Can I fix my weight before the medical?", a: "Yes. Weight is one of the most common temporary-unfit reasons and is fully correctable. If declared temporary unfit, you get a review date — use it seriously." },
    { q: "Is LASIK allowed?", a: "For several entries yes, subject to service rules on age at surgery, corneal thickness and post-operative stability. The Flying branch has the strictest criteria — confirm against the current IAF notification." },
    { q: "Do tattoos disqualify me?", a: "Permanent tattoos are permitted only on the inner face of the forearm (from inside of elbow to wrist) and the reverse side of the palm. Tribal tattoos as per custom are considered on merit." },
    { q: "What documents should I carry?", a: "Recommendation letter, photo ID, previous medical/treatment records, spectacle prescription if applicable, and any specialist reports for a known condition." },
  ],
};

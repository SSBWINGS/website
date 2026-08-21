export type AcademyCourse = { name: string; duration: string; who: string };
export type Academy = {
  short: string;
  name: string;
  motto: string;
  location: string;
  service: string;
  established: string;
  image: string;
  intro: string;
  courses: AcademyCourse[];
  highlights: string[];
};

export type AcademiesDoc = {
  kicker: string;
  title: string;
  subtitle: string;
  items: Academy[];
};

export const ACADEMIES: Academy[] = [
  {
    short: "IMA",
    name: "Indian Military Academy",
    motto: "Veerta Aur Vivek (Valour and Wisdom)",
    location: "Dehradun, Uttarakhand",
    service: "Indian Army · Permanent Commission",
    established: "1932",
    image: "/images/ima-guard.jpg",
    intro:
      "The Indian Army's premier academy for Permanent Commission. Gentlemen Cadets pass out as Lieutenants at the historic Chetwode Building, whose credo — 'The safety, honour and welfare of your country come first, always and every time' — defines the Indian officer.",
    courses: [
      { name: "NDA cadets (after 3 years at NDA)", duration: "1 year", who: "Cadets who complete NDA Khadakwasla" },
      { name: "CDS (IMA) direct entry", duration: "18 months", who: "Graduates selected through UPSC CDS" },
      { name: "TGC (Technical Graduate Course)", duration: "1 year", who: "Engineering graduates" },
      { name: "University Entry Scheme", duration: "1 year", who: "Pre-final year engineering students" },
      { name: "ACC (Army Cadet College)", duration: "1 year at IMA (after 3 yrs ACC Wing)", who: "Serving soldiers" },
    ],
    highlights: [
      "Passing Out Parade at the Chetwode Building drill square",
      "Commissioned as Lieutenant in the Indian Army",
      "Khetarpal Auditorium, Somnath Stadium and the historic Quarter Guard",
    ],
  },
  {
    short: "OTA Chennai",
    name: "Officers Training Academy, Chennai",
    motto: "Serve with Honour",
    location: "Chennai, Tamil Nadu",
    service: "Indian Army · Short Service Commission",
    established: "1963",
    image: "/images/ota-sunrise.jpg",
    intro:
      "OTA Chennai trains officers for the Short Service Commission — and is the only Army academy that trains both men and women officers. Cadets are addressed as Gentlemen/Lady Cadets and commission as Lieutenants after an intensive 49-week course.",
    courses: [
      { name: "CDS (OTA) — SSC Men", duration: "49 weeks", who: "Graduates via UPSC CDS" },
      { name: "SSC Women (Non-Technical)", duration: "49 weeks", who: "Women graduates via CDS" },
      { name: "NCC Special Entry", duration: "49 weeks", who: "NCC 'C' certificate holders" },
      { name: "JAG Entry", duration: "49 weeks", who: "Law graduates (men & women)" },
    ],
    highlights: [
      "The only academy commissioning women officers into the Army",
      "Passing Out Parade at Parameswaran Drill Square",
      "Short Service Commission — 10 years, extendable to 14",
    ],
  },
  {
    short: "OTA Gaya",
    name: "Officers Training Academy, Gaya",
    motto: "Adyatan Ranaay (Ready for Battle Today)",
    location: "Gaya, Bihar",
    service: "Indian Army · Technical & SSC entries",
    established: "2011",
    image: "/images/gto-training.jpg",
    intro:
      "The newest Army academy, raised in 2011 to expand officer training capacity. OTA Gaya trains Technical Entry Scheme cadets and Short Service Commission officers, with modern training infrastructure and the same standards as its older sister academies.",
    courses: [
      { name: "10+2 TES (Technical Entry Scheme)", duration: "1 year basic (then 3 yrs at CME/MCTE/MCEME)", who: "10+2 PCM students shortlisted on JEE Mains" },
      { name: "SSC Tech (Men)", duration: "49 weeks", who: "Engineering graduates" },
      { name: "SSC (Non-Tech) courses", duration: "49 weeks", who: "Graduates via CDS/other entries" },
    ],
    highlights: [
      "Primary academy for the 10+2 Technical Entry Scheme",
      "TES cadets earn a B.Tech degree during training",
      "Commissioned as Lieutenant on completion",
    ],
  },
  {
    short: "INA",
    name: "Indian Naval Academy, Ezhimala",
    motto: "Vidyayaamrutamashnute (Immortality through Knowledge)",
    location: "Ezhimala, Kerala",
    service: "Indian Navy · Permanent & Short Service Commission",
    established: "2009 (current campus)",
    image: "/images/pipping-ceremony.jpg",
    intro:
      "Asia's largest naval academy, spread across 2,452 acres of Kerala coastline. INA trains cadets and officers for every branch of the Indian Navy and the Indian Coast Guard, combining seamanship, academics and a full B.Tech degree for cadet entries.",
    courses: [
      { name: "10+2 (B.Tech) Cadet Entry", duration: "4 years (B.Tech)", who: "10+2 PCM with valid JEE Mains" },
      { name: "NDA cadets (Naval wing)", duration: "1 year at INA after NDA", who: "NDA passouts" },
      { name: "Indian Naval Academy Course (INAC)", duration: "4 years", who: "Cadet-entry candidates" },
      { name: "Naval Orientation Course (NOC) — SSC/CDS", duration: "22–44 weeks", who: "Graduates via CDS/SSC entries" },
      { name: "Coast Guard Assistant Commandants", duration: "Initial training at INA", who: "ICG selected candidates" },
    ],
    highlights: [
      "Largest naval academy in Asia — 2,452 acres",
      "Cadets graduate with a B.Tech from JNU",
      "Passing Out Parade at the Ezhimala quarterdeck",
    ],
  },
  {
    short: "AFA",
    name: "Air Force Academy, Dundigal",
    motto: "Touch the Sky with Glory",
    location: "Dundigal, Hyderabad, Telangana",
    service: "Indian Air Force · Permanent & Short Service Commission",
    established: "1971",
    image: "/images/hero-parade.jpg",
    intro:
      "The Indian Air Force's flagship academy near Hyderabad, where Flight Cadets of every branch — Flying, Technical and Ground Duty — train together. The Combined Graduation Parade, with its iconic fly-past and 'pipping' ceremony, marks their commissioning.",
    courses: [
      { name: "Flying Branch (AFCAT / NDA / CDS-AFA / NCC)", duration: "74 weeks", who: "Selected via AFCAT, NDA, CDS or NCC Air Wing" },
      { name: "Ground Duty (Technical) — AE(L) & AE(M)", duration: "52 weeks", who: "Engineering graduates via AFCAT" },
      { name: "Ground Duty (Non-Technical) — Admin, Logistics, Accounts, Education", duration: "52 weeks", who: "Graduates via AFCAT" },
      { name: "Meteorology Branch", duration: "52 weeks", who: "Science/Maths post-graduates" },
    ],
    highlights: [
      "Combined Graduation Parade with a spectacular fly-past",
      "Flying training on Pilatus PC-7 Mk II aircraft",
      "Commissioned as Flying Officer",
    ],
  },
];

export const ACADEMIES_DOC: AcademiesDoc = {
  kicker: "Where Officers Are Forged",
  title: 'The Academies of the <span class="tricolour-text">Indian Armed Forces</span>',
  subtitle:
    "Every entry ends at one of these gates. Here is what each academy trains, who it trains and exactly how long each course runs — IMA, OTA Chennai, OTA Gaya, INA Ezhimala and AFA Dundigal.",
  items: ACADEMIES,
};

"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { SITE, BATCH_INFO, BOOKS, STATS } from "@/lib/data";

type Link = { label: string; href: string; download?: boolean };
type Msg = { from: "bot" | "user"; text: string; links?: Link[] };
type Entry = { id: string; keys: string[]; a: string; links?: Link[] };

const WA = SITE.whatsapp;

const KB: Entry[] = [
  {
    id: "greeting",
    keys: ["hi", "hello", "hey", "namaste", "jai hind"],
    a: "Jai Hind! 🇮🇳 I'm the SSBWINGS assistant. Ask me about the 5-day SSB, our courses & batches, fees, results, or why aspirants choose us. Pick a question below or type your own.",
  },
  {
    id: "whatis",
    keys: ["what is ssb", "about ssb", "ssb mean", "services selection", "what is the ssb"],
    a: "The SSB (Services Selection Board) is the Armed Forces' 5-day personality & intelligence assessment for officer entry. Three assessors — Psychologist, GTO and Interviewing Officer — evaluate you across 15 Officer Like Qualities.",
    links: [{ label: "Decode the 5-Day SSB →", href: "/ssb-process" }],
  },
  {
    id: "5day",
    keys: ["5 day", "5-day", "5day", "five day", "process", "screening", "psychology", "gto", "conference", "stages", "days"],
    a: "The 5 days are: Day 1 Screening (OIR + PPDT), Day 2 Psychology (TAT, WAT, SRT, SD), Days 3–4 GTO tasks + Personal Interview, and Day 5 the Conference. We train you for every single day.",
    links: [{ label: "See the full 5-Day breakdown →", href: "/ssb-process" }],
  },
  {
    id: "dates",
    keys: ["date", "when", "next batch", "batch date", "schedule", "starting", "start date", "timing", "upcoming", "commence"],
    a: `${BATCH_INFO.offline}\n\n${BATCH_INFO.online}\n\nFor the exact next start date, tap enroll or message us on WhatsApp — our team confirms instantly.`,
    links: [
      { label: "Enroll — Offline", href: SITE.enrollOffline },
      { label: "Enroll — Online", href: SITE.enrollOnline },
      { label: "Ask on WhatsApp", href: WA },
    ],
  },
  {
    id: "fees",
    keys: ["fee", "fees", "price", "cost", "charge", "how much", "payment", "pay ", "rupee"],
    a: "Course fees vary by batch and are best confirmed on a quick free counselling call. Offline includes an optional AC hostel @ ₹500/day with meals. You can enroll & pay securely via Razorpay from the course cards.",
    links: [
      { label: "Enroll — Offline", href: SITE.enrollOffline },
      { label: "Enroll — Online", href: SITE.enrollOnline },
      { label: "Free counselling on WhatsApp", href: WA },
    ],
  },
  {
    id: "courses",
    keys: ["course", "program", "programme", "training", "which class", "enroll", "enroll", "buy", "purchase", "join batch"],
    a: "We offer three ways to train: 🎖 15-Day Offline Immersion (Noida campus), 💻 20-Day Online Masterclass (live 8–10 PM), and 📱 the SSB Smart Learning App. You can enroll online securely below.",
    links: [
      { label: "Enroll — Offline Batch", href: SITE.enrollOffline },
      { label: "Enroll — Online Batch", href: SITE.enrollOnline },
      { label: "View all courses →", href: "/courses" },
    ],
  },
  {
    id: "offline",
    keys: ["offline", "noida", "campus", "residential", "15 day", "15-day"],
    a: `Offline: a 15-day residential immersion at our Noida Sector 62 campus — psychology dossiers, a real GTO ground, mock boards & one-on-one interviews. ${BATCH_INFO.offline}`,
    links: [{ label: "Enroll in Offline Batch", href: SITE.enrollOffline }],
  },
  {
    id: "online",
    keys: ["online", "remote", "live class", "evening", "20 day", "20-day", "work"],
    a: `Online: a 20-day live masterclass, 8:00–10:00 PM IST, with recordings provided. ${BATCH_INFO.online}`,
    links: [{ label: "Enroll in Online Batch", href: SITE.enrollOnline }],
  },
  {
    id: "why",
    keys: ["why", "stand out", "choose", "different", "best coaching", "unique", "edge", "trust"],
    a: "Why SSBWINGS stands out: ✔ Mentored by EX-SSB assessors (real IOs & GTOs), not just teachers ✔ A real GTO ground on campus ✔ 677+ recommendations & a 3,450+ alumni-officer family ✔ Personal attention & guidance till your recommendation ✔ Merit-first, no false promises. We give shape to your dreams.",
    links: [{ label: "Why aspirants trust us →", href: "/about" }],
  },
  {
    id: "results",
    keys: ["result", "recommendation", "success", "how many", "selected", "toppers", "air", "wall of honour"],
    a: `Our record speaks: ${STATS[0].value}+ recommendations, ${STATS[1].value}+ alumni officers, ${STATS[2].value}+ NDA entries and 10× All-India-Rank 1 holders.`,
    links: [{ label: "See the Wall of Honour →", href: "/gallery" }],
  },
  {
    id: "entries",
    keys: ["entry", "entries", "eligibility", "nda", "cds", "afcat", "tes", "navy", "join as officer", "how to become", "how to join"],
    a: "We prepare aspirants for every officer entry — NDA, CDS, AFCAT, TES, 10+2 B.Tech, SSC Tech, NCC Special, JAG & more, across Army, Navy, Air Force and Coast Guard. The eligibility for each is on our Entries page.",
    links: [{ label: "Explore all entries →", href: "/entries" }],
  },
  {
    id: "repeater",
    keys: ["repeat", "attempt", "conference out", "failed", "setback", "medical", "again"],
    a: "Repeaters are our specialty. We forensically analyse your previous attempts, pinpoint the OLQs you didn't project, and rebuild your dossier, interview and GTO approach. Many alumni cracked it after multiple conference-outs.",
    links: [{ label: "Read their stories →", href: "/testimonials" }],
  },
  {
    id: "book",
    keys: ["book", "victor kilo", "read", "author", "vishal kaushik"],
    a: `📖 Two books by our team — "${BOOKS[0].title}" and "${BOOKS[1].title} — ${BOOKS[1].subtitle}" by ${BOOKS[1].author}. ${BOOKS[1].blurb}`,
    links: BOOKS.map((b) => ({ label: `Buy "${b.title}" on Flipkart`, href: b.buyUrl })),
  },
  {
    id: "brochure",
    keys: ["brochure", "pdf", "download", "prospectus"],
    a: "Here's our 2026 brochure — everything about courses, batches and the academy in one PDF.",
    links: [{ label: "Download 2026 Brochure (PDF)", href: SITE.brochure, download: true }],
  },
  {
    id: "app",
    keys: ["app", "smart learning", "android", "play store", "mobile"],
    a: "The SSB Smart Learning App is India's first AI-powered virtual GTO ground — 300+ structures across 70 levels, recorded psychology course, 10 practice test sets and a personal-interview bank. Train from anywhere.",
    links: [{ label: "See course details →", href: "/courses" }],
  },
  {
    id: "hostel",
    keys: ["hostel", "accommodation", "stay", "food", "outstation", "mess", "lodging"],
    a: "Yes — outstation aspirants get an on-campus AC hostel (3–4 sharing) at ₹500/day including three fresh meals a day, so your only job is to train.",
  },
  {
    id: "contact",
    keys: ["contact", "address", "location", "phone", "call", "email", "reach", "where are you"],
    a: `📍 ${SITE.address}\n📞 ${SITE.phone1} / ${SITE.phone2}\n✉️ ${SITE.email}`,
    links: [
      { label: "Chat on WhatsApp", href: WA },
      { label: "Contact page →", href: "/contact" },
    ],
  },
];

const byId = (id: string) => KB.find((e) => e.id === id)!;

const QUICK: { label: string; id: string }[] = [
  { label: "What is the 5-day SSB?", id: "5day" },
  { label: "Next batch dates", id: "dates" },
  { label: "Why choose SSBWINGS?", id: "why" },
  { label: "Course fees", id: "fees" },
  { label: "Book: Victor Kilo", id: "book" },
  { label: "Download brochure", id: "brochure" },
];

const toMsg = (e: Entry): Msg => ({ from: "bot", text: e.a, links: e.links });

/** Score entries by number of matching keys and length of the longest match. */
function answer(input: string): Msg {
  const q = ` ${input.toLowerCase()} `;
  let best: Entry | null = null;
  let bestScore = 0;
  for (const e of KB) {
    let score = 0;
    for (const k of e.keys) if (q.includes(k)) score = Math.max(score, k.length);
    if (score > bestScore) { bestScore = score; best = e; }
  }
  if (best) return toMsg(best);
  return {
    from: "bot",
    text: "I'm not sure I caught that. I can help with the SSB process, courses & batches, fees, results, entries, our book or the brochure. You can also reach a mentor directly on WhatsApp.",
    links: [{ label: "Chat on WhatsApp", href: WA }, { label: "Book free counselling", href: "/contact" }],
  };
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 3600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (open && msgs.length === 0) setMsgs([toMsg(byId("greeting"))]);
  }, [open, msgs.length]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, open]);

  const push = (label: string, reply: Msg) => {
    setMsgs((m) => [...m, { from: "user", text: label }]);
    setTimeout(() => setMsgs((m) => [...m, reply]), 350);
  };

  const sendText = (text: string) => {
    const clean = text.trim();
    if (!clean) return;
    setInput("");
    push(clean, answer(clean));
  };

  const sendQuick = (q: { label: string; id: string }) => push(q.label, toMsg(byId(q.id)));

  return (
    <>
      {/* Launcher — bottom left */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Open chat"}
        className={`fixed bottom-5 left-5 z-[61] flex h-14 w-14 items-center justify-center rounded-full text-white shadow-[0_10px_24px_-6px_rgba(16,24,32,0.6)] transition-all duration-500 ${
          show ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
        style={{ background: "linear-gradient(180deg,#2a3a52,#101f33)" }}
      >
        {!open && <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-saffron-500 text-[9px] font-bold">1</span>}
        {open ? (
          <span className="text-2xl leading-none">✕</span>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden>
            <path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-4 4v-4H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" stroke="#f2d519" strokeWidth="1.8" strokeLinejoin="round" />
            <circle cx="8.5" cy="11" r="1.1" fill="#f2d519" />
            <circle cx="12" cy="11" r="1.1" fill="#f2d519" />
            <circle cx="15.5" cy="11" r="1.1" fill="#f2d519" />
          </svg>
        )}
      </button>

      {/* Panel */}
      <div
        className={`fixed bottom-24 left-5 z-[61] w-[92vw] max-w-sm origin-bottom-left transition-all duration-300 ${
          open ? "pointer-events-auto scale-100 opacity-100" : "pointer-events-none scale-90 opacity-0"
        }`}
        role="dialog"
        aria-label="SSBWINGS chat assistant"
      >
        <div className="skeu-panel flex h-[32rem] max-h-[75vh] flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3" style={{ background: "linear-gradient(180deg,#16233f,#0a1524)" }}>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
              <Image src="/logo.webp" alt="" width={30} height={30} className="h-7 w-7 object-contain" />
            </span>
            <div className="flex-1">
              <p className="font-display text-base font-bold uppercase tracking-wide text-gold-300">SSBWINGS Assistant</p>
              <p className="flex items-center gap-1.5 text-[11px] text-navy-100/80">
                <span className="h-2 w-2 rounded-full bg-green-400" /> Online · replies instantly
              </p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close" className="text-navy-100/80 hover:text-white">✕</button>
          </div>

          {/* Messages */}
          <div ref={bodyRef} className="flex-1 space-y-3 overflow-y-auto bg-cream px-3 py-4">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-[var(--shadow-raised)] ${
                    m.from === "user" ? "rounded-br-sm bg-navy-900 text-paper" : "rounded-bl-sm bg-white text-ink"
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                  {m.links && (
                    <div className="mt-2 flex flex-col gap-1.5">
                      {m.links.map((l) => {
                        const external = l.href.startsWith("http");
                        return (
                          <a
                            key={l.label}
                            href={l.href}
                            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                            {...(l.download ? { download: true } : {})}
                            className="rounded-lg bg-saffron-500 px-3 py-1.5 text-center text-xs font-bold uppercase tracking-wide text-white transition hover:brightness-105"
                          >
                            {l.label}
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Quick replies */}
          <div className="flex gap-2 overflow-x-auto border-t border-[rgba(43,36,22,0.1)] bg-paper-2 px-3 py-2">
            {QUICK.map((q) => (
              <button
                key={q.id}
                onClick={() => sendQuick(q)}
                className="shrink-0 rounded-full border border-navy-900/15 bg-white px-3 py-1.5 text-xs font-semibold text-ink transition hover:border-saffron-500 hover:text-saffron-700"
              >
                {q.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => { e.preventDefault(); sendText(input); }}
            className="flex items-center gap-2 border-t border-[rgba(43,36,22,0.1)] bg-white px-3 py-2.5"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about SSB, batches, fees…"
              className="field !py-2.5 text-sm"
              aria-label="Type your question"
            />
            <button type="submit" aria-label="Send" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white" style={{ background: "linear-gradient(180deg,#ff9f43,#ef7a12)" }}>
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
                <path d="M4 12 20 4l-6 16-3.5-6L4 12Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" fill="currentColor" fillOpacity="0.15" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

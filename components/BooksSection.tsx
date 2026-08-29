import Image from "next/image";
import Reveal from "./Reveal";
import CmsSectionHeading from "./CmsSectionHeading";
import { BOOKS } from "@/lib/data";

/** The two SSBWINGS books, as their own movable homepage section. */
export default function BooksSection() {
  return (
    <section className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-[1840px] px-4 sm:px-8">
        <CmsSectionHeading
          sectionKey="books"
          fallback={{
            kicker: "From Our Director's Desk",
            title: 'Books by <span class="tricolour-text">SSBWINGS</span>',
            subtitle: "Written by our Director & GTO mentor Vishal Kaushik.",
          }}
        />
        <div className="mt-12 space-y-8">
          {BOOKS.map((book) => (
            <Reveal key={book.title} delay={100}>
              <article className="skeu-plate card-lift grid items-center gap-8 overflow-hidden p-8 sm:p-10 md:grid-cols-[auto_1fr]">
                <div className="mx-auto w-[190px]">
                  <div className="relative aspect-[3/4.4] w-full overflow-hidden rounded-r-md rounded-l-sm shadow-[0_18px_40px_-14px_rgba(16,24,32,0.7)]">
                    <Image src={book.cover} alt={`${book.title} — ${book.subtitle}`} fill sizes="190px" className="object-cover" />
                  </div>
                </div>
                <div>
                  <h3 className="section-title text-3xl sm:text-4xl">
                    {book.title} <span className="tricolour-text">— {book.subtitle}</span>
                  </h3>
                  <p className="mt-2 font-display text-sm font-semibold uppercase tracking-[0.16em] text-saffron-700">
                    By {book.author} · {book.publisher}
                  </p>
                  <p className="mt-4 max-w-2xl leading-relaxed text-ink-soft">{book.blurb}</p>
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    {book.rating && <span className="skeu-inset px-3 py-1.5 text-sm font-semibold text-tri-green-700">{book.rating}</span>}
                    {book.edition && <span className="skeu-inset px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-ink-soft">{book.edition}</span>}
                  </div>
                  <a href={book.buyUrl} target="_blank" rel="noopener noreferrer" className="btn btn-saffron btn-shine mt-6">
                    BUY
                    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
                      <path d="M7 17 17 7m0 0H9m8 0v8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

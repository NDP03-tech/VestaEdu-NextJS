import React, { useMemo } from "react";
import quotes from "../data/quotesData";
import { motion } from "framer-motion";

const animations = [
  { initial: { opacity: 0, y: -40 }, animate: { opacity: 1, y: 0 } },
  {
    initial: { opacity: 0, scale: 0.5, rotate: -10 },
    animate: { opacity: 1, scale: 1, rotate: 0 },
  },
  { initial: { opacity: 0, x: 50 }, animate: { opacity: 1, x: 0 } },
  { initial: { opacity: 0, rotateX: 90 }, animate: { opacity: 1, rotateX: 0 } },
  {
    initial: { opacity: 0, y: 30, scale: 0.9 },
    animate: { opacity: 1, y: 0, scale: 1 },
  },
];

const QuoteOfTheDay = () => {
  const todayIndex = useMemo(() => {
    const date = new Date();
    return date.getDate() % quotes.length;
  }, []);

  const selectedQuote = quotes[todayIndex];

  const randomAnimation = useMemo(() => {
    const index = Math.floor(Math.random() * animations.length);
    return animations[index];
  }, []);

  return (
    <motion.div
      initial={randomAnimation.initial}
      animate={randomAnimation.animate}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="mb-8 px-4"
    >
      <figure className="relative m-0 mx-auto max-w-4xl overflow-hidden rounded-2xl bg-slate-900 p-8 text-center shadow-xl sm:p-12">
        {/* Dấu ngoặc trang trí */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-6 top-2 font-serif text-[80px] leading-none text-white/10 sm:left-8 sm:top-4 sm:text-[120px]"
        >
          “
        </span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 right-6 rotate-180 font-serif text-[80px] leading-none text-white/10 sm:right-8 sm:text-[120px]"
        >
          “
        </span>

        <div className="relative">
          <motion.figcaption
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-6 text-sm font-semibold uppercase tracking-[0.2em] text-blue-300"
          >
            Quote of the day
          </motion.figcaption>

          <motion.blockquote
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="m-0 mb-6 px-2"
          >
            <p className="m-0 font-serif text-xl font-medium italic leading-relaxed text-white sm:text-3xl lg:text-4xl">
              “{selectedQuote.text}”
            </p>
          </motion.blockquote>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-base font-semibold text-white sm:text-lg">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              {selectedQuote.author}
            </span>
          </motion.div>
        </div>
      </figure>

      {/* Chấm trang trí */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="mt-6 flex justify-center gap-2"
      >
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.4 + i * 0.1, duration: 0.3 }}
            className="h-2 w-2 rounded-full bg-blue-500/60"
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default QuoteOfTheDay;

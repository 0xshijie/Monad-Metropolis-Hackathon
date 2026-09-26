import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Sparkles, TrendingUp } from "lucide-react";
import ShinyText from "../lib/ui/ShinyText";
import { StatsBar } from "./StatsBar";

const fade = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" as const },
  }),
};

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden px-4 pb-20 pt-28 sm:px-6"
    >
      <div className="mx-auto w-full max-w-6xl text-center">
        <motion.div variants={fade} initial="hidden" animate="show" custom={0} className="mx-auto mb-7 w-fit">
          <span className="chip border-gold/40 bg-gold/10 text-gold">
            <Sparkles className="h-3.5 w-3.5" />
            <ShinyText
              text="Social Attention & Culture · Monad Testnet"
              speed={3}
              color="#FBBF24"
              shineColor="#FFFFFF"
            />
          </span>
        </motion.div>

        <motion.h1
          variants={fade}
          initial="hidden"
          animate="show"
          custom={1}
          className="font-serif-display text-[clamp(3.4rem,9vw,8.5rem)] font-normal leading-[0.92] tracking-tight text-frost"
        >
          Attention is
          <br />
          <em className="serif-gold not-italic">the currency</em>
          <br />
          of culture.
        </motion.h1>

        <motion.p
          variants={fade}
          initial="hidden"
          animate="show"
          custom={2}
          className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-fog sm:text-lg"
        >
          Metropolis turns memes, creators, and ideas into live Signals. The crowd stakes MON, momentum
          decays in real time, and the culture that keeps attention becomes value on-chain.
        </motion.p>

        <motion.div
          variants={fade}
          initial="hidden"
          animate="show"
          custom={3}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <a href="#live" className="btn-glow w-full sm:w-auto">
            Enter the Market <ArrowRight className="h-4 w-4" />
          </a>
          <a href="#how" className="btn-ghost w-full sm:w-auto">
            <TrendingUp className="h-4 w-4 text-lilac" />
            How momentum works
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.7 }}
          className="mx-auto mt-16 max-w-5xl"
        >
          <StatsBar />
        </motion.div>
      </div>

      <motion.a
        href="#live"
        aria-label="Scroll down"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-fog transition-colors hover:text-gold"
      >
        <ChevronDown className="h-6 w-6 animate-bounce" />
      </motion.a>
    </section>
  );
}

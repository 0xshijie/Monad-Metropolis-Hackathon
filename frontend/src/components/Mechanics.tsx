import { motion } from "framer-motion";
import { Flame, HandCoins, HeartHandshake, Hourglass, Share2 } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const steps = [
  {
    icon: Share2,
    title: "Mint a Signal",
    body: "Turn a meme, creator, or idea into an on-chain cultural moment.",
    back: "Anyone can create a Signal in one transaction. The creator keeps the economics forever.",
    color: "text-violet",
  },
  {
    icon: Flame,
    title: "The crowd boosts",
    body: "Stake native MON to push a signal up the attention graph and mint shares.",
    back: "Early curators mint attention shares and earn when the signal compounds.",
    color: "text-gold",
  },
  {
    icon: Hourglass,
    title: "Momentum decays",
    body: "Attention is perishable. Scores decay ~17% per day unless culture compounds.",
    back: "This keeps the leaderboard honest: stale attention fades, fresh culture rises.",
    color: "text-fuchsia-300",
  },
  {
    icon: HeartHandshake,
    title: "Value follows culture",
    body: "Curators exit with MON, creators earn 5% per boost plus direct tips.",
    back: "A full creator economy: fees on every boost and a direct tip rail for superfans.",
    color: "text-lilac",
  },
];

export function Mechanics() {
  return (
    <section id="how" className="snap-section mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 py-16 sm:px-6">
      <div className="mb-12 flex justify-center text-center">
        <SectionHeading
          align="center"
          kicker="Protocol mechanics"
          kickerColor="#FBBF24"
          title="Culture compounds, attention decays."
          description="A live market for cultural momentum. Hover a card to flip it and see the economics underneath."
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="group h-72 perspective-1200"
          >
            <div className="relative h-full w-full transition-transform duration-700 preserve-3d group-hover:[transform:rotateY(180deg)]">
              <div className="absolute inset-0 flex flex-col rounded-3xl border border-line/70 bg-panel/80 p-6 backdrop-blur-xl backface-hidden">
                <s.icon className={`h-8 w-8 ${s.color}`} />
                <h3 className="mt-4 font-display text-xl font-bold text-frost">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fog">{s.body}</p>
                <span className="mt-auto text-[11px] uppercase tracking-widest text-fog/70">Hover to flip</span>
              </div>
              <div className="absolute inset-0 flex flex-col rounded-3xl border border-gold/40 bg-gradient-to-br from-violet/20 to-panel p-6 shadow-glow backface-hidden [transform:rotateY(180deg)]">
                <HandCoins className="h-7 w-7 text-gold" />
                <p className="mt-4 text-sm leading-relaxed text-frost">{s.back}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

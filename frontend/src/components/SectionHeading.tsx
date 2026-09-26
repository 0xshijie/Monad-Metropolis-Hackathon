import ShinyText from "../lib/ui/ShinyText";
import BlurText from "../lib/ui/BlurText";

interface Props {
  kicker?: string;
  kickerColor?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  serif?: boolean;
}

export function SectionHeading({
  kicker,
  kickerColor = "#A78BFA",
  title,
  description,
  align = "left",
  serif = true,
}: Props) {
  const alignCls = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <div className={`max-w-3xl ${alignCls}`}>
      {kicker ? (
        <p
          className={`mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] ${
            align === "center" ? "justify-center" : ""
          }`}
          style={{ color: kickerColor }}
        >
          <span className="h-px w-8" style={{ background: kickerColor }} />
          <ShinyText text={kicker} speed={2.4} color={kickerColor} shineColor="#FFFFFF" />
          <span className="h-px w-8" style={{ background: kickerColor }} />
        </p>
      ) : null}
      <BlurText
        text={title}
        animateBy="words"
        stepDuration={0.25}
        delay={80}
        className={`${serif ? "font-serif-display" : "font-display"} text-4xl font-medium leading-[1.06] tracking-tight text-frost sm:text-6xl`}
      />
      {description ? (
        <p className="mt-5 max-w-xl text-base leading-relaxed text-fog">{description}</p>
      ) : null}
    </div>
  );
}

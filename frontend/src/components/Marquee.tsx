import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  reverse?: boolean;
  duration?: number;
  className?: string;
}

export function Marquee({ children, reverse = false, duration = 40, className = "" }: Props) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="flex w-max">
        <div
          className={`marquee-track flex w-max items-center ${reverse ? "marquee-reverse" : ""}`}
          style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
        >
          <div className="flex w-max items-center">{children}</div>
          <div className="flex w-max items-center" aria-hidden="true">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/backgrounds/bg.mp4"
        poster="/backgrounds/bg-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
      />

      {/* 深色遮罩：保证前景文字可读，同时保留暗金紫调性 */}
      <div className="absolute inset-0 bg-ink/50" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,transparent_40%,rgba(8,7,15,0.75)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-transparent to-ink/70" />

      <div className="film-noise absolute inset-0 opacity-[0.06] mix-blend-soft-light" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet/80 to-transparent" />
    </div>
  );
}

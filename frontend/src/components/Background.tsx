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

      {/* 仅用无混合模式的半透明遮罩，避免 mix-blend-mode 在部分 Chrome 上把视频染黑 */}
      <div className="absolute inset-0 bg-ink/25" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,transparent_45%,rgba(8,7,15,0.7)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/25 via-transparent to-ink/65" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet/80 to-transparent" />
    </div>
  );
}

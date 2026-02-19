export default function GridBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(74, 222, 128, 0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(74, 222, 128, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '70px 70px',
        }}
      />
      {/* Radial vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#0a0a0f_75%)]" />
      {/* Top accent glow */}
      <div className="absolute -top-[300px] left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-accent/[0.03] blur-3xl" />
    </div>
  )
}

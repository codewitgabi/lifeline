export default function LogoDrop({ size = 26 }: { size?: number }) {
  const dot = Math.round(size * 0.3);
  const dotSize = Math.round(size * 0.24);
  return (
    <span
      className="inline-block relative flex-none"
      style={{
        width: size,
        height: size,
        background: "#C8102E",
        borderRadius: "50% 50% 50% 4px",
        transform: "rotate(45deg)",
      }}
      aria-hidden="true"
    >
      <span
        className="absolute rounded-full bg-white"
        style={{ top: dot, right: dot, width: dotSize, height: dotSize, opacity: 0.85 }}
      />
    </span>
  );
}

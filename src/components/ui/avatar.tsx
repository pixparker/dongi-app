const AVATAR_COLORS = ["#00D68F", "#FF6B6B", "#FFB547", "#6B8AFF", "#FF8FCB"];

interface AvatarProps {
  name: string;
  size?: number;
  color?: string;
}

export function Avatar({ name, size = 36, color }: AvatarProps) {
  const c = color || AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

  return (
    <div
      className="rounded-full flex items-center justify-center font-bold shrink-0"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${c}, ${c}88)`,
        fontSize: size * 0.38,
        color: "#0F1923",
      }}
    >
      {name.charAt(0)}
    </div>
  );
}

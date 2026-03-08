import { TYPE_COLORS } from '@/types';

interface TypeBadgeProps {
  type: string;
  small?: boolean;
}

export default function TypeBadge({ type, small = false }: TypeBadgeProps) {
  const bgColor = TYPE_COLORS[type] || '#9ca3af';

  return (
    <span
      style={{ backgroundColor: bgColor }}
      className={`text-white font-semibold rounded-full ${
        small ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1'
      }`}
    >
      {type}
    </span>
  );
}

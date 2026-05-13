import { useDraggable } from '@dnd-kit/core';

interface Props {
  id: string;
  label: string;
  origin: 'bank' | 'slot';
  variant?: 'default' | 'decoy';
  onClick?: () => void;
}

export function CommandChip({ id, label, origin, variant = 'default', onClick }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    data: { origin, label },
  });
  const style: React.CSSProperties = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 1000 }
    : {};
  return (
    <button
      ref={setNodeRef}
      style={style}
      className={`chip chip--${origin} chip--${variant} ${isDragging ? 'is-dragging' : ''}`}
      onClick={onClick}
      type="button"
      {...listeners}
      {...attributes}
    >
      <code>{label}</code>
    </button>
  );
}

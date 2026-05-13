import { useDroppable } from '@dnd-kit/core';
import { CommandChip } from './command-chip';

interface Props {
  index: number;
  value: string | null;
  onClear: () => void;
}

export function SlotZone({ index, value, onClear }: Props) {
  const { isOver, setNodeRef } = useDroppable({ id: `slot-${index}`, data: { slotIndex: index } });
  return (
    <div ref={setNodeRef} className={`slot ${isOver ? 'slot--over' : ''} ${value ? 'slot--filled' : 'slot--empty'}`}>
      <div className="slot__num">{index + 1}</div>
      {value ? (
        <CommandChip id={`slot-chip-${index}`} label={value} origin="slot" onClick={onClear} />
      ) : (
        <span className="slot__placeholder">drop команду</span>
      )}
    </div>
  );
}

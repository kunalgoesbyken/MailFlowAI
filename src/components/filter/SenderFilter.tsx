import { Input } from '@/components/ui/input';

interface SenderFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export function SenderFilter({ value, onChange }: SenderFilterProps) {
  return (
    <label className="flex flex-col gap-1.5 text-xs font-medium text-neutral-500">
      From
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="name or email"
      />
    </label>
  );
}

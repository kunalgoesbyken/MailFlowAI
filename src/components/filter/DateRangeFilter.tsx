import { useState } from 'react';
import dayjs from 'dayjs';
import { cn } from '@/lib/utils';
import type { FilterState } from '@/types/email';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

const PRESETS = [
  { label: 'Today', days: 0 },
  { label: '7 days', days: 7 },
  { label: '30 days', days: 30 },
  { label: '1 year', days: 365 },
];

interface DateRangeFilterProps {
  filters: FilterState;
  onDateChange: (dateFrom?: Date, dateTo?: Date) => void;
}

interface DatePickerProps {
  label: string;
  value?: Date;
  onSelect: (date?: Date) => void;
  disabled?: (date: Date) => boolean;
}

function DatePicker({ label, value, onSelect, disabled }: DatePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn('flex-1 font-normal', !value && 'text-neutral-400')}>
          {value ? dayjs(value).format('MMM D, YYYY') : label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2" align="start">
        <Calendar
          mode="single"
          selected={value}
          disabled={disabled}
          onSelect={(date) => {
            onSelect(date);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

const endOfDay = (date?: Date) => {
  if (!date) return undefined;
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return end;
};

export function DateRangeFilter({ filters, onDateChange }: DateRangeFilterProps) {
  const applyPreset = (days: number) => {
    const from = new Date();
    from.setDate(from.getDate() - days);
    from.setHours(0, 0, 0, 0);
    onDateChange(from, undefined);
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-neutral-500">Date</span>
      <div className="flex flex-wrap gap-1.5">
        {PRESETS.map((preset) => (
          <Button key={preset.label} variant="outline" size="sm" onClick={() => applyPreset(preset.days)}>
            {preset.label}
          </Button>
        ))}
      </div>
      <div className="flex gap-2">
        <DatePicker
          label="From"
          value={filters.dateFrom}
          onSelect={(date) => onDateChange(date, filters.dateTo)}
        />
        <DatePicker
          label="To"
          value={filters.dateTo}
          onSelect={(date) => onDateChange(filters.dateFrom, endOfDay(date))}
          disabled={(date) => !!filters.dateFrom && date < filters.dateFrom}
        />
      </div>
      {(filters.dateFrom || filters.dateTo) && (
        <button
          onClick={() => onDateChange(undefined, undefined)}
          className="self-start text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
        >
          Clear dates
        </button>
      )}
    </div>
  );
}

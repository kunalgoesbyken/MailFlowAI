import { SlidersHorizontal } from 'lucide-react';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { debounce } from '@/lib/utils';
import type { FilterState } from '@/types/email';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SenderFilter } from './SenderFilter';
import { DateRangeFilter } from './DateRangeFilter';

interface AdvancedFilterPopoverProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export function AdvancedFilterPopover({ filters, onFiltersChange }: AdvancedFilterPopoverProps) {
  const [senderFilter, setSenderFilter] = useState(filters.sender || '');

  const filtersRef = useRef(filters);
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    setSenderFilter(filters.sender || '');
  }, [filters.sender]);

  const debouncedUpdate = useMemo(
    () => debounce((next: FilterState) => onFiltersChange(next), 250),
    [onFiltersChange]
  );

  useEffect(() => () => debouncedUpdate.cancel(), [debouncedUpdate]);

  const handleSenderChange = useCallback((value: string) => {
    setSenderFilter(value);
    debouncedUpdate({ ...filtersRef.current, sender: value || undefined });
  }, [debouncedUpdate]);

  const setDateFilter = useCallback((dateFrom?: Date, dateTo?: Date) => {
    onFiltersChange({ ...filtersRef.current, dateFrom, dateTo });
  }, [onFiltersChange]);

  const clearAll = useCallback(() => {
    debouncedUpdate.cancel();
    setSenderFilter('');
    onFiltersChange({});
  }, [debouncedUpdate, onFiltersChange]);

  const activeCount = [filters.sender, filters.dateFrom || filters.dateTo].filter(Boolean).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" aria-label="Filters">
          <SlidersHorizontal />
          {activeCount > 0 && <span className="text-xs">{activeCount}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-80 flex-col gap-4" align="end">
        <SenderFilter value={senderFilter} onChange={handleSenderChange} />
        <DateRangeFilter filters={filters} onDateChange={setDateFilter} />
        <button
          onClick={clearAll}
          className="self-start text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
        >
          Clear all filters
        </button>
      </PopoverContent>
    </Popover>
  );
}

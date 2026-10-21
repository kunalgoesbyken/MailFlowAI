import { useCallback } from 'react';
import type { FilterState, SortOrder } from '@/types/email';
import { SearchInput } from '@/components/filter/SearchInput';
import { UnreadFilterButton } from '@/components/filter/UnreadFilterButton';
import { AdvancedFilterPopover } from '@/components/filter/AdvancedFilterPopover';
import { SortButton } from '@/components/filter/SortButton';

interface FilterBarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  sortOrder: SortOrder;
  onSortChange: (order: SortOrder) => void;
}

export function FilterBar({ filters, onFiltersChange, sortOrder, onSortChange }: FilterBarProps) {
  const toggleUnread = useCallback(() => {
    onFiltersChange({ ...filters, isUnread: filters.isUnread ? undefined : true });
  }, [filters, onFiltersChange]);

  return (
    <div className="flex items-center gap-2">
      <SearchInput filters={filters} onFiltersChange={onFiltersChange} />
      <UnreadFilterButton isUnread={filters.isUnread} onToggle={toggleUnread} />
      <AdvancedFilterPopover filters={filters} onFiltersChange={onFiltersChange} />
      <SortButton sortOrder={sortOrder} onSortChange={onSortChange} />
    </div>
  );
}

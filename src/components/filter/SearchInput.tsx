import { X, Search } from 'lucide-react';
import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { debounce } from '@/lib/utils';
import type { FilterState } from '@/types/email';
import { Input } from '@/components/ui/input';

interface SearchInputProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export function SearchInput({ filters, onFiltersChange }: SearchInputProps) {
  const [searchQuery, setSearchQuery] = useState(filters.query || '');

  const filtersRef = useRef(filters);
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    setSearchQuery(filters.query || '');
  }, [filters.query]);

  const debouncedFilterUpdate = useMemo(
    () => debounce((newFilters: FilterState) => onFiltersChange(newFilters), 250),
    [onFiltersChange]
  );

  useEffect(() => () => debouncedFilterUpdate.cancel(), [debouncedFilterUpdate]);

  const handleChange = useCallback((value: string) => {
    setSearchQuery(value);
    debouncedFilterUpdate({ ...filtersRef.current, query: value || undefined });
  }, [debouncedFilterUpdate]);

  const clear = useCallback(() => {
    setSearchQuery('');
    debouncedFilterUpdate.cancel();
    onFiltersChange({ ...filtersRef.current, query: undefined });
  }, [onFiltersChange, debouncedFilterUpdate]);

  return (
    <div className="relative flex-1">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
      <Input
        id="search-input"
        type="text"
        value={searchQuery}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Escape' && e.currentTarget.blur()}
        placeholder="Search mail ( / )"
        className="pl-9 pr-9"
      />
      {searchQuery && (
        <button
          onClick={clear}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import type { SortOption } from "@/lib/utils/sorting"

interface DataSortFilterProps {
  sortOptions: SortOption[]
  currentSort: string
  onSortChange: (sort: string) => void
  activeFilters: Record<string, any>
  onFilterClear: (filterKey: string) => void
  onClearAllFilters: () => void
  resultCount: number
  className?: string
}

export function DataSortFilter({
  sortOptions,
  currentSort,
  onSortChange,
  activeFilters,
  onFilterClear,
  onClearAllFilters,
  resultCount,
  className = "",
}: DataSortFilterProps) {
  const activeFilterCount = Object.values(activeFilters).filter(
    (value) => value && (Array.isArray(value) ? value.length > 0 : true),
  ).length

  return (
    <div
      className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}
    >
      <div className="flex items-center gap-4">
        <p className="text-gray-600 dark:text-gray-300">
          {resultCount} result{resultCount !== 1 ? "s" : ""} found
        </p>

        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-grassland-600 dark:text-grassland-400" />
            <span className="text-sm text-grassland-600 dark:text-grassland-400">
              {activeFilterCount} filter{activeFilterCount !== 1 ? "s" : ""} applied
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAllFilters}
              className="h-6 px-2 text-xs hover:bg-grassland-50 dark:hover:bg-grassland-900 text-grassland-600 dark:text-grassland-400"
            >
              Clear all
            </Button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
        <Select value={currentSort} onValueChange={onSortChange}>
          <SelectTrigger className="w-[200px] bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            {sortOptions.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

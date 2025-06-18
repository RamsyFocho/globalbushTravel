export type SortOption = {
  value: string
  label: string
  field: string
  direction: "asc" | "desc"
}

export type FilterOption = {
  id: string
  label: string
  value: any
  count?: number
}

export const flightSortOptions: SortOption[] = [
  { value: "price-asc", label: "Price (Low to High)", field: "price", direction: "asc" },
  { value: "price-desc", label: "Price (High to Low)", field: "price", direction: "desc" },
  { value: "duration-asc", label: "Duration (Shortest)", field: "duration", direction: "asc" },
  { value: "departure-asc", label: "Departure Time (Early)", field: "departure.time", direction: "asc" },
  { value: "departure-desc", label: "Departure Time (Late)", field: "departure.time", direction: "desc" },
  { value: "stops-asc", label: "Stops (Fewest)", field: "stops", direction: "asc" },
]

export const hotelSortOptions: SortOption[] = [
  { value: "price-asc", label: "Price (Low to High)", field: "price", direction: "asc" },
  { value: "price-desc", label: "Price (High to Low)", field: "price", direction: "desc" },
  { value: "rating-desc", label: "Guest Rating (High to Low)", field: "reviews.average", direction: "desc" },
  { value: "rating-asc", label: "Guest Rating (Low to High)", field: "reviews.average", direction: "asc" },
  { value: "distance-asc", label: "Distance from Center", field: "distance", direction: "asc" },
]

export const packageSortOptions: SortOption[] = [
  { value: "price-asc", label: "Price (Low to High)", field: "price", direction: "asc" },
  { value: "price-desc", label: "Price (High to Low)", field: "price", direction: "desc" },
  { value: "rating-desc", label: "Rating (High to Low)", field: "rating", direction: "desc" },
  { value: "duration-asc", label: "Duration (Shortest)", field: "duration", direction: "asc" },
  { value: "duration-desc", label: "Duration (Longest)", field: "duration", direction: "desc" },
]

export function sortData<T>(data: T[], sortOption: SortOption): T[] {
  return [...data].sort((a, b) => {
    const aValue = getNestedValue(a, sortOption.field)
    const bValue = getNestedValue(b, sortOption.field)

    if (typeof aValue === "string" && typeof bValue === "string") {
      const comparison = aValue.localeCompare(bValue)
      return sortOption.direction === "asc" ? comparison : -comparison
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortOption.direction === "asc" ? aValue - bValue : bValue - aValue
    }

    return 0
  })
}

export function filterData<T>(data: T[], filters: Record<string, any>): T[] {
  return data.filter((item) => {
    return Object.entries(filters).every(([key, value]) => {
      if (!value || (Array.isArray(value) && value.length === 0)) return true

      const itemValue = getNestedValue(item, key)

      if (Array.isArray(value)) {
        return value.includes(itemValue)
      }

      if (typeof value === "object" && value.min !== undefined && value.max !== undefined) {
        return itemValue >= value.min && itemValue <= value.max
      }

      return itemValue === value
    })
  })
}

function getNestedValue(obj: any, path: string): any {
  return path.split(".").reduce((current, key) => current?.[key], obj)
}

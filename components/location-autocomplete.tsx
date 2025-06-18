"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Plane, Search, Check, AlertCircle, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { flightService, type LocationSuggestion } from "@/lib/api/flight-service"

interface LocationAutocompleteProps {
  id: string
  label: string
  placeholder: string
  value: string
  onChange: (value: string, location?: LocationSuggestion) => void
  className?: string
  disabled?: boolean
}

export function LocationAutocomplete({
  id,
  label,
  placeholder,
  value,
  onChange,
  className = "",
  disabled = false,
}: LocationAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value)
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<LocationSuggestion | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const debounceRef = useRef<NodeJS.Timeout>()
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Debounced search function
  const debouncedSearch = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSuggestions([])
      setError(null)
      setShowSuggestions(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const results = await flightService.searchLocations(query)
      setSuggestions(results)
      setShowSuggestions(true)
      setFocusedIndex(-1)

      if (results.length === 0) {
        setError("No locations found. Try a different search term.")
      }
    } catch (error) {
      console.error("Location search error:", error)
      setError("Unable to search locations. Please try again.")
      setSuggestions([])
      setShowSuggestions(false)
    } finally {
      setLoading(false)
    }
  }, [])

  // Handle input change with debouncing
  const handleInputChange = (newValue: string) => {
    setInputValue(newValue)
    onChange(newValue)
    setSelectedLocation(null) // Clear selection when typing

    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    // Set new timeout for search
    debounceRef.current = setTimeout(() => {
      debouncedSearch(newValue)
    }, 300)
  }

  // Handle location selection
  const handleLocationSelect = (location: LocationSuggestion) => {
    setSelectedLocation(location)
    const displayValue = `${location.city_name} (${location.iata_code})`
    setInputValue(displayValue)
    onChange(displayValue, location)
    setShowSuggestions(false)
    setSuggestions([])
    setError(null)
    setFocusedIndex(-1)
    inputRef.current?.blur()
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setFocusedIndex(prev => Math.min(prev + 1, suggestions.length - 1))
        break
      case "ArrowUp":
        e.preventDefault()
        setFocusedIndex(prev => Math.max(prev - 1, -1))
        break
      case "Enter":
        e.preventDefault()
        if (focusedIndex >= 0 && focusedIndex < suggestions.length) {
          handleLocationSelect(suggestions[focusedIndex])
        }
        break
      case "Escape":
        setShowSuggestions(false)
        setFocusedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  // Handle input focus
  const handleInputFocus = () => {
    if (inputValue.length >= 2 && suggestions.length > 0) {
      setShowSuggestions(true)
    }
  }

  // Handle input blur
  const handleInputBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      setShowSuggestions(false)
      setFocusedIndex(-1)
    }, 200)
  }

  // Clear selection
  const handleClear = () => {
    setSelectedLocation(null)
    setInputValue("")
    onChange("")
    setShowSuggestions(false)
    setSuggestions([])
    setError(null)
    setFocusedIndex(-1)
    inputRef.current?.focus()
  }

  // Update input value when prop value changes
  useEffect(() => {
    setInputValue(value)
    // Clear selection if value doesn't match
    if (selectedLocation && !value.includes(selectedLocation.iata_code)) {
      setSelectedLocation(null)
    }
  }, [value, selectedLocation])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  return (
    <div className={cn("space-y-2 relative", className)}>
      <Label htmlFor={id} className="text-gray-900 dark:text-gray-100">
        {label}
      </Label>
      <div className="relative">
        <Input
          ref={inputRef}
          id={id}
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          disabled={disabled}
          className={cn(
            "h-12 pl-10 pr-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100",
            error && "border-red-500 dark:border-red-400",
            showSuggestions && "border-blue-500 dark:border-blue-400",
          )}
          autoComplete="off"
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          {loading ? (
            <Search className="h-4 w-4 text-gray-400 animate-spin" />
          ) : error ? (
            <AlertCircle className="h-4 w-4 text-red-500" />
          ) : (
            <MapPin className="h-4 w-4 text-gray-400" />
          )}
        </div>
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {selectedLocation && !error && (
            <Check className="h-4 w-4 text-green-500" />
          )}
          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear input"
              className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {loading && (
            <div className="flex items-center justify-center py-6">
              <Search className="h-4 w-4 animate-spin text-gray-400 mr-2" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Searching locations...</span>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center py-6 px-4">
              <AlertCircle className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
              <span className="text-sm text-red-600 dark:text-red-400 text-center">{error}</span>
            </div>
          )}

          {!loading && !error && suggestions.length === 0 && inputValue.length >= 2 && (
            <div className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
              No locations found for "{inputValue}"
            </div>
          )}

          {!loading && !error && suggestions.length > 0 && (
            <div className="py-1">
              {suggestions.map((location, index) => (
                <button
                  key={location.id}
                  type="button"
                  onClick={() => handleLocationSelect(location)}
                  className={cn(
                    "w-full flex items-start space-x-3 p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors",
                    focusedIndex === index && "bg-gray-50 dark:bg-gray-700"
                  )}
                >
                  <div className="flex-shrink-0 mt-1">
                    <Plane className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900 dark:text-gray-100">{location.city_name}</span>
                      <span className="text-sm font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900 px-1.5 py-0.5 rounded">
                        {location.iata_code}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 truncate">{location.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-500">{location.country_name}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {!loading && !error && inputValue.length < 2 && (
            <div className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
              Type at least 2 characters to search for locations
            </div>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{error}</p>}
    </div>
  )
}

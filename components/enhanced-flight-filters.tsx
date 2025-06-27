"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface FlightFiltersProps {
  onFiltersChange: (filters: Record<string, any>) => void
  className?: string
}

export function EnhancedFlightFilters({ onFiltersChange, className = "" }: FlightFiltersProps) {
  const [priceRange, setPriceRange] = useState([0, 2000])
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([])
  const [selectedStops, setSelectedStops] = useState<string[]>([])
  const [selectedDepartureTime, setSelectedDepartureTime] = useState<string[]>([])
  const [maxDuration, setMaxDuration] = useState([720]) // 12 hours in minutes

  const airlines = [
    { id: "Emirates", name: "Emirates", count: 12 },
    { id: "British Airways", name: "British Airways", count: 8 },
    { id: "Turkish Airlines", name: "Turkish Airlines", count: 15 },
    { id: "Lufthansa", name: "Lufthansa", count: 6 },
    { id: "Air France", name: "Air France", count: 9 },
  ]

  const stops = [
    { id: "0", name: "Direct", count: 5 },
    { id: "1", name: "1 Stop", count: 25 },
    { id: "2", name: "2+ Stops", count: 12 },
  ]

  const timeSlots = [
    { id: "morning", name: "Morning", time: "6AM - 12PM", icon: "🌅" },
    { id: "afternoon", name: "Afternoon", time: "12PM - 6PM", icon: "☀️" },
    { id: "evening", name: "Evening", time: "6PM - 12AM", icon: "🌆" },
    { id: "night", name: "Night", time: "12AM - 6AM", icon: "🌙" },
  ]

  // Memoized function to build and apply filters
  const applyFilters = useCallback(() => {
    const filters: Record<string, any> = {}

    if (priceRange[0] > 0 || priceRange[1] < 2000) {
      filters.price = { min: priceRange[0], max: priceRange[1] }
    }

    if (selectedAirlines.length > 0) {
      filters.airline = selectedAirlines
    }

    if (selectedStops.length > 0) {
      filters.stops = selectedStops.map(Number)
    }

    if (maxDuration[0] < 720) {
      filters.durationMinutes = { min: 0, max: maxDuration[0] }
    }

    if (selectedDepartureTime.length > 0) {
      filters.departureTime = selectedDepartureTime
    }

    onFiltersChange(filters)
  }, [priceRange, selectedAirlines, selectedStops, maxDuration, selectedDepartureTime, onFiltersChange])

  const handleAirlineChange = (airlineId: string, checked: boolean) => {
    const newSelected = checked ? [...selectedAirlines, airlineId] : selectedAirlines.filter((id) => id !== airlineId)
    setSelectedAirlines(newSelected)
  }

  const handleStopsChange = (stopId: string, checked: boolean) => {
    const newSelected = checked ? [...selectedStops, stopId] : selectedStops.filter((id) => id !== stopId)
    setSelectedStops(newSelected)
  }

  const handleTimeSlotChange = (timeId: string, checked: boolean) => {
    const newSelected = checked
      ? [...selectedDepartureTime, timeId]
      : selectedDepartureTime.filter((id) => id !== timeId)
    setSelectedDepartureTime(newSelected)
  }

  const clearAllFilters = () => {
    setPriceRange([0, 2000])
    setSelectedAirlines([])
    setSelectedStops([])
    setSelectedDepartureTime([])
    setMaxDuration([720])
    // Apply empty filters immediately
    onFiltersChange({})
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (priceRange[0] > 0 || priceRange[1] < 2000) count++
    if (selectedAirlines.length > 0) count++
    if (selectedStops.length > 0) count++
    if (selectedDepartureTime.length > 0) count++
    if (maxDuration[0] < 720) count++
    return count
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
        {getActiveFilterCount() > 0 && (
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
            >
              {getActiveFilterCount()} active
            </Badge>
            <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-gray-600 dark:text-gray-400">
              Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Price Range */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg text-gray-900 dark:text-white">Price Range</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Slider value={priceRange} onValueChange={setPriceRange} max={2000} min={0} step={50} className="w-full" />
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
            <Button size="sm" onClick={applyFilters} className="w-full bg-purple-600 hover:bg-purple-700">
              Apply Price Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Airlines */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg text-gray-900 dark:text-white">Airlines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {airlines.map((airline) => (
              <div key={airline.id} className="flex items-center space-x-2">
                <Checkbox
                  id={airline.id}
                  checked={selectedAirlines.includes(airline.id)}
                  onCheckedChange={(checked) => {
                    handleAirlineChange(airline.id, checked as boolean)
                    // Apply filters after a short delay to batch updates
                    setTimeout(applyFilters, 100)
                  }}
                />
                <Label htmlFor={airline.id} className="flex-1 cursor-pointer text-gray-900 dark:text-gray-100">
                  {airline.name}
                </Label>
                <span className="text-sm text-gray-500 dark:text-gray-400">({airline.count})</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stops */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg text-gray-900 dark:text-white">Stops</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stops.map((stop) => (
              <div key={stop.id} className="flex items-center space-x-2">
                <Checkbox
                  id={stop.id}
                  checked={selectedStops.includes(stop.id)}
                  onCheckedChange={(checked) => {
                    handleStopsChange(stop.id, checked as boolean)
                    setTimeout(applyFilters, 100)
                  }}
                />
                <Label htmlFor={stop.id} className="flex-1 cursor-pointer text-gray-900 dark:text-gray-100">
                  {stop.name}
                </Label>
                <span className="text-sm text-gray-500 dark:text-gray-400">({stop.count})</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Flight Duration */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg text-gray-900 dark:text-white">Max Flight Duration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Slider
              value={maxDuration}
              onValueChange={setMaxDuration}
              max={720}
              min={180}
              step={30}
              className="w-full"
            />
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              Up to {Math.floor(maxDuration[0] / 60)}h {maxDuration[0] % 60}m
            </div>
            <Button size="sm" onClick={applyFilters} className="w-full bg-purple-600 hover:bg-purple-700">
              Apply Duration Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Departure Time */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg text-gray-900 dark:text-white">Departure Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {timeSlots.map((slot) => (
              <div
                key={slot.id}
                className={`text-center p-3 border rounded cursor-pointer transition-colors ${
                  selectedDepartureTime.includes(slot.id)
                    ? "border-purple-600 bg-purple-50 dark:bg-purple-900 dark:border-purple-400"
                    : "border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
                onClick={() => {
                  handleTimeSlotChange(slot.id, !selectedDepartureTime.includes(slot.id))
                  setTimeout(applyFilters, 100)
                }}
              >
                <div className="text-lg mb-1">{slot.icon}</div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{slot.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{slot.time}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Apply All Filters Button */}
      <Button onClick={applyFilters} className="w-full bg-purple-600 hover:bg-purple-700">
        Apply All Filters
      </Button>
    </div>
  )
}

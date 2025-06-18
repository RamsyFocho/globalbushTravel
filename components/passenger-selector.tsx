"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Users, Minus, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface PassengerCounts {
  adults: number
  children: number
  infants: number
}

interface PassengerSelectorProps {
  value?: PassengerCounts
  onChange?: (passengers: PassengerCounts) => void
  className?: string
}

export function PassengerSelector({ value, onChange, className }: PassengerSelectorProps) {
  const [passengers, setPassengers] = useState<PassengerCounts>(value || { adults: 1, children: 0, infants: 0 })
  const [isOpen, setIsOpen] = useState(false)

  const updatePassengers = (type: keyof PassengerCounts, increment: boolean) => {
    const newPassengers = { ...passengers }

    if (increment) {
      if (type === "adults" && newPassengers.adults < 9) {
        newPassengers.adults++
      } else if (type === "children" && newPassengers.children < 4) {
        newPassengers.children++
      } else if (type === "infants" && newPassengers.infants < 4) {
        newPassengers.infants++
      }
    } else {
      if (type === "adults" && newPassengers.adults > 1) {
        newPassengers.adults--
      } else if (type === "children" && newPassengers.children > 0) {
        newPassengers.children--
      } else if (type === "infants" && newPassengers.infants > 0) {
        newPassengers.infants--
      }
    }

    // Ensure total passengers don't exceed 9
    const total = newPassengers.adults + newPassengers.children + newPassengers.infants
    if (total <= 9) {
      setPassengers(newPassengers)
      onChange?.(newPassengers)
    }
  }

  const getTotalPassengers = () => {
    return passengers.adults + passengers.children + passengers.infants
  }

  const getPassengerText = () => {
    const total = getTotalPassengers()
    if (total === 1) return "1 Passenger"

    const parts = []
    if (passengers.adults > 0) parts.push(`${passengers.adults} Adult${passengers.adults > 1 ? "s" : ""}`)
    if (passengers.children > 0) parts.push(`${passengers.children} Child${passengers.children > 1 ? "ren" : ""}`)
    if (passengers.infants > 0) parts.push(`${passengers.infants} Infant${passengers.infants > 1 ? "s" : ""}`)

    return parts.join(", ")
  }

  const PassengerRow = ({
    type,
    label,
    description,
    count,
    min = 0,
    max = 9,
  }: {
    type: keyof PassengerCounts
    label: string
    description: string
    count: number
    min?: number
    max?: number
  }) => (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1">
        <div className="font-medium text-gray-900 dark:text-gray-100">{label}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">{description}</div>
      </div>
      <div className="flex items-center space-x-3">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full border-grassland-300 hover:bg-grassland-50 dark:border-grassland-600 dark:hover:bg-grassland-900 dark:text-gray-100"
          onClick={() => updatePassengers(type, false)}
          disabled={count <= min}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-8 text-center font-medium text-grassland-600 dark:text-grassland-400">{count}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full border-grassland-300 hover:bg-grassland-50 dark:border-grassland-600 dark:hover:bg-grassland-900 dark:text-gray-100"
          onClick={() => updatePassengers(type, true)}
          disabled={count >= max || getTotalPassengers() >= 9}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )

  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Passengers</label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal h-12 px-4 border-gray-300 dark:border-gray-600 hover:border-grassland-400 dark:hover:border-grassland-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <Users className="mr-3 h-4 w-4 text-grassland-600 dark:text-grassland-400" />
            <span>{getPassengerText()}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-80 p-0 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          align="start"
        >
          <div className="p-4">
            <div className="space-y-1">
              <PassengerRow
                type="adults"
                label="Adults (12+ years)"
                description="Day of travel"
                count={passengers.adults}
                min={1}
                max={9}
              />
              <div className="border-t border-gray-200 dark:border-gray-700" />
              <PassengerRow
                type="children"
                label="Children (2-12 years)"
                description="Day of travel"
                count={passengers.children}
                min={0}
                max={4}
              />
              <div className="border-t border-gray-200 dark:border-gray-700" />
              <PassengerRow
                type="infants"
                label="Infants (Under 2 years)"
                description="Day of travel"
                count={passengers.infants}
                min={0}
                max={4}
              />
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                Total number of passengers must be between 1 and 9
              </p>
              <Button
                className="w-full bg-grassland-600 hover:bg-grassland-700 text-white"
                onClick={() => setIsOpen(false)}
              >
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

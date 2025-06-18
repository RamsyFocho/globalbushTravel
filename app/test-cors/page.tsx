"use client"

import { useState } from "react"
import { LocationAutocomplete } from "@/components/location-autocomplete"
import { FlightSearchForm } from "@/components/flight-search-form"
import { type LocationSuggestion } from "@/lib/api/flight-service"

export default function TestCORSPage() {
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [selectedOrigin, setSelectedOrigin] = useState<LocationSuggestion | null>(null)
  const [selectedDestination, setSelectedDestination] = useState<LocationSuggestion | null>(null)
  const [testResults, setTestResults] = useState<string[]>([])
  const [searchParams, setSearchParams] = useState<any>(null)

  const handleOriginChange = (value: string, location?: LocationSuggestion) => {
    setOrigin(value)
    setSelectedOrigin(location || null)
    
    if (location) {
      setTestResults(prev => [...prev, `✅ Origin selected: ${location.display_name}`])
    }
  }

  const handleDestinationChange = (value: string, location?: LocationSuggestion) => {
    setDestination(value)
    setSelectedDestination(location || null)
    
    if (location) {
      setTestResults(prev => [...prev, `✅ Destination selected: ${location.display_name}`])
    }
  }

  const handleFlightSearch = (params: any) => {
    setSearchParams(params)
    setTestResults(prev => [...prev, `✅ Flight search initiated with cabin class: ${params.cabinClass}`])
    setTestResults(prev => [...prev, `📍 From: ${params.from} To: ${params.to}`])
    setTestResults(prev => [...prev, `📅 Departure: ${params.departureDate}`])
    if (params.returnDate) {
      setTestResults(prev => [...prev, `📅 Return: ${params.returnDate}`])
    }
  }

  const testLocationSearch = async () => {
    setTestResults([])
    
    try {
      setTestResults(prev => [...prev, "🔍 Testing location search..."])
      
      const response = await fetch(`/api/locations/search?q=dou`)
      
      if (!response.ok) {
        setTestResults(prev => [...prev, `❌ API Error: ${response.status} ${response.statusText}`])
        return
      }
      
      const data = await response.json()
      setTestResults(prev => [...prev, `✅ API Response: ${data.locations?.length || 0} locations found`])
      
      if (data.locations?.length > 0) {
        setTestResults(prev => [...prev, `📍 First result: ${data.locations[0].display_name}`])
      }
      
    } catch (error) {
      setTestResults(prev => [...prev, `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`])
    }
  }

  const testFlightSearch = async () => {
    if (!searchParams) {
      setTestResults(prev => [...prev, "❌ No search parameters available. Please search for flights first."])
      return
    }

    setTestResults([])
    
    try {
      setTestResults(prev => [...prev, "🔍 Testing flight search..."])
      
      const response = await fetch(`/api/flights/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          origin: searchParams.from,
          destination: searchParams.to,
          departureDate: searchParams.departureDate,
          returnDate: searchParams.returnDate,
          passengers: searchParams.passengers,
          cabinClass: searchParams.cabinClass,
        }),
      })
      
      if (!response.ok) {
        setTestResults(prev => [...prev, `❌ Flight Search API Error: ${response.status} ${response.statusText}`])
        return
      }
      
      const data = await response.json()
      setTestResults(prev => [...prev, `✅ Flight Search API Response: ${data.flights?.length || 0} flights found`])
      
      if (data.flights?.length > 0) {
        setTestResults(prev => [...prev, `📍 First flight: ${data.flights[0].airline} ${data.flights[0].flightNumber}`])
        setTestResults(prev => [...prev, `💰 Price: $${data.flights[0].price} (${data.flights[0].class})`])
      }
      
    } catch (error) {
      setTestResults(prev => [...prev, `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`])
    }
  }

  const testDuffelAPI = async () => {
    setTestResults([])
    
    try {
      setTestResults(prev => [...prev, "🔍 Testing Duffel API directly..."])
      
      const response = await fetch(`/api/test-locations`)
      
      if (!response.ok) {
        setTestResults(prev => [...prev, `❌ Duffel API Error: ${response.status} ${response.statusText}`])
        return
      }
      
      const data = await response.json()
      
      if (data.success) {
        setTestResults(prev => [...prev, `✅ Duffel API working`])
        setTestResults(prev => [...prev, `📍 Suggestions: ${data.suggestions.data?.data?.length || 0} results`])
        setTestResults(prev => [...prev, `📍 Airports: ${data.airports.data?.data?.length || 0} results`])
      } else {
        setTestResults(prev => [...prev, `❌ Duffel API Error: ${data.error}`])
      }
      
    } catch (error) {
      setTestResults(prev => [...prev, `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`])
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Flight Search & Location Autocomplete Test Page</h1>
      
      <div className="space-y-6">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Test APIs</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Test the various APIs and functionality.
          </p>
          
          <div className="space-x-2">
            <button
              onClick={testLocationSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Test Location API
            </button>
            
            <button
              onClick={testFlightSearch}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Test Flight Search
            </button>
            
            <button
              onClick={testDuffelAPI}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Test Duffel API
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Location Autocomplete Test</h2>
            <LocationAutocomplete
              id="test-origin"
              label="From"
              placeholder="Search for a city or airport..."
              value={origin}
              onChange={handleOriginChange}
            />
            
            <LocationAutocomplete
              id="test-destination"
              label="To"
              placeholder="Search for a city or airport..."
              value={destination}
              onChange={handleDestinationChange}
            />
            
            {(selectedOrigin || selectedDestination) && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm font-medium">Selected Locations:</p>
                {selectedOrigin && <p className="text-sm">From: {selectedOrigin.display_name}</p>}
                {selectedDestination && <p className="text-sm">To: {selectedDestination.display_name}</p>}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Flight Search Form Test</h2>
            <FlightSearchForm
              onSearch={handleFlightSearch}
              initialValues={{
                from: origin,
                to: destination,
                cabinClass: "business"
              }}
            />
            
            {searchParams && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm font-medium">Search Parameters:</p>
                <p className="text-sm">From: {searchParams.from}</p>
                <p className="text-sm">To: {searchParams.to}</p>
                <p className="text-sm">Departure: {searchParams.departureDate}</p>
                <p className="text-sm">Cabin Class: {searchParams.cabinClass}</p>
                <p className="text-sm">Passengers: {searchParams.passengers}</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Test Results</h2>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg min-h-[200px]">
            {testResults.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No test results yet. Click test buttons to start.</p>
            ) : (
              <div className="space-y-1">
                {testResults.map((result, index) => (
                  <p key={index} className="text-sm font-mono">{result}</p>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">New Features</h3>
          <ul className="text-sm space-y-1">
            <li>✅ <strong>Cabin Class Selection:</strong> Choose from Economy, Premium Economy, Business, or First Class</li>
            <li>✅ <strong>Flight Search:</strong> Real flight search functionality with API integration</li>
            <li>✅ <strong>Better Selection:</strong> Click any suggestion to select it</li>
            <li>✅ <strong>Free Typing:</strong> Input doesn't get blocked or hindered</li>
            <li>✅ <strong>Keyboard Navigation:</strong> Use arrow keys and Enter to navigate</li>
            <li>✅ <strong>Clear Button:</strong> X button to clear the input</li>
            <li>✅ <strong>Visual Feedback:</strong> Blue border when suggestions are shown</li>
            <li>✅ <strong>Improved UX:</strong> Better focus and blur handling</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 
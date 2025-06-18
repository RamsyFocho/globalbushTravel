"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Breadcrumb } from "@/components/breadcrumb"
import { toast } from "react-toastify"

export default function DemoPage() {
  const showSuccessToast = () => {
    toast.success("Booking confirmed successfully! 🎉")
  }

  const showErrorToast = () => {
    toast.error("Failed to process payment. Please try again.")
  }

  const showInfoToast = () => {
    toast.info("Your flight search is in progress...")
  }

  const showWarningToast = () => {
    toast.warning("Please complete all required fields before proceeding.")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb className="mb-6" />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Demo Page</h1>
        <p className="text-gray-600 dark:text-gray-400">Test the toast notification system and theme toggle</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Toast Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={showSuccessToast} className="w-full bg-green-600 hover:bg-green-700">
              Show Success Toast
            </Button>
            <Button onClick={showErrorToast} className="w-full bg-red-600 hover:bg-red-700">
              Show Error Toast
            </Button>
            <Button onClick={showInfoToast} className="w-full bg-blue-600 hover:bg-blue-700">
              Show Info Toast
            </Button>
            <Button onClick={showWarningToast} className="w-full bg-yellow-600 hover:bg-yellow-700">
              Show Warning Toast
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Theme Toggle</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Use the theme toggle in the navigation bar to switch between light and dark modes. All components are
              designed to work seamlessly in both themes.
            </p>
            <div className="p-4 bg-grassland-50 dark:bg-grassland-900 rounded-lg">
              <p className="text-grassland-800 dark:text-grassland-200">
                This box demonstrates how the grassland theme colors adapt to both light and dark modes.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

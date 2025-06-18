import type { Metadata } from "next"
import { Breadcrumb } from "@/components/breadcrumb"
import { VisaServicesContent } from "@/components/visa-services-content"
import { StructuredData, organizationSchema } from "@/components/structured-data"
import { generateMetadata, seoPages } from "@/lib/seo/metadata"

export const metadata: Metadata = generateMetadata(seoPages.visa)

export default function VisaPage() {
  return (
    <>
      <StructuredData data={organizationSchema} />
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb className="mb-6" />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Visa Services</h1>
          <p className="text-gray-600 dark:text-gray-400">Let us help you with your visa application process</p>
        </div>

        <VisaServicesContent />
      </div>
    </>
  )
}

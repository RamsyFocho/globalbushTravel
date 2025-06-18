import type { Metadata } from "next"
import { Breadcrumb } from "@/components/breadcrumb"
import { TransferOptions } from "@/components/transfer-options"
import { StructuredData, organizationSchema } from "@/components/structured-data"
import { generateMetadata, seoPages } from "@/lib/seo/metadata"

export const metadata: Metadata = generateMetadata(seoPages.transfers)

export default function TransfersPage() {
  return (
    <>
      <StructuredData data={organizationSchema} />
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb className="mb-6" />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Airport Transfers</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Comfortable and reliable transportation to and from the airport
          </p>
        </div>

        <TransferOptions />
      </div>
    </>
  )
}

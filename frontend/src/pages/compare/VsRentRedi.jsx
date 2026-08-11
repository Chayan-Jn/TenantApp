import React from 'react'
import CompareTemplate from './CompareTemplate'

export default function VsRentRedi() {
  return (
    <CompareTemplate
      competitor="RentRedi"
      title="MyTenant vs RentRedi - The Ultimate Comparison for Landlords"
      description="Compare MyTenant vs RentRedi. Discover why landlords who hate outdated apps choose MyTenant for automated ledgers and seamless tenant communication."
      keywords="RentRedi alternative, RentRedi vs MyTenant, RentRedi Competitors, RentRedi Pricing, Landlord App"
      canonical="/compare/mytenant-vs-rentredi"
      competitorWeakness="RentRedi forces tenants to download a mobile app to pay rent, causing friction and delayed payments for many landlords."
      ourStrength="MyTenant offers a friction-free, mobile-optimized web portal. Tenants can pay in 1-click without downloading any heavy apps."
      disclaimer="RentRedi is a registered trademark of RentRedi, Inc. MyTenant is an independent software provider."
      pricingComparison={{
        competitor: "$19.95/month (annual plan)",
        us: "Zero setup fees, straightforward flat pricing"
      }}
    />
  )
}

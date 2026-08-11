import React from 'react'
import CompareTemplate from './CompareTemplate'

export default function VsYardi() {
  return (
    <CompareTemplate
      competitor="Yardi Breeze"
      title="MyTenant vs Yardi Breeze - Better Software for Independent Landlords"
      description="Tired of Yardi Breeze? MyTenant is the modern, lightning-fast alternative for independent landlords who want simplicity without the enterprise bloat."
      keywords="Yardi Breeze alternative, Yardi vs MyTenant, Yardi Competitors, Property Management Software"
      canonical="/compare/mytenant-vs-yardi"
      competitorWeakness="Yardi is built for massive enterprise corporations. It is extremely expensive, bloated, and requires a high minimum monthly spend."
      ourStrength="MyTenant is designed specifically for independent landlords. It's lightning fast, easy to learn in 5 minutes, and has zero enterprise bloat."
      disclaimer="Yardi and Yardi Breeze are registered trademarks of Yardi Systems, Inc. MyTenant is an independent software provider."
      pricingComparison={{
        competitor: "Minimum $100/month",
        us: "Start for free, scale affordably"
      }}
    />
  )
}

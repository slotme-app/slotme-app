import { createFileRoute } from '@tanstack/react-router'
import MarketingLanding from '@/pages/MarketingLanding'

export const Route = createFileRoute('/marketing')({
  component: MarketingLanding,
})

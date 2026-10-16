import { PAGE_METADATA } from "@/constants/metadata";
import { LandingPage } from "@/features/landing/components/landing-page";

export const metadata = PAGE_METADATA.landing;

export default function HomePage() {
  return <LandingPage />;
}

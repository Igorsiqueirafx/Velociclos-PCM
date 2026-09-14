import HomeHero from './HomeHero'
import FeaturesSection from './FeaturesSection'
import FimatheExperience from './FimatheExperience'
import MediaLogos from './MediaLogos'
import AboutMarcelo from './AboutMarcelo'
import CtaSection from './CtaSection'

export default function Home() {
  return (
    <main className="min-h-screen">
      <HomeHero />
      <FeaturesSection />
      <FimatheExperience />
      <MediaLogos />
      <AboutMarcelo />
      <CtaSection />
    </main>
  )
}
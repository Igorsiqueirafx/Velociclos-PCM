import HomeHero from './HomeHero'
import MediaLogos from './MediaLogos'
import CoursesPreview from './CoursesPreview'
import FeaturesSection from './FeaturesSection'
import CtaSection from './CtaSection'

export default function Home() {
  return (
    <main className="min-h-screen">
      <HomeHero />
      <MediaLogos />
      <CoursesPreview />
      <FeaturesSection />
      <CtaSection />
    </main>
  )
}

import HeroSection from '../components/landing/HeroSection';
import StatsSection from '../components/landing/StatsSection';
import BentoGrid from '../components/landing/BentoGrid';
import CycleSection from '../components/landing/CycleSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';

export default function Index() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <BentoGrid />
      <CycleSection />
      <TestimonialsSection />
    </>
  );
}

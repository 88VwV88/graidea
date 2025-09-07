import React from 'react';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import CoursesPreview from './CoursesPreview';
import TestimonialsSection from './TestimonialsSection';
import CTA from './CTA';
import Footer from './Footer';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <FeaturesSection />
      <CoursesPreview />
      <TestimonialsSection />
      <CTA />
      <Footer />
    </div>
  );
};

export default LandingPage;

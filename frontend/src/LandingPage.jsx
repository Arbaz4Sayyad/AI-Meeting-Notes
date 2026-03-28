import React from 'react';
import Navbar from './components/layout/Navbar';
import Hero from './components/sections/Hero';
import ProblemSolution from './components/sections/ProblemSolution';
import Features from './components/sections/Features';
import HowItWorks from './components/sections/HowItWorks';
import UseCases from './components/sections/UseCases';
import TechStack from './components/sections/TechStack';
import ArchitectureHighlight from './components/sections/ArchitectureHighlight';
import Security from './components/sections/Security';
import FinalCTA from './components/sections/FinalCTA';
import Footer from './components/layout/Footer';
import BackToTop from './components/common/BackToTop';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <ProblemSolution />
      <Features />
      <HowItWorks />
      <UseCases />
      <TechStack />
      <ArchitectureHighlight />
      <Security />
      <FinalCTA />
      <Footer />
      <BackToTop />
    </div>
  );
};

export default LandingPage;

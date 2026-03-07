'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle, Sliders, Code, ArrowRight } from 'lucide-react';
import Scene from '@/components/landing/Scene';
import PremiumNavbar from '@/components/landing/PremiumNavbar';
import FeatureCard from '@/components/landing/FeatureCard';
import FAQAccordion from '@/components/landing/FAQAccordion';

export default function Home() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    };
    checkMobile();

    // Track active section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const features = [
    {
      icon: <CheckCircle size={32} />,
      title: 'Conservative Evaluation',
      description: 'Multi-agent simulation evaluates your idea with realistic, defensible criteria. No fantasy projections.',
    },
    {
      icon: <Sliders size={32} />,
      title: 'Quality Gates',
      description: 'Hard blocks prevent MVP generation unless your idea meets minimum viability standards.',
    },
    {
      icon: <Code size={32} />,
      title: 'Automated MVP Generation',
      description: 'Generate functional, executable MVPs from templates. Download and start building immediately.',
    },
  ];

  const faqItems = [
    {
      question: 'How does the evaluation process work?',
      answer: 'Our multi-agent system simulates different perspectives (market, technical, financial, product) to provide comprehensive feedback on your business idea.',
    },
    {
      question: "What happens if my idea doesn't pass quality gates?",
      answer: "You'll receive detailed feedback on why your idea didn't meet viability standards, with suggestions for improvement before attempting MVP generation.",
    },
    {
      question: 'Can I customize the generated MVP?',
      answer: 'Yes! The generated MVP is fully functional and downloadable. You can modify the code to fit your specific needs.',
    },
  ];

  return (
    <div
      className="relative min-h-screen"
      style={{
        backgroundImage: 'url(/schematic-bg.jpg)',
        backgroundAttachment: isMobile ? 'scroll' : 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#000',
      }}
    >
      {/* Global dark overlay for background opacity */}
      <div className="fixed inset-0 bg-black/60 pointer-events-none z-0" />
      {/* Navbar */}
      <PremiumNavbar activeSection={activeSection} />

      {/* Scene 1: Hero */}
      <Scene
        id="hero"
        gradient={{ from: 'from-black/40', to: 'to-black/20', direction: 'to-b' }}
        radialGlow={{ color: 'blue-500', position: 'center', intensity: 'medium' }}
        noiseTexture={false}
      >
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Validate & Build Your
              <span className="block bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Digital Business
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl mx-auto">
              A conservative digital incubator that validates your business idea with realistic criteria and generates functional MVPs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="
                  group px-8 py-4 rounded-lg
                  bg-white/10 backdrop-blur-md
                  border border-white/20
                  text-white text-lg font-semibold
                  hover:bg-white/20
                  transition-all duration-200
                  shadow-2xl
                  flex items-center justify-center gap-2
                "
              >
                Start Now
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
              <Link
                href="/login"
                className="
                  px-8 py-4 rounded-lg
                  bg-white/5 backdrop-blur-md
                  border border-white/10
                  text-white text-lg font-semibold
                  hover:bg-white/10
                  transition-all duration-200
                "
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </Scene>

      {/* Scene 2: Features */}
      <Scene
        id="features"
        gradient={{ from: 'from-black/50', to: 'to-black/30', direction: 'to-b' }}
        radialGlow={{ color: 'purple-500', position: 'top-right', intensity: 'low' }}
      >
        <div className="flex items-center justify-center min-h-screen px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                A Better Way to Validate Ideas
              </h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                Conservative evaluation, realistic criteria, and automated MVP generation.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <FeatureCard key={index} {...feature} />
              ))}
            </div>
          </div>
        </div>
      </Scene>

      {/* Scene 3: About */}
      <Scene
        id="about"
        gradient={{ from: 'from-black/40', to: 'to-black/20', direction: 'to-b' }}
        radialGlow={{ color: 'blue-400', position: 'bottom-left', intensity: 'low' }}
      >
        <div className="flex items-center justify-center min-h-screen px-4 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              No Hype, Just Honest Evaluation
            </h2>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-8">
              Forgeon is a conservative digital incubator designed to give you realistic feedback on your business ideas. 
              We use multi-agent simulation to evaluate your concept from market, technical, financial, and product perspectives.
            </p>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed">
              If your idea passes our quality gates, we'll help you generate a functional MVP. 
              If it doesn't, we'll tell you why and help you improve it. No fantasy projections, just honest assessment.
            </p>
          </div>
        </div>
      </Scene>

      {/* Scene 4: FAQ */}
      <Scene
        id="faq"
        gradient={{ from: 'from-black/40', to: 'to-black/20', direction: 'to-b' }}
      >
        <div className="flex items-center justify-center min-h-screen px-4 py-20">
          <div className="max-w-4xl mx-auto w-full">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-white/70">
                Everything you need to know about Forgeon
              </p>
            </div>
            <FAQAccordion items={faqItems} />
          </div>
        </div>
      </Scene>

      {/* Scene 5: Final CTA with custom background */}
      <section
        id="cta"
        className="relative min-h-screen w-full overflow-hidden"
        style={{
          backgroundImage: 'url(/fondo_start_now.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/70 pointer-events-none" />
        
        {/* Radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600 blur-3xl rounded-full opacity-30 pointer-events-none" />
        
        {/* Content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Ready to Validate Your Idea?
            </h2>
            <p className="text-xl md:text-2xl text-white/80 mb-10">
              Start with our structured wizard and get honest feedback on your business concept.
            </p>
            <Link
              href="/register"
              className="
                inline-flex items-center gap-3
                px-10 py-5 rounded-lg
                bg-white/10 backdrop-blur-md
                border border-white/20
                text-white text-xl font-bold
                hover:bg-white/20
                transition-all duration-200
                shadow-2xl
                hover:scale-105
              "
            >
              Get Started for Free
              <ArrowRight size={24} />
            </Link>
            <p className="mt-6 text-white/60 text-sm">
              No credit card required • Start building in minutes
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Galaxy from '../components/Galaxy.jsx';
import Navbar from '../components/Navbar.jsx';
import Docs from "../assests/Docs.pdf"

export default function Landing() {
  const [currentSection, setCurrentSection] = useState('hero');

  const sections = [
    { id: 'hero', label: 'Home' },
    { id: 'tech', label: 'Tech Stack' },
    { id: 'features', label: 'Features' },
    { id: 'contents', label: 'Table of Contents' },
    { id: 'covers', label: 'What We Cover' },
    { id: 'mission', label: 'Our Mission' },
    { id: 'role', label: 'Your Role' }
  ];

  const scrollToSection = (sectionId) => {
    setCurrentSection(sectionId);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  // Update current section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setCurrentSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-slate-200 overflow-x-hidden">
      <Navbar />
      
      {/* Galaxy background - fixed positioning with fallback black background */}
      <div className="fixed inset-0 z-0 bg-black">
        <Galaxy mouseRepulsion density={1} glowIntensity={0.6} saturation={0.6} hueShift={150} />
      </div>

      {/* Navigation Buttons - Fixed on right side */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={`
              px-3 py-2 rounded-l-lg text-xs font-semibold transition-all duration-300
              ${currentSection === section.id 
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/50 translate-x-0' 
                : 'bg-white/10 text-slate-300 hover:bg-white/20 translate-x-8 hover:translate-x-0'
              }
            `}
          >
            {section.label}
          </button>
        ))}
      </div>
      
      {/* Main content container - GPU accelerated */}
      <main className="relative z-10 will-change-scroll" style={{ transform: 'translateZ(0)' }}>
        
        {/* HERO SECTION */}
        <section id="hero" className="min-h-screen flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm md:text-base text-emerald-400 font-semibold tracking-wider uppercase mb-4">
              AI-Powered Collections Agent Trainer 
            </p>
            
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight mb-6">
              Train smarter. Speak better. Collect faster.
            </h1>
            
            <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto mb-8">
              A voice-based AI simulator that helps loan collection agents master empathy, compliance, and negotiation—on one platform.
            </p>
            
            <div className="flex items-center gap-3 justify-center">
              <Link to="/trainer" className="px-6 py-3 rounded-lg bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/30">
                Start Training
              </Link>
              <a href={Docs} target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-lg border border-white/20 hover:bg-white/10 transition backdrop-blur-sm">
                View Training Manual
              </a>
            </div>
          </div>
        </section>

        {/* TECH STACK SECTION */}
        <section id="tech" className="min-h-screen flex items-center justify-center px-4 py-20 bg-black/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white text-center mb-4">
              Our Tech Stack
            </h2>
            <p className="text-center text-slate-400 mb-12">Powered by cutting-edge AI and modern web technologies</p>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Frontend */}
              <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6 hover:bg-white/10 transition">
                <div className="text-3xl mb-4">⚛️</div>
                <h3 className="text-xl font-bold text-emerald-400 mb-3">Frontend</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• React 18 with Hooks</li>
                  <li>• Vite for fast development</li>
                  <li>• Tailwind CSS for styling</li>
                  <li>• React Router for navigation</li>
                  <li>• Web Speech API (STT/TTS)</li>
                  <li>• OGL for 3D graphics</li>
                </ul>
              </div>

              {/* Backend */}
              <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6 hover:bg-white/10 transition">
                <div className="text-3xl mb-4">🚀</div>
                <h3 className="text-xl font-bold text-cyan-400 mb-3">Backend</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• Node.js + Express</li>
                  <li>• Google Gemini 1.5 Flash</li>
                  <li>• MongoDB Atlas</li>
                  <li>• RESTful API design</li>
                  <li>• In-memory fallback</li>
                  <li>• CORS enabled</li>
                </ul>
              </div>

              {/* AI & Features */}
              <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6 hover:bg-white/10 transition">
                <div className="text-3xl mb-4">🤖</div>
                <h3 className="text-xl font-bold text-violet-400 mb-3">AI & Features</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• Real-time voice recognition</li>
                  <li>• Natural language processing</li>
                  <li>• Persona-based responses</li>
                  <li>• Progressive training system</li>
                  <li>• Smart evaluation rubric</li>
                  <li>• LocalStorage persistence</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="min-h-screen flex items-center justify-center px-4 py-20 bg-black/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white text-center mb-4">
              Our Features
            </h2>
            <p className="text-center text-slate-400 mb-12">Everything you need to become a professional collection specialist</p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 backdrop-blur border border-emerald-500/20 rounded-xl p-6">
                <div className="text-3xl mb-3">🎙️</div>
                <h3 className="text-xl font-bold text-white mb-2">Voice-Based Training</h3>
                <p className="text-sm text-slate-300">Practice real conversations with AI-powered borrower simulations using speech recognition and text-to-speech.</p>
              </div>

              <div className="bg-gradient-to-br from-violet-500/10 to-pink-500/10 backdrop-blur border border-violet-500/20 rounded-xl p-6">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="text-xl font-bold text-white mb-2">Progressive Training System</h3>
                <p className="text-sm text-slate-300">Master diverse borrower personas with structured training scenarios designed by industry experts.</p>
              </div>

              <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur border border-cyan-500/20 rounded-xl p-6">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="text-xl font-bold text-white mb-2">Detailed Scoring System</h3>
                <p className="text-sm text-slate-300">Get evaluated on Persuasion, Empathy, and Negotiation with scores out of 100 each (300 total).</p>
              </div>

              <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur border border-amber-500/20 rounded-xl p-6">
                <div className="text-3xl mb-3">🏆</div>
                <h3 className="text-xl font-bold text-white mb-2">Real-Time Progress Tracking</h3>
                <p className="text-sm text-slate-300">View your performance metrics and track improvement across training sessions with automatic dashboard updates.</p>
              </div>

              <div className="bg-gradient-to-br from-pink-500/10 to-rose-500/10 backdrop-blur border border-pink-500/20 rounded-xl p-6">
                <div className="text-3xl mb-3">⚖️</div>
                <h3 className="text-xl font-bold text-white mb-2">Compliance Training</h3>
                <p className="text-sm text-slate-300">Learn FDCPA regulations, ethical collection practices, and how to handle legal scenarios professionally.</p>
              </div>

              <div className="bg-gradient-to-br from-green-500/10 to-teal-500/10 backdrop-blur border border-green-500/20 rounded-xl p-6">
                <div className="text-3xl mb-3">💡</div>
                <h3 className="text-xl font-bold text-white mb-2">AI-Powered Feedback</h3>
                <p className="text-sm text-slate-300">Receive personalized suggestions and actionable tips powered by Google Gemini AI to improve your collection skills.</p>
              </div>
            </div>
          </div>
        </section>

        {/* TABLE OF CONTENTS SECTION */}
        <section id="contents" className="min-h-screen flex items-center justify-center px-4 py-20 bg-black/50 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white text-center mb-4">
              Table of Contents
            </h2>
            <p className="text-center text-slate-400 mb-12">Complete Training Manual for Collection Specialists</p>
            
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-8">
              <ol className="space-y-4 text-slate-200">
                <li className="flex items-start gap-3 hover:text-emerald-400 transition cursor-pointer">
                  <span className="font-bold text-emerald-400 min-w-[2rem]">1.</span>
                  <span className="text-lg">Welcome to Your New Career</span>
                </li>
                <li className="flex items-start gap-3 hover:text-emerald-400 transition cursor-pointer">
                  <span className="font-bold text-emerald-400 min-w-[2rem]">2.</span>
                  <span className="text-lg">Understanding Debt and Why It Matters</span>
                </li>
                <li className="flex items-start gap-3 hover:text-emerald-400 transition cursor-pointer">
                  <span className="font-bold text-emerald-400 min-w-[2rem]">3.</span>
                  <span className="text-lg">The Solution: Professional Debt Collection</span>
                </li>
                <li className="flex items-start gap-3 hover:text-emerald-400 transition cursor-pointer">
                  <span className="font-bold text-emerald-400 min-w-[2rem]">4.</span>
                  <span className="text-lg">The Regulatory Landscape: Your Legal Foundation</span>
                </li>
                <li className="flex items-start gap-3 hover:text-emerald-400 transition cursor-pointer">
                  <span className="font-bold text-emerald-400 min-w-[2rem]">5.</span>
                  <span className="text-lg">Third-Party Debt Collection Explained</span>
                </li>
                <li className="flex items-start gap-3 hover:text-slate-500 transition line-through">
                  <span className="font-bold text-slate-600 min-w-[2rem]">6.</span>
                  <span className="text-lg text-slate-600">Toll Debt: Understanding What We Collect (Skipped)</span>
                </li>
                <li className="flex items-start gap-3 hover:text-emerald-400 transition cursor-pointer">
                  <span className="font-bold text-emerald-400 min-w-[2rem]">7.</span>
                  <span className="text-lg">The Art of the Collection Call</span>
                </li>
                <li className="flex items-start gap-3 hover:text-emerald-400 transition cursor-pointer">
                  <span className="font-bold text-emerald-400 min-w-[2rem]">8.</span>
                  <span className="text-lg">Essential Rules and Best Practices</span>
                </li>
                <li className="flex items-start gap-3 hover:text-emerald-400 transition cursor-pointer">
                  <span className="font-bold text-emerald-400 min-w-[2rem]">9.</span>
                  <span className="text-lg">Compliance Checklist and Quick Reference</span>
                </li>
                <li className="flex items-start gap-3 hover:text-emerald-400 transition cursor-pointer">
                  <span className="font-bold text-emerald-400 min-w-[2rem]">10.</span>
                  <span className="text-lg">Scenarios and Role-Playing Exercises</span>
                </li>
              </ol>
            </div>
          </div>
        </section>

        {/* WHAT THIS MANUAL COVERS SECTION */}
        <section id="covers" className="min-h-screen flex items-center justify-center px-4 py-20 bg-black/50 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white text-center mb-4">
              What This Manual Covers
            </h2>
            <p className="text-center text-slate-300 mb-8 text-lg">
              This isn't just a rule book. This is your roadmap to understanding:
            </p>
            
            <div className="bg-gradient-to-br from-emerald-500/10 via-cyan-500/10 to-violet-500/10 backdrop-blur border border-white/10 rounded-xl p-8">
              <ul className="space-y-4 text-slate-200">
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 text-xl mt-1">✓</span>
                  <span className="text-lg">Why unpaid debt is a serious problem for everyone involved</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 text-xl mt-1">✓</span>
                  <span className="text-lg">How you, as a collection specialist, provide a valuable solution</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 text-xl mt-1">✓</span>
                  <span className="text-lg">The laws and regulations that govern what we do</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 text-xl mt-1">✓</span>
                  <span className="text-lg">The conversation skills you need to succeed every single day</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 text-xl mt-1">✓</span>
                  <span className="text-lg">How to handle real situations with confidence and professionalism</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* OUR MISSION SECTION */}
        <section id="mission" className="min-h-screen flex items-center justify-center px-4 py-20 bg-black/50 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white text-center mb-4">
              Our Mission at Resolve First Collections
            </h2>
            <p className="text-center text-slate-300 mb-8 text-lg">
              We believe that resolving debt is about more than just collecting money. It's about:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur border border-emerald-500/30 rounded-xl p-6 hover:border-emerald-500/50 transition">
                <div className="text-3xl mb-3">🤝</div>
                <h3 className="text-xl font-bold text-emerald-400 mb-2">Helping Consumers</h3>
                <p className="text-slate-300">Helping consumers clear obligations that can damage their financial future</p>
              </div>

              <div className="bg-white/5 backdrop-blur border border-cyan-500/30 rounded-xl p-6 hover:border-cyan-500/50 transition">
                <div className="text-3xl mb-3">🚗</div>
                <h3 className="text-xl font-bold text-cyan-400 mb-2">Supporting Our Clients</h3>
                <p className="text-slate-300">Supporting our clients who provide essential transportation infrastructure</p>
              </div>

              <div className="bg-white/5 backdrop-blur border border-violet-500/30 rounded-xl p-6 hover:border-violet-500/50 transition">
                <div className="text-3xl mb-3">💼</div>
                <h3 className="text-xl font-bold text-violet-400 mb-2">Business Integrity</h3>
                <p className="text-slate-300">Conducting business with integrity, empathy, and professionalism</p>
              </div>

              <div className="bg-white/5 backdrop-blur border border-amber-500/30 rounded-xl p-6 hover:border-amber-500/50 transition">
                <div className="text-3xl mb-3">⚖️</div>
                <h3 className="text-xl font-bold text-amber-400 mb-2">Fair Solutions</h3>
                <p className="text-slate-300">Finding solutions that work for everyone involved</p>
              </div>
            </div>
          </div>
        </section>

        {/* YOUR ROLE MATTERS SECTION */}
        <section id="role" className="min-h-screen flex items-center justify-center px-4 py-20 bg-black/50 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white text-center mb-4">
              Your Role Matters
            </h2>
            <p className="text-center text-slate-300 mb-8 text-lg">
              As a collection specialist, you're not just making phone calls. You're:
            </p>
            
            <div className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 backdrop-blur border border-white/10 rounded-xl p-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-emerald-500/20 rounded-lg p-3 text-2xl">🛠️</div>
                <div>
                  <h3 className="text-xl font-bold text-emerald-400 mb-2">A problem solver</h3>
                  <p className="text-slate-300">helping people address financial obligations</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-cyan-500/20 rounded-lg p-3 text-2xl">🏢</div>
                <div>
                  <h3 className="text-xl font-bold text-cyan-400 mb-2">A professional representative</h3>
                  <p className="text-slate-300">representing both Resolve First and our clients</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-violet-500/20 rounded-lg p-3 text-2xl">🛡️</div>
                <div>
                  <h3 className="text-xl font-bold text-violet-400 mb-2">A compliance guardian</h3>
                  <p className="text-slate-300">ensuring every interaction follows the law</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-pink-500/20 rounded-lg p-3 text-2xl">💬</div>
                <div>
                  <h3 className="text-xl font-bold text-pink-400 mb-2">A communication expert</h3>
                  <p className="text-slate-300">who can turn difficult conversations into resolutions</p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 text-center">
                <p className="text-xl font-bold text-white mb-2">Let's begin your journey.</p>
                <Link 
                  to="/trainer"
                  className="inline-block mt-4 px-8 py-3 rounded-lg bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/30"
                >
                  Start Your Training Now →
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronRight, Bitcoin, Shield, TrendingUp, Users, Mail, MapPin, ArrowRight, User, Briefcase, Search } from 'lucide-react';

const DSPCapital = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [btcPrice, setBtcPrice] = useState(null);
  const [priceLoading, setPriceLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [expandedJobs, setExpandedJobs] = useState([]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [currentPage]);

  useEffect(() => {
    const fetchBtcPrice = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
        const data = await response.json();
        setBtcPrice(data.bitcoin.usd);
        setPriceLoading(false);
      } catch (error) {
        console.error('Error fetching BTC price:', error);
        setPriceLoading(false);
      }
    };

    fetchBtcPrice();
    const interval = setInterval(fetchBtcPrice, 30000);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    setIsMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navigateToPage = (page) => {
    setCurrentPage(page);
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const jobOpenings = [
    { id: 1, title: 'Senior Bitcoin Treasury Analyst', department: 'Finance', location: 'Remote', type: 'Full-time', description: 'Lead Bitcoin treasury strategy and analysis for corporate clients.' },
    { id: 2, title: 'Bitcoin Custody Solutions Engineer', department: 'Technology', location: 'New York, NY', type: 'Full-time', description: 'Design and implement secure Bitcoin custody infrastructure.' },
    { id: 3, title: 'Corporate Bitcoin Advisor', department: 'Advisory', location: 'Remote', type: 'Full-time', description: 'Guide businesses through Bitcoin treasury adoption and implementation.' },
    { id: 4, title: 'Compliance Manager - Digital Assets', department: 'Legal', location: 'San Francisco, CA', type: 'Full-time', description: 'Ensure regulatory compliance for Bitcoin treasury operations.' },
    { id: 5, title: 'Bitcoin Research Analyst', department: 'Research', location: 'Remote', type: 'Full-time', description: 'Conduct in-depth research on Bitcoin markets and treasury strategies.' },
    { id: 6, title: 'Client Success Manager', department: 'Client Services', location: 'London, UK', type: 'Full-time', description: 'Support enterprise clients in their Bitcoin treasury journey.' }
  ];

  const filteredJobs = jobOpenings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || job.department === selectedDepartment;
    const matchesLocation = selectedLocation === 'all' || job.location === selectedLocation;
    return matchesSearch && matchesDepartment && matchesLocation;
  });

  const departments = ['all', ...new Set(jobOpenings.map(job => job.department))];
  const locations = ['all', ...new Set(jobOpenings.map(job => job.location))];

  const toggleJob = (jobId) => {
    setExpandedJobs(prev => prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-black/90 backdrop-blur-sm border-b border-orange-500/20' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigateToPage('home')}>
              <div className="w-8 h-8 bg-orange-500 flex items-center justify-center font-bold text-sm">DSP</div>
              <span className="text-xl font-bold tracking-tight">DSP CAPITAL</span>
            </div>

            <div className="hidden lg:flex items-center space-x-8">
              {currentPage === 'home' ? (
                <>
                  {['home', 'why', 'about', 'contact'].map((section) => (
                    <button key={section} onClick={() => scrollToSection(section)} className={`text-sm font-medium transition-colors uppercase tracking-wider ${activeSection === section ? 'text-orange-500' : 'text-gray-400 hover:text-white'}`}>
                      {section === 'home' ? 'Home' : section === 'why' ? 'Why DSP Capital?' : section === 'about' ? 'About' : 'Contact'}
                    </button>
                  ))}
                  <button onClick={() => navigateToPage('history')} className="text-sm font-medium transition-colors uppercase tracking-wider text-gray-400 hover:text-white">History</button>
                  <button onClick={() => navigateToPage('careers')} className="text-sm font-medium transition-colors uppercase tracking-wider text-gray-400 hover:text-white">Careers</button>
                </>
              ) : (
                <button onClick={() => navigateToPage('home')} className="text-sm font-medium transition-colors uppercase tracking-wider text-orange-500 hover:text-orange-400">← Back to Home</button>
              )}
              
              <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-orange-500/30 rounded">
                <Bitcoin className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-semibold text-white">{priceLoading ? '...' : btcPrice ? `$${btcPrice.toLocaleString()}` : 'N/A'}</span>
              </div>
              
              <a href="#" className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-all" title="Login">
                <User className="w-5 h-5" />
              </a>
            </div>

            <button className="lg:hidden p-2 text-orange-500" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden bg-black border-t border-orange-500/20">
            <div className="px-4 py-4 space-y-3">
              {currentPage === 'home' ? (
                <>
                  {['home', 'why', 'about', 'contact'].map((section) => (
                    <button key={section} onClick={() => scrollToSection(section)} className="block w-full text-left px-4 py-2 text-gray-400 hover:text-white hover:bg-zinc-900 transition-colors uppercase tracking-wider text-sm">
                      {section === 'home' ? 'Home' : section === 'why' ? 'Why DSP Capital?' : section === 'about' ? 'About' : 'Contact'}
                    </button>
                  ))}
                  <button onClick={() => navigateToPage('history')} className="block w-full text-left px-4 py-2 text-gray-400 hover:text-white hover:bg-zinc-900 transition-colors uppercase tracking-wider text-sm">History</button>
                  <button onClick={() => navigateToPage('careers')} className="block w-full text-left px-4 py-2 text-gray-400 hover:text-white hover:bg-zinc-900 transition-colors uppercase tracking-wider text-sm">Careers</button>
                </>
              ) : (
                <button onClick={() => navigateToPage('home')} className="block w-full text-left px-4 py-2 text-orange-500 hover:text-white hover:bg-zinc-900 transition-colors uppercase tracking-wider text-sm">← Back to Home</button>
              )}
              <a href="#" className="flex items-center gap-3 px-4 py-2 text-orange-500 hover:text-white hover:bg-zinc-900 transition-colors uppercase tracking-wider text-sm">
                <User className="w-5 h-5" />Login
              </a>
            </div>
          </div>
        )}
      </nav>

      {currentPage === 'home' && (
        <>
          <section id="home" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <div className="inline-block mb-6">
                  <div className="w-16 h-16 bg-orange-500 flex items-center justify-center font-bold text-2xl mx-auto">DSP</div>
                </div>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
                  BITCOIN TREASURY<br /><span className="text-orange-500">MANAGEMENT</span>
                </h1>
                
                <div className="flex justify-center mb-8">
                  <div className="bg-orange-500 px-8 py-4 rounded-lg shadow-lg">
                    <div className="flex items-center gap-3">
                      <Bitcoin className="w-8 h-8 text-white" />
                      <div className="text-left">
                        <p className="text-white text-sm font-medium uppercase tracking-wider">Live Bitcoin Price</p>
                        <p className="text-white text-3xl font-bold">
                          {priceLoading ? 'Loading...' : btcPrice ? `$${btcPrice.toLocaleString()}` : 'Unavailable'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-xl sm:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto font-light">
                  Empowering businesses to adopt Bitcoin as their primary treasury reserve asset
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button onClick={() => scrollToSection('why')} className="px-8 py-4 bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-sm">
                    Learn More <ArrowRight className="w-5 h-5" />
                  </button>
                  <button onClick={() => scrollToSection('contact')} className="px-8 py-4 border-2 border-orange-500 text-orange-500 font-semibold hover:bg-orange-500 hover:text-white transition-all uppercase tracking-wider text-sm">
                    Get Started
                  </button>
                </div>
              </div>
{/* Bitcoin Performance Chart */}
<div className="mt-16 max-w-6xl mx-auto">
  <img 
    src="/images/bitcoin-returns.png" 
    alt="Bitcoin Standard Era Return - Total performance comparison chart" 
    className="w-full h-auto rounded-lg border border-orange-500/20 shadow-2xl"
  />
</div>


              <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-orange-500/20 mt-20">
                <div className="bg-black p-8 hover:bg-zinc-900 transition-all">
                  <Shield className="w-12 h-12 text-orange-500 mb-4" />
                  <h3 className="text-2xl font-bold mb-2 uppercase tracking-tight">Secure</h3>
                  <p className="text-gray-400 font-light">Enterprise-grade Bitcoin custody solutions</p>
                </div>
                <div className="bg-black p-8 hover:bg-zinc-900 transition-all">
                  <TrendingUp className="w-12 h-12 text-orange-500 mb-4" />
                  <h3 className="text-2xl font-bold mb-2 uppercase tracking-tight">Strategic</h3>
                  <p className="text-gray-400 font-light">Long-term value preservation and growth</p>
                </div>
                <div className="bg-black p-8 hover:bg-zinc-900 transition-all">
                  <Users className="w-12 h-12 text-orange-500 mb-4" />
                  <h3 className="text-2xl font-bold mb-2 uppercase tracking-tight">Expert</h3>
                  <p className="text-gray-400 font-light">Specialized Bitcoin treasury expertise</p>
                </div>
              </div>
            </div>
          </section>

          <section id="why" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-orange-500/20">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl sm:text-5xl font-bold mb-12 text-center uppercase tracking-tight">
                Why <span className="text-orange-500">DSP Capital?</span>
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                <div className="bg-zinc-900 p-8 border-l-4 border-orange-500">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 uppercase tracking-tight">
                    <Bitcoin className="w-8 h-8 text-orange-500" />Bitcoin-First Strategy
                  </h3>
                  <p className="text-gray-300 leading-relaxed mb-4 font-light">
                    We specialize exclusively in Bitcoin treasury management, providing deep expertise in the world's most proven digital asset.
                  </p>
                  <p className="text-gray-300 leading-relaxed font-light">
                    Unlike traditional treasury managers, we understand Bitcoin's unique properties as a scarce, decentralized, and deflationary asset.
                  </p>
                </div>

                <div className="bg-zinc-900 p-8 border-l-4 border-orange-500">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 uppercase tracking-tight">
                    <Shield className="w-8 h-8 text-orange-500" />Security & Compliance
                  </h3>
                  <p className="text-gray-300 leading-relaxed mb-4 font-light">
                    Security is paramount. We implement institutional-grade custody solutions and comprehensive risk management frameworks.
                  </p>
                  <p className="text-gray-300 leading-relaxed font-light">
                    Our compliance-first approach ensures your Bitcoin treasury strategy aligns with regulatory requirements.
                  </p>
                </div>
              </div>

              <div className="bg-zinc-900 p-8 sm:p-12 border border-orange-500/20">
                <h3 className="text-2xl font-bold mb-8 uppercase tracking-tight">Key Benefits</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {['Protection against monetary inflation', 'Portfolio diversification with uncorrelated asset', 'Long-term value appreciation potential', 'Enhanced balance sheet strength', 'Strategic competitive advantage', 'Global, borderless treasury solution'].map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-1 h-6 bg-orange-500 flex-shrink-0 mt-1"></div>
                      <span className="text-gray-300 font-light">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-orange-500/20">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl sm:text-5xl font-bold mb-12 text-center uppercase tracking-tight">
                About <span className="text-orange-500">Us</span>
              </h2>
              
              <div className="max-w-4xl mx-auto">
                <div className="bg-zinc-900 p-8 sm:p-12 border-l-4 border-orange-500 mb-12">
                  <h3 className="text-2xl font-bold mb-6 uppercase tracking-tight">Our Mission</h3>
                  <p className="text-gray-300 leading-relaxed mb-4 text-lg font-light">
                    DSP Capital exists to help businesses navigate the transition to a Bitcoin-based treasury strategy.
                  </p>
                  <p className="text-gray-300 leading-relaxed text-lg font-light">
                    Our team combines deep expertise in corporate finance, Bitcoin technology, and treasury management.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-orange-500/20">
                  <div className="bg-black p-8 hover:bg-zinc-900 transition-all">
                    <TrendingUp className="w-12 h-12 text-orange-500 mb-4" />
                    <h3 className="text-xl font-bold mb-3 uppercase tracking-tight">Our Vision</h3>
                    <p className="text-gray-400 font-light">
                      To become the leading advisor for companies transitioning to Bitcoin treasury reserves.
                    </p>
                  </div>

                  <div className="bg-black p-8 hover:bg-zinc-900 transition-all">
                    <Shield className="w-12 h-12 text-orange-500 mb-4" />
                    <h3 className="text-xl font-bold mb-3 uppercase tracking-tight">Our Values</h3>
                    <p className="text-gray-400 font-light">
                      Transparency, security, and long-term thinking guide everything we do.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-orange-500/20">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl sm:text-5xl font-bold mb-12 text-center uppercase tracking-tight">
                Get in <span className="text-orange-500">Touch</span>
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-2xl font-bold mb-6 uppercase tracking-tight">Let's Discuss Your Bitcoin Treasury Strategy</h3>
                  <p className="text-gray-300 mb-8 leading-relaxed font-light">
                    Ready to explore how Bitcoin can strengthen your company's treasury?
                  </p>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <Mail className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold mb-1 uppercase tracking-wider text-sm">Email</h4>
                        <a href="mailto:info@dspcapital.tech" className="text-orange-500 hover:text-orange-400 transition-colors">info@dspcapital.tech</a>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <MapPin className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold mb-1 uppercase tracking-wider text-sm">Location</h4>
                        <p className="text-gray-400 font-light">Global</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-900 p-8 border border-orange-500/20">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 uppercase tracking-wider">Name</label>
                      <input type="text" className="w-full px-4 py-3 bg-black border border-zinc-800 focus:border-orange-500 outline-none transition-all" placeholder="Your name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 uppercase tracking-wider">Email</label>
                      <input type="email" className="w-full px-4 py-3 bg-black border border-zinc-800 focus:border-orange-500 outline-none transition-all" placeholder="your@email.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 uppercase tracking-wider">Company</label>
                      <input type="text" className="w-full px-4 py-3 bg-black border border-zinc-800 focus:border-orange-500 outline-none transition-all" placeholder="Your company" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 uppercase tracking-wider">Message</label>
                      <textarea rows="4" className="w-full px-4 py-3 bg-black border border-zinc-800 focus:border-orange-500 outline-none transition-all resize-none" placeholder="Tell us about your treasury goals..."></textarea>
                    </div>
                    <button onClick={() => alert('Thank you for your interest! Please email us at info@dspcapital.tech')} className="w-full px-8 py-4 bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-all uppercase tracking-wider text-sm">Send Message</button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {currentPage === 'careers' && (
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-center uppercase tracking-tight">
              Join <span className="text-orange-500">Our Team</span>
            </h1>
            <p className="text-xl text-gray-400 text-center mb-12 max-w-3xl mx-auto font-light">
              Help shape the future of Bitcoin treasury management
            </p>

            <div className="bg-zinc-900 p-6 mb-8 border border-orange-500/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" placeholder="Search positions..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-black border border-zinc-800 focus:border-orange-500 outline-none transition-all text-white" />
                </div>
                <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} className="px-4 py-3 bg-black border border-zinc-800 focus:border-orange-500 outline-none transition-all text-white">
                  {departments.map(dept => <option key={dept} value={dept}>{dept === 'all' ? 'All Departments' : dept}</option>)}
                </select>
                <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)} className="px-4 py-3 bg-black border border-zinc-800 focus:border-orange-500 outline-none transition-all text-white">
                  {locations.map(loc => <option key={loc} value={loc}>{loc === 'all' ? 'All Locations' : loc}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredJobs.length === 0 ? (
                <div className="bg-zinc-900 p-8 text-center border border-orange-500/20">
                  <p className="text-gray-400">No positions found matching your criteria.</p>
                </div>
              ) : (
                filteredJobs.map(job => (
                  <div key={job.id} className="bg-zinc-900 border-l-4 border-orange-500 hover:bg-zinc-800 transition-all">
                    <button onClick={() => toggleJob(job.id)} className="w-full p-6 text-left flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Briefcase className="w-5 h-5 text-orange-500" />
                        <h3 className="text-xl font-bold">{job.title}</h3>
                      </div>
                      <ChevronRight className={`w-6 h-6 text-orange-500 transition-transform ${expandedJobs.includes(job.id) ? 'rotate-90' : ''}`} />
                    </button>
                    {expandedJobs.includes(job.id) && (
                      <div className="px-6 pb-6 pt-2 border-t border-zinc-800">
                        <p className="text-gray-400 mb-4 font-light">{job.description}</p>
                        <div className="flex flex-wrap gap-3 text-sm mb-6">
                          <span className="px-3 py-1 bg-black border border-orange-500/30 text-orange-500">{job.department}</span>
                          <span className="px-3 py-1 bg-black border border-zinc-700 text-gray-400">{job.location}</span>
                          <span className="px-3 py-1 bg-black border border-zinc-700 text-gray-400">{job.type}</span>
                        </div>
                        <button className="px-6 py-3 bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-all uppercase tracking-wider text-sm">Apply Now</button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-zinc-900 p-6 border border-orange-500/20">
                <Bitcoin className="w-10 h-10 text-orange-500 mb-4" />
                <h3 className="text-lg font-bold mb-2 uppercase tracking-tight">Bitcoin Focused</h3>
                <p className="text-gray-400 font-light">Work at the forefront of Bitcoin adoption in corporate finance</p>
              </div>
              <div className="bg-zinc-900 p-6 border border-orange-500/20">
                <Users className="w-10 h-10 text-orange-500 mb-4" />
                <h3 className="text-lg font-bold mb-2 uppercase tracking-tight">Expert Team</h3>
                <p className="text-gray-400 font-light">Collaborate with industry leaders and Bitcoin experts</p>
              </div>
              <div className="bg-zinc-900 p-6 border border-orange-500/20">
                <TrendingUp className="w-10 h-10 text-orange-500 mb-4" />
                <h3 className="text-lg font-bold mb-2 uppercase tracking-tight">Growth Opportunity</h3>
                <p className="text-gray-400 font-light">Build your career in a rapidly expanding industry</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {currentPage === 'history' && (
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-center uppercase tracking-tight">
              Where it all <span className="text-orange-500">began</span>
            </h1>
            <h2 className="text-2xl sm:text-3xl text-gray-400 text-center mb-12 font-light">The Bitcoin Whitepaper</h2>

            <div className="bg-zinc-900 p-8 sm:p-12 border-l-4 border-orange-500 mb-8">
              <div className="flex items-start gap-4 mb-6">
                <Bitcoin className="w-12 h-12 text-orange-500 flex-shrink-0" />
                <div>
                  <h3 className="text-2xl font-bold mb-2 uppercase tracking-tight">Bitcoin: A Peer-to-Peer Electronic Cash System</h3>
                  <p className="text-gray-400 font-light">Published by Satoshi Nakamoto on October 31, 2008</p>
                </div>
              </div>
              
              <div className="space-y-6 text-gray-300 leading-relaxed text-justify">
                <p className="font-light">
                  On October 31, 2008, an individual or group using the pseudonym Satoshi Nakamoto published a groundbreaking nine-page document that would revolutionize the concept of money and digital transactions. This whitepaper introduced Bitcoin, the world's first decentralized digital currency, and outlined a solution to the long-standing double-spending problem in digital currencies without requiring a trusted third party.
                </p>
                <p className="font-light">
                  The whitepaper proposed a peer-to-peer network using proof-of-work to record a public history of transactions that quickly becomes computationally impractical for an attacker to change if honest nodes control a majority of network computing power. This innovative approach eliminated the need for financial institutions to serve as trusted intermediaries for electronic payments, fundamentally changing how we think about digital transactions.
                </p>
                <p className="font-light">
                  Bitcoin's blockchain technology introduced several revolutionary concepts including cryptographic proof instead of trust, decentralized consensus mechanisms, and a fixed supply monetary policy. The network timestamps transactions by hashing them into an ongoing chain of hash-based proof-of-work, forming a record that cannot be changed without redoing the proof-of-work.
                </p>
                <p className="font-light">
                  The whitepaper detailed how the system uses digital signatures to provide strong control of ownership, but is incomplete without a way to prevent double-spending. The proposed solution uses a peer-to-peer distributed timestamp server to generate computational proof of the chronological order of transactions, creating a system where honest nodes collectively control more computing power than any cooperating group of attacker nodes.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-zinc-900 p-6 border border-orange-500/20">
                <h3 className="text-xl font-bold mb-4 uppercase tracking-tight text-orange-500">Key Innovation</h3>
                <p className="text-gray-300 font-light leading-relaxed text-justify">
                  The whitepaper solved the double-spending problem through a decentralized timestamp server that creates computational proof of the chronological order of transactions, making it computationally impractical to reverse transactions once they have been incorporated into the blockchain.
                </p>
              </div>
              
              <div className="bg-zinc-900 p-6 border border-orange-500/20">
                <h3 className="text-xl font-bold mb-4 uppercase tracking-tight text-orange-500">Proof-of-Work</h3>
                <p className="text-gray-300 font-light leading-relaxed text-justify">
                  Bitcoin implements a proof-of-work system using SHA-256 hashing, where miners compete to find a value that when hashed produces a hash beginning with a number of zero bits. This computational work proves the time and effort invested in the block.
                </p>
              </div>
              
              <div className="bg-zinc-900 p-6 border border-orange-500/20">
                <h3 className="text-xl font-bold mb-4 uppercase tracking-tight text-orange-500">Network Consensus</h3>
                <p className="text-gray-300 font-light leading-relaxed text-justify">
                  The network reaches consensus by having nodes always consider the longest chain to be the correct one and work on extending it. If two nodes broadcast different versions of the next block simultaneously, nodes work on the first one received but save the other branch in case it becomes longer.
                </p>
              </div>
              
              <div className="bg-zinc-900 p-6 border border-orange-500/20">
                <h3 className="text-xl font-bold mb-4 uppercase tracking-tight text-orange-500">Incentive Structure</h3>
                <p className="text-gray-300 font-light leading-relaxed text-justify">
                  The whitepaper outlined an incentive system where the first transaction in a block is special, starting a new coin owned by the creator of the block. This provides an incentive for nodes to support the network and provides a way to initially distribute coins into circulation.
                </p>
              </div>
            </div>

            <div className="bg-black p-8 border-2 border-orange-500/30 text-center">
              <h3 className="text-2xl font-bold mb-4 uppercase tracking-tight">Read the Original Whitepaper</h3>
              <p className="text-gray-400 mb-6 font-light">
                Access the complete nine-page document that started the Bitcoin revolution
              </p>
              <a href="https://bitcoin.org/bitcoin.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-all uppercase tracking-wider text-sm">
                <Bitcoin className="w-5 h-5" />Download Bitcoin Whitepaper (PDF)
              </a>
            </div>

            <div className="mt-12 bg-zinc-900 p-8 sm:p-12 border border-orange-500/20">
              <h3 className="text-2xl font-bold mb-6 uppercase tracking-tight">Historical Impact</h3>
              <div className="space-y-4 text-gray-300 leading-relaxed text-justify font-light">
                <p>
                  The publication of the Bitcoin whitepaper marked the beginning of a new era in financial technology. It introduced concepts that would spawn an entire industry of cryptocurrencies and blockchain applications, fundamentally challenging traditional notions of money, trust, and centralized authority.
                </p>
                <p>
                  Today, Bitcoin stands as the world's first and most valuable cryptocurrency, with its underlying blockchain technology being explored for applications far beyond digital currency. The whitepaper's principles of decentralization, cryptographic security, and transparent consensus mechanisms continue to influence technological innovation across multiple industries.
                </p>
                <p>
                  For corporate treasury management, Bitcoin represents a paradigm shift—offering a scarce, decentralized asset with a fixed supply cap of 21 million coins, positioned as a hedge against monetary inflation and a store of value for the digital age.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      <footer className="bg-black py-8 px-4 sm:px-6 lg:px-8 border-t border-orange-500/20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-6 h-6 bg-orange-500 flex items-center justify-center font-bold text-xs">DSP</div>
            <span className="text-lg font-bold tracking-tight">DSP CAPITAL</span>
          </div>
          <p className="text-gray-400 text-sm font-light">© 2018 DSP Capital. Bitcoin Treasury Management Solutions.</p>
        </div>
      </footer>
    </div>
  );
};

export default DSPCapital;

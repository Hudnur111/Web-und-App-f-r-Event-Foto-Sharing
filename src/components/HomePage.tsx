import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Upload, Download, Users, ExternalLink, Search } from 'lucide-react';

const HomePage: React.FC = () => {
  const [linkInput, setLinkInput] = useState('');
  const navigate = useNavigate();

  const handleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (linkInput.trim()) {
      // Extract event ID from URL
      const match = linkInput.match(/\/(?:upload|gallery|event)\/([^\/]+)/);
      if (match) {
        const eventId = match[1];
        navigate(`/gallery/${eventId}`);
      } else {
        alert('Ungültiger Link. Bitte überprüfen Sie den Link.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden">
      {/* Animated Background Grid */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-purple-500/20 animate-pulse"></div>
        <div 
          className="h-full w-full animate-pulse" 
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            animation: 'float 20s ease-in-out infinite'
          }}
        ></div>
      </div>

      <div className="relative z-10">
        {/* Header with Glassmorphism */}
        <header className="backdrop-blur-xl bg-black/30 border-b border-white/20 p-8 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="group">
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-2 bg-gradient-to-r from-white via-orange-400 to-white bg-clip-text text-transparent animate-pulse">
                PHOTO<span className="text-orange-400">BRUTAL</span>
              </h1>
              <p className="text-lg font-bold text-gray-300 group-hover:text-orange-400 transition-colors duration-300">
                KOLLABORATIVES EVENT-FOTO-SHARING
              </p>
            </div>
            
            {/* Quick Link Access */}
            <form onSubmit={handleLinkSubmit} className="hidden md:flex items-center gap-4">
              <div className="relative group">
                <input
                  type="text"
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                  placeholder="Event-Link einfügen..."
                  className="bg-black/50 backdrop-blur-sm border-2 border-gray-600 rounded-xl px-6 py-3 text-white placeholder-gray-400 
                           focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 outline-none transition-all duration-300
                           group-hover:border-orange-400/50 w-80"
                />
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-orange-400 transition-colors" size={20} />
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-bold
                         hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-300
                         shadow-lg hover:shadow-orange-500/25"
              >
                <ExternalLink size={20} />
              </button>
            </form>
          </div>
        </header>

        {/* Hero Section with Modern Cards */}
        <section className="py-20 px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-6xl md:text-8xl font-black leading-none mb-8 tracking-tighter">
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  RAW.
                </span>
                <br />
                <span className="bg-gradient-to-r from-gray-300 to-white bg-clip-text text-transparent">
                  DIRECT.
                </span>
                <br />
                <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent animate-pulse">
                  BRUTAL.
                </span>
              </h2>
              <p className="text-xl md:text-2xl font-bold text-gray-300 mb-12 leading-relaxed max-w-4xl mx-auto">
                Eine kompromisslose Plattform für kollektives Foto-Sharing. 
                Kein Bullshit. Nur Funktionalität. Mit perfekten Animationen.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link 
                  to="/create" 
                  className="group relative bg-gradient-to-r from-orange-500 to-red-500 text-white px-12 py-6 text-xl font-black 
                           rounded-2xl hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-300
                           shadow-2xl hover:shadow-orange-500/30 overflow-hidden"
                >
                  <span className="relative z-10">EVENT ERSTELLEN</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>

                {/* Mobile Link Input */}
                <form onSubmit={handleLinkSubmit} className="md:hidden flex items-center gap-3 w-full max-w-md">
                  <input
                    type="text"
                    value={linkInput}
                    onChange={(e) => setLinkInput(e.target.value)}
                    placeholder="Event-Link..."
                    className="flex-1 bg-black/50 backdrop-blur-sm border-2 border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 
                             focus:border-orange-400 outline-none transition-all duration-300"
                  />
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-3 rounded-xl
                             hover:from-orange-600 hover:to-red-600 transition-all duration-300"
                  >
                    <ExternalLink size={20} />
                  </button>
                </form>
              </div>
            </div>

            {/* Feature Cards with Hover Animations */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Plus, title: 'ERSTELLEN', desc: 'Event anlegen in 30 Sekunden', color: 'from-blue-500 to-cyan-500' },
                { icon: Upload, title: 'HOCHLADEN', desc: 'Ohne Registrierung. Ohne Limits.', color: 'from-green-500 to-emerald-500' },
                { icon: Download, title: 'DOWNLOADEN', desc: 'Alles auf einmal. ZIP-komprimiert.', color: 'from-purple-500 to-pink-500' },
                { icon: Users, title: 'TEILEN', desc: 'Ein Link. Unbegrenzte Teilnehmer.', color: 'from-orange-500 to-red-500' }
              ].map((item, index) => (
                <div 
                  key={index} 
                  className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm 
                           border border-gray-700/50 rounded-3xl p-8 hover:border-orange-400/50 
                           transform hover:scale-105 hover:-translate-y-2 transition-all duration-500
                           shadow-xl hover:shadow-2xl hover:shadow-orange-500/10"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center mb-6 
                                 group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon size={32} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-black mb-3 group-hover:text-orange-400 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 font-bold leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    {item.desc}
                  </p>
                  
                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-orange-500/10 to-red-500/10 
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section with Modern Design */}
        <section className="py-20 px-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5"></div>
          <div className="max-w-7xl mx-auto relative">
            <h2 className="text-5xl md:text-6xl font-black mb-16 tracking-tighter text-center">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                FEATURES
              </span>
              <span className="text-orange-400"> / </span>
              <span className="bg-gradient-to-r from-gray-300 to-white bg-clip-text text-transparent">
                OHNE SCHNICKSCHNACK
              </span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'ZERO REGISTRATION',
                  desc: 'Keine Anmeldung erforderlich. Link teilen, hochladen, fertig.',
                  gradient: 'from-blue-500 to-cyan-500'
                },
                {
                  title: 'REAL-TIME GALLERY',
                  desc: 'Fotos erscheinen sofort in der Live-Galerie. Brutal effizient.',
                  gradient: 'from-green-500 to-emerald-500'
                },
                {
                  title: 'BULK DOWNLOAD',
                  desc: 'Alle Fotos als ZIP. Komprimiert. Timestamped. Done.',
                  gradient: 'from-purple-500 to-pink-500'
                },
                {
                  title: 'DSGVO KONFORM',
                  desc: 'EU-Server. Auto-Delete. Datenschutz ohne Kompromisse.',
                  gradient: 'from-red-500 to-orange-500'
                },
                {
                  title: 'MOBILE FIRST',
                  desc: 'Funktioniert überall. Smartphone, Tablet, Desktop.',
                  gradient: 'from-indigo-500 to-purple-500'
                },
                {
                  title: 'UNLIMITED UPLOADS',
                  desc: 'Keine Limits. Upload was du willst. Wann du willst.',
                  gradient: 'from-orange-500 to-red-500'
                }
              ].map((feature, index) => (
                <div 
                  key={index} 
                  className="group relative bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm 
                           border border-gray-700/30 rounded-3xl p-8 hover:border-white/20
                           transform hover:scale-105 transition-all duration-500
                           shadow-xl hover:shadow-2xl"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className={`w-full h-1 rounded-full bg-gradient-to-r ${feature.gradient} mb-6 
                                 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
                  <h3 className="text-2xl font-black mb-4 group-hover:text-orange-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 font-bold text-lg leading-relaxed group-hover:text-white transition-colors duration-300">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-8 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-red-500/10 to-purple-500/10"></div>
          <div className="max-w-4xl mx-auto text-center relative">
            <h2 className="text-6xl md:text-7xl font-black mb-8 tracking-tighter">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                READY TO GO
              </span>
              <br />
              <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent animate-pulse">
                BRUTAL?
              </span>
            </h2>
            <p className="text-xl md:text-2xl font-bold text-gray-300 mb-12 leading-relaxed">
              Erstelle dein erstes Event. Teile den Link. Sammle Memories.
            </p>
            <Link 
              to="/create" 
              className="group relative inline-block bg-gradient-to-r from-white to-gray-200 text-black px-16 py-8 text-2xl md:text-3xl font-black 
                       rounded-3xl hover:from-orange-400 hover:to-red-500 hover:text-white
                       transform hover:scale-110 transition-all duration-500
                       shadow-2xl hover:shadow-orange-500/30 overflow-hidden"
            >
              <span className="relative z-10">JETZT STARTEN</span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="backdrop-blur-xl bg-black/30 border-t border-white/20 p-8">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-xl font-black text-gray-400">
              PHOTOBRU<span className="text-orange-400">TAL</span> © 2025 / 
              BUILT FOR REBELS / DATENSCHUTZ FIRST
            </p>
          </div>
        </footer>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(1deg); }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
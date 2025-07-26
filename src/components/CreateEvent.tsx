import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Users, Copy, Check, Sparkles, Zap } from 'lucide-react';

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [description, setDescription] = useState('');
  const [maxDuration, setMaxDuration] = useState('7');
  const [isCreating, setIsCreating] = useState(false);
  const [createdEvent, setCreatedEvent] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const generateEventId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const eventId = generateEventId();
    const event = {
      id: eventId,
      name: eventName,
      date: eventDate,
      description,
      maxDuration: parseInt(maxDuration),
      uploadLink: `${window.location.origin}/upload/${eventId}`,
      galleryLink: `${window.location.origin}/gallery/${eventId}`,
      createdAt: new Date().toISOString(),
      photos: []
    };

    // Store in localStorage for demo
    localStorage.setItem(`event_${eventId}`, JSON.stringify(event));

    setCreatedEvent(event);
    setIsCreating(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (createdEvent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-8">
        {/* Animated Background */}
        <div className="fixed inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 animate-pulse"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="bg-gradient-to-br from-green-800/50 to-emerald-800/50 backdrop-blur-sm 
                        border border-green-500/50 rounded-3xl p-12 text-center shadow-2xl animate-fadeIn">
            <div className="mb-8">
              <Sparkles size={80} className="mx-auto text-green-400 animate-bounce" />
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-8 text-green-400 tracking-tighter animate-pulse">
              EVENT CREATED
            </h1>
            <h2 className="text-3xl md:text-4xl font-black mb-12 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {createdEvent.name}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Upload Link */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm 
                            border border-gray-700/50 rounded-2xl p-8">
                <h3 className="text-2xl font-black mb-4 text-orange-400 flex items-center justify-center gap-2">
                  <Zap size={24} />
                  UPLOAD LINK
                </h3>
                <div className="flex items-center gap-4 mb-4">
                  <input 
                    type="text" 
                    value={createdEvent.uploadLink}
                    readOnly
                    className="flex-1 bg-black/50 border-2 border-gray-600 rounded-xl p-4 text-white font-mono text-sm
                             focus:border-orange-400 outline-none"
                  />
                  <button
                    onClick={() => copyToClipboard(createdEvent.uploadLink)}
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-4 rounded-xl
                             hover:from-orange-600 hover:to-red-600 transform hover:scale-110 transition-all duration-300"
                  >
                    {copied ? <Check size={24} /> : <Copy size={24} />}
                  </button>
                </div>
                <p className="text-gray-400 font-bold text-sm">
                  Für Foto-Uploads
                </p>
              </div>

              {/* Gallery Link */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm 
                            border border-gray-700/50 rounded-2xl p-8">
                <h3 className="text-2xl font-black mb-4 text-purple-400 flex items-center justify-center gap-2">
                  <Sparkles size={24} />
                  GALLERY LINK
                </h3>
                <div className="flex items-center gap-4 mb-4">
                  <input 
                    type="text" 
                    value={createdEvent.galleryLink}
                    readOnly
                    className="flex-1 bg-black/50 border-2 border-gray-600 rounded-xl p-4 text-white font-mono text-sm
                             focus:border-purple-400 outline-none"
                  />
                  <button
                    onClick={() => copyToClipboard(createdEvent.galleryLink)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-4 rounded-xl
                             hover:from-purple-600 hover:to-pink-600 transform hover:scale-110 transition-all duration-300"
                  >
                    {copied ? <Check size={24} /> : <Copy size={24} />}
                  </button>
                </div>
                <p className="text-gray-400 font-bold text-sm">
                  Zum Ansehen der Fotos
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link 
                to={`/event/${createdEvent.id}`}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 text-xl font-black rounded-2xl
                         hover:from-blue-600 hover:to-cyan-600 transform hover:scale-105 transition-all duration-300
                         shadow-lg hover:shadow-blue-500/25"
              >
                EVENT DASHBOARD
              </Link>
              <Link 
                to={`/gallery/${createdEvent.id}`}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 text-xl font-black rounded-2xl
                         hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-300
                         shadow-lg hover:shadow-orange-500/25"
              >
                GALERIE ANSEHEN
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-pulse"></div>
        <div 
          className="h-full w-full" 
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        ></div>
      </div>

      <div className="relative z-10 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-6 mb-12">
            <Link 
              to="/" 
              className="group bg-gradient-to-r from-gray-800 to-gray-700 backdrop-blur-sm border border-gray-600 
                       rounded-2xl p-4 hover:from-orange-500 hover:to-red-500 hover:border-orange-400 
                       transform hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-orange-500/25"
            >
              <ArrowLeft size={32} className="group-hover:text-white transition-colors duration-300" />
            </Link>
            <div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-2">
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  EVENT
                </span>
                <span className="text-orange-400 animate-pulse"> ERSTELLEN</span>
              </h1>
              <p className="text-xl font-bold text-gray-400">
                ERSTELLE DEIN EVENT IN WENIGEN SEKUNDEN
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleCreateEvent} className="space-y-8">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm 
                          border border-gray-700/50 rounded-3xl p-8 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="group">
                  <label className="block text-2xl font-black mb-4 text-orange-400 group-hover:text-orange-300 transition-colors">
                    EVENT NAME *
                  </label>
                  <input
                    type="text"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    required
                    placeholder="Z.B. HOCHZEIT SCHMIDT 2025"
                    className="w-full bg-black/50 border-2 border-gray-600 rounded-2xl p-4 text-white text-xl font-bold 
                             placeholder-gray-500 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 
                             outline-none transition-all duration-300 hover:border-gray-500"
                  />
                </div>

                <div className="group">
                  <label className="block text-2xl font-black mb-4 text-orange-400 group-hover:text-orange-300 transition-colors">
                    EVENT DATUM
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-black/50 border-2 border-gray-600 rounded-2xl p-4 text-white text-xl font-bold 
                             focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 outline-none 
                             transition-all duration-300 hover:border-gray-500"
                  />
                </div>
              </div>

              <div className="mt-8 group">
                <label className="block text-2xl font-black mb-4 text-orange-400 group-hover:text-orange-300 transition-colors">
                  BESCHREIBUNG
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="OPTIONAL: Weitere Details zum Event..."
                  rows={4}
                  className="w-full bg-black/50 border-2 border-gray-600 rounded-2xl p-4 text-white text-xl font-bold 
                           placeholder-gray-500 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 
                           outline-none resize-none transition-all duration-300 hover:border-gray-500"
                />
              </div>

              <div className="mt-8 group">
                <label className="block text-2xl font-black mb-4 text-orange-400 group-hover:text-orange-300 transition-colors">
                  AUTO-DELETE NACH (TAGE)
                </label>
                <select
                  value={maxDuration}
                  onChange={(e) => setMaxDuration(e.target.value)}
                  className="w-full bg-black/50 border-2 border-gray-600 rounded-2xl p-4 text-white text-xl font-bold 
                           focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 outline-none 
                           transition-all duration-300 hover:border-gray-500"
                >
                  <option value="1">1 TAG</option>
                  <option value="3">3 TAGE</option>
                  <option value="7">7 TAGE</option>
                  <option value="14">14 TAGE</option>
                  <option value="30">30 TAGE</option>
                </select>
                <p className="text-gray-400 font-bold mt-2">
                  DSGVO-KONFORM: Fotos werden automatisch gelöscht
                </p>
              </div>
            </div>

            {/* Info Boxes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { 
                  icon: Calendar, 
                  title: 'SOFORT AKTIV', 
                  desc: 'Upload-Link funktioniert sofort nach Erstellung',
                  gradient: 'from-green-500 to-emerald-500'
                },
                { 
                  icon: Users, 
                  title: 'UNBEGRENZT', 
                  desc: 'Beliebig viele Teilnehmer können Fotos hochladen',
                  gradient: 'from-blue-500 to-cyan-500'
                },
                { 
                  icon: Clock, 
                  title: 'REAL-TIME', 
                  desc: 'Fotos erscheinen sofort in der Live-Galerie',
                  gradient: 'from-purple-500 to-pink-500'
                }
              ].map((item, index) => (
                <div 
                  key={index} 
                  className="group bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm 
                           border border-gray-700/30 rounded-3xl p-8 hover:border-orange-400/50
                           transform hover:scale-105 hover:-translate-y-2 transition-all duration-500
                           shadow-xl hover:shadow-2xl"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${item.gradient} flex items-center justify-center mb-6 
                                 group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon size={32} className="text-white" />
                  </div>
                  <h3 className="text-xl font-black mb-3 group-hover:text-orange-400 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 font-bold leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!eventName || isCreating}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-8 text-3xl md:text-4xl font-black 
                       rounded-3xl hover:from-orange-600 hover:to-red-600 transform hover:scale-105 
                       transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed 
                       disabled:transform-none shadow-2xl hover:shadow-orange-500/30 relative overflow-hidden"
            >
              {isCreating ? (
                <div className="flex items-center justify-center gap-4">
                  <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>ERSTELLE EVENT...</span>
                </div>
              ) : (
                'EVENT ERSTELLEN'
              )}
              
              {/* Button Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CreateEvent;
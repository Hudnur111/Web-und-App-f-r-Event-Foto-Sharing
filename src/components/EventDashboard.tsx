import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Copy, Check, Share, Trash2, Download, Settings, Users, Image } from 'lucide-react';

interface Event {
  id: string;
  name: string;
  date: string;
  description: string;
  maxDuration: number;
  uploadLink: string;
  createdAt: string;
  photos: any[];
}

const EventDashboard: React.FC = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [copied, setCopied] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const eventData = localStorage.getItem(`event_${eventId}`);
    if (eventData) {
      setEvent(JSON.parse(eventData));
    }
  }, [eventId]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeleteEvent = () => {
    if (!event) return;
    localStorage.removeItem(`event_${eventId}`);
    window.location.href = '/';
  };

  const calculateTimeRemaining = () => {
    if (!event) return '';
    const createdAt = new Date(event.createdAt);
    const expiresAt = new Date(createdAt.getTime() + (event.maxDuration * 24 * 60 * 60 * 1000));
    const now = new Date();
    const remaining = expiresAt.getTime() - now.getTime();
    
    if (remaining <= 0) return 'ABGELAUFEN';
    
    const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
    const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    
    return `${days}T ${hours}H`;
  };

  if (!event) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-black mb-4">EVENT NOT FOUND</h1>
          <Link to="/" className="text-orange-500 hover:underline text-xl font-bold">
            ZURÜCK ZUR STARTSEITE
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Grid Background */}
      <div className="fixed inset-0 opacity-5">
        <div className="h-full w-full" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-8">
          <div className="border-4 border-red-500 bg-gray-900 p-12 max-w-2xl">
            <h2 className="text-4xl font-black mb-6 text-red-500">EVENT LÖSCHEN?</h2>
            <p className="text-xl font-bold text-white mb-8">
              Diese Aktion kann nicht rückgängig gemacht werden. Alle Fotos gehen verloren.
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleDeleteEvent}
                className="bg-red-500 text-black px-8 py-4 text-xl font-black border-4 border-red-500 
                         hover:bg-black hover:text-red-500 transition-colors"
              >
                ENDGÜLTIG LÖSCHEN
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-gray-600 text-white px-8 py-4 text-xl font-black border-4 border-gray-600 
                         hover:bg-white hover:text-black transition-colors"
              >
                ABBRECHEN
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-6 mb-12">
            <Link 
              to="/"
              className="bg-gray-800 border-4 border-gray-600 p-4 hover:bg-white hover:text-black transition-colors"
            >
              <ArrowLeft size={32} />
            </Link>
            <div>
              <h1 className="text-6xl font-black tracking-tighter">
                EVENT <span className="text-orange-500">DASHBOARD</span>
              </h1>
              <p className="text-xl font-bold text-gray-400 mt-2">
                ZENTRALE VERWALTUNG UND STATISTIKEN
              </p>
            </div>
          </div>

          {/* Event Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2 border-4 border-white bg-gray-900 p-8">
              <h2 className="text-4xl font-black mb-6 text-orange-500">{event.name}</h2>
              {event.description && (
                <p className="text-xl font-bold text-gray-300 mb-6">{event.description}</p>
              )}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-black text-gray-400 mb-2">ERSTELLT AM</h3>
                  <p className="text-xl font-bold">{new Date(event.createdAt).toLocaleString('de-DE')}</p>
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-400 mb-2">EVENT DATUM</h3>
                  <p className="text-xl font-bold">{event.date || 'NICHT GESETZT'}</p>
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-400 mb-2">AUTO-DELETE</h3>
                  <p className="text-xl font-bold">{event.maxDuration} TAGE</p>
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-400 mb-2">VERBLEIBEND</h3>
                  <p className="text-xl font-bold text-orange-500">{calculateTimeRemaining()}</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
              <div className="border-4 border-green-500 bg-gray-900 p-6 text-center">
                <Image size={48} className="mx-auto mb-4 text-green-500" />
                <h3 className="text-3xl font-black text-green-500 mb-2">
                  {event.photos?.length || 0}
                </h3>
                <p className="text-lg font-bold text-gray-300">FOTOS</p>
              </div>
              <div className="border-4 border-blue-500 bg-gray-900 p-6 text-center">
                <Users size={48} className="mx-auto mb-4 text-blue-500" />
                <h3 className="text-3xl font-black text-blue-500 mb-2">∞</h3>
                <p className="text-lg font-bold text-gray-300">CONTRIBUTORS</p>
              </div>
            </div>
          </div>

          {/* Upload Link Sharing */}
          <div className="border-4 border-orange-500 bg-gray-900 p-8 mb-12">
            <h2 className="text-3xl font-black mb-6 text-orange-500">UPLOAD LINK TEILEN</h2>
            <div className="flex items-center gap-4 mb-6">
              <input 
                type="text" 
                value={event.uploadLink}
                readOnly
                className="flex-1 bg-black border-4 border-gray-600 p-4 text-white font-mono text-lg"
              />
              <button
                onClick={() => copyToClipboard(event.uploadLink)}
                className="bg-orange-500 text-black px-6 py-4 border-4 border-orange-500 
                         hover:bg-black hover:text-orange-500 transition-colors"
              >
                {copied ? <Check size={24} /> : <Copy size={24} />}
              </button>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: `Fotos für ${event.name}`,
                      text: 'Lade deine Fotos hier hoch:',
                      url: event.uploadLink
                    });
                  }
                }}
                className="bg-blue-500 text-black px-6 py-4 border-4 border-blue-500 
                         hover:bg-black hover:text-blue-500 transition-colors"
              >
                <Share size={24} />
              </button>
            </div>
            <p className="text-gray-400 font-bold">
              Teile diesen Link mit allen Event-Teilnehmern. Keine Registrierung erforderlich.
            </p>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Link
              to={`/gallery/${event.id}`}
              className="border-4 border-white bg-gray-800 p-8 text-center hover:bg-white hover:text-black transition-colors"
            >
              <Image size={48} className="mx-auto mb-4" />
              <h3 className="text-xl font-black mb-2">GALERIE</h3>
              <p className="font-bold text-sm">Alle Fotos ansehen</p>
            </Link>

            <Link
              to={`/upload/${event.id}`}
              className="border-4 border-green-500 bg-gray-800 p-8 text-center hover:bg-green-500 hover:text-black transition-colors"
            >
              <Copy size={48} className="mx-auto mb-4" />
              <h3 className="text-xl font-black mb-2">UPLOAD</h3>
              <p className="font-bold text-sm">Fotos hinzufügen</p>
            </Link>

            <button
              disabled={!event.photos?.length}
              className="border-4 border-blue-500 bg-gray-800 p-8 text-center hover:bg-blue-500 hover:text-black 
                       transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={48} className="mx-auto mb-4" />
              <h3 className="text-xl font-black mb-2">DOWNLOAD</h3>
              <p className="font-bold text-sm">ZIP-Archive erstellen</p>
            </button>

            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="border-4 border-red-500 bg-gray-800 p-8 text-center hover:bg-red-500 hover:text-black transition-colors"
            >
              <Trash2 size={48} className="mx-auto mb-4" />
              <h3 className="text-xl font-black mb-2">LÖSCHEN</h3>
              <p className="font-bold text-sm">Event entfernen</p>
            </button>
          </div>

          {/* Recent Photos Preview */}
          {event.photos && event.photos.length > 0 && (
            <div className="border-4 border-white bg-gray-900 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-black text-orange-500">NEUESTE UPLOADS</h2>
                <Link
                  to={`/gallery/${event.id}`}
                  className="bg-orange-500 text-black px-6 py-3 text-lg font-black border-2 border-orange-500 
                           hover:bg-black hover:text-orange-500 transition-colors"
                >
                  ALLE ANSEHEN
                </Link>
              </div>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                {event.photos.slice(-8).map((photo, index) => (
                  <div key={index} className="aspect-square bg-gray-800 border-2 border-gray-600 overflow-hidden">
                    <img
                      src={photo.url}
                      alt={photo.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDashboard;
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Upload, Grid, List, X, ZoomIn, Heart, Share2 } from 'lucide-react';

interface Photo {
  id: string;
  name: string;
  uploadedAt: string;
  url: string;
  size?: number;
  type?: string;
}

interface Event {
  id: string;
  name: string;
  date: string;
  photos: Photo[];
}

const GalleryPage: React.FC = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadEvent = () => {
      const eventData = localStorage.getItem(`event_${eventId}`);
      if (eventData) {
        const parsedEvent = JSON.parse(eventData);
        setEvent(parsedEvent);
      }
    };

    loadEvent();
    
    // Refresh every 2 seconds to show new uploads
    const interval = setInterval(loadEvent, 2000);
    return () => clearInterval(interval);
  }, [eventId]);

  const handleDownloadAll = async () => {
    if (!event || !event.photos.length) return;
    
    setDownloading(true);
    
    // Simulate ZIP creation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real app, this would create and download a ZIP file
    const link = document.createElement('a');
    link.href = '#';
    link.download = `${event.name.replace(/\s+/g, '_')}_photos.zip`;
    link.click();
    
    setDownloading(false);
  };

  const toggleFavorite = (photoId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(photoId)) {
        newFavorites.delete(photoId);
      } else {
        newFavorites.add(photoId);
      }
      return newFavorites;
    });
  };

  const shareGallery = () => {
    if (navigator.share) {
      navigator.share({
        title: `${event?.name} - Foto Galerie`,
        text: 'Schau dir diese Event-Fotos an!',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link kopiert!');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('de-DE');
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-32 border-8 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-8"></div>
          <h1 className="text-4xl md:text-6xl font-black mb-4">LOADING EVENT...</h1>
          <Link to="/" className="text-orange-400 hover:underline text-xl font-bold">
            ZURÜCK ZUR STARTSEITE
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 animate-pulse"></div>
        <div 
          className="h-full w-full" 
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        ></div>
      </div>

      {/* Lightbox */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-8 animate-fadeIn">
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-8 right-8 bg-gradient-to-r from-red-500 to-red-600 text-white p-4 
                     rounded-2xl border-2 border-red-500 hover:from-red-600 hover:to-red-700
                     transform hover:scale-110 transition-all duration-300 z-10 shadow-lg"
          >
            <X size={32} />
          </button>
          
          <div className="max-w-full max-h-full flex flex-col items-center">
            <div className="relative group">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.name}
                className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
              />
              
              {/* Photo Actions */}
              <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() => toggleFavorite(selectedPhoto.id)}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    favorites.has(selectedPhoto.id)
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                      : 'bg-black/50 text-gray-300 hover:text-red-400'
                  }`}
                >
                  <Heart size={20} fill={favorites.has(selectedPhoto.id) ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm 
                          border border-gray-700/50 rounded-2xl p-6 mt-6 max-w-md w-full">
              <h3 className="text-xl font-black mb-2 truncate">{selectedPhoto.name}</h3>
              <div className="flex justify-between text-gray-400 font-bold text-sm">
                <span>{formatDate(selectedPhoto.uploadedAt)}</span>
                {selectedPhoto.size && <span>{formatFileSize(selectedPhoto.size)}</span>}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-12 gap-6">
            <div className="flex items-center gap-6">
              <Link 
                to="/"
                className="group bg-gradient-to-r from-gray-800 to-gray-700 backdrop-blur-sm border border-gray-600 
                         rounded-2xl p-4 hover:from-orange-500 hover:to-red-500 hover:border-orange-400 
                         transform hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-orange-500/25"
              >
                <ArrowLeft size={32} className="group-hover:text-white transition-colors duration-300" />
              </Link>
              <div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-2">
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {event.name}
                  </span>
                </h1>
                <p className="text-lg md:text-xl font-bold text-gray-400">
                  {event.photos.length} FOTOS • {event.date && formatDate(event.date)}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {/* View Mode Toggle */}
              <div className="flex bg-gradient-to-r from-gray-800 to-gray-700 backdrop-blur-sm border border-gray-600 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-4 transition-all duration-300 ${
                    viewMode === 'grid' 
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <Grid size={24} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-4 transition-all duration-300 ${
                    viewMode === 'list' 
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <List size={24} />
                </button>
              </div>

              {/* Action Buttons */}
              <button
                onClick={shareGallery}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-4 rounded-2xl font-black
                         hover:from-blue-600 hover:to-cyan-600 transform hover:scale-105 transition-all duration-300
                         shadow-lg hover:shadow-blue-500/25"
              >
                <Share2 size={24} className="inline mr-2" />
                TEILEN
              </button>

              <Link
                to={`/upload/${eventId}`}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-2xl font-black
                         hover:from-green-600 hover:to-emerald-600 transform hover:scale-105 transition-all duration-300
                         shadow-lg hover:shadow-green-500/25"
              >
                <Upload size={24} className="inline mr-2" />
                UPLOAD
              </Link>

              <button
                onClick={handleDownloadAll}
                disabled={!event.photos.length || downloading}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4 rounded-2xl font-black
                         hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300
                         disabled:opacity-50 disabled:transform-none shadow-lg hover:shadow-purple-500/25"
              >
                <Download size={24} className="inline mr-2" />
                {downloading ? 'CREATING ZIP...' : 'DOWNLOAD ALL'}
              </button>
            </div>
          </div>

          {/* Gallery */}
          {event.photos.length === 0 ? (
            <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm 
                          border-4 border-dashed border-gray-600 rounded-3xl p-20 text-center">
              <Upload size={120} className="mx-auto mb-8 text-gray-600 animate-bounce" />
              <h2 className="text-3xl md:text-4xl font-black mb-4 text-gray-600">KEINE FOTOS</h2>
              <p className="text-xl font-bold text-gray-500 mb-8">
                Noch keine Bilder hochgeladen. Teile den Upload-Link!
              </p>
              <Link
                to={`/upload/${eventId}`}
                className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 text-xl font-black 
                         rounded-2xl hover:from-orange-600 hover:to-red-600 transform hover:scale-110 
                         transition-all duration-300 shadow-lg hover:shadow-orange-500/25"
              >
                ERSTES FOTO HOCHLADEN
              </Link>
            </div>
          ) : (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {event.photos.map((photo, index) => (
                    <div 
                      key={photo.id} 
                      className="group relative transform hover:scale-105 hover:-translate-y-2 transition-all duration-500"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="aspect-square bg-gradient-to-br from-gray-700 to-gray-800 
                                    border-2 border-gray-600 rounded-2xl overflow-hidden
                                    group-hover:border-orange-400 transition-colors duration-300 cursor-pointer shadow-lg
                                    group-hover:shadow-2xl group-hover:shadow-orange-500/10"
                           onClick={() => setSelectedPhoto(photo)}>
                        <img
                          src={photo.url}
                          alt={photo.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 
                                     transition-opacity duration-300 flex items-center justify-center">
                          <ZoomIn size={48} className="text-white animate-pulse" />
                        </div>
                        
                        {/* Favorite Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(photo.id);
                          }}
                          className={`absolute top-3 right-3 p-2 rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100 ${
                            favorites.has(photo.id)
                              ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                              : 'bg-black/50 text-gray-300 hover:text-red-400'
                          }`}
                        >
                          <Heart size={16} fill={favorites.has(photo.id) ? 'currentColor' : 'none'} />
                        </button>
                      </div>
                      <p className="text-sm font-bold mt-3 truncate text-gray-400 group-hover:text-gray-300 transition-colors">
                        {photo.name}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {event.photos.map((photo, index) => (
                    <div 
                      key={photo.id} 
                      className="group bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm 
                               border border-gray-700/50 rounded-2xl p-6 flex items-center gap-6
                               hover:border-orange-400/50 transition-all duration-300 shadow-lg hover:shadow-xl"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-800 
                                    border-2 border-gray-600 rounded-2xl overflow-hidden cursor-pointer
                                    group-hover:border-orange-400 transition-colors duration-300"
                           onClick={() => setSelectedPhoto(photo)}>
                        <img
                          src={photo.url}
                          alt={photo.name}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-black mb-1 group-hover:text-orange-400 transition-colors duration-300">
                          {photo.name}
                        </h3>
                        <div className="flex justify-between text-gray-400 font-bold">
                          <span>{formatDate(photo.uploadedAt)}</span>
                          {photo.size && <span>{formatFileSize(photo.size)}</span>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleFavorite(photo.id)}
                          className={`p-3 rounded-xl transition-all duration-300 ${
                            favorites.has(photo.id)
                              ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                              : 'bg-gray-700 text-gray-300 hover:text-red-400'
                          }`}
                        >
                          <Heart size={20} fill={favorites.has(photo.id) ? 'currentColor' : 'none'} />
                        </button>
                        <button
                          onClick={() => setSelectedPhoto(photo)}
                          className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-xl
                                   hover:from-orange-600 hover:to-red-600 transform hover:scale-110 
                                   transition-all duration-300 shadow-lg"
                        >
                          <ZoomIn size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Stats */}
          {event.photos.length > 0 && (
            <div className="mt-16 bg-gradient-to-r from-gray-800/30 to-gray-900/30 backdrop-blur-sm 
                          border border-gray-700/30 rounded-3xl p-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="text-center group">
                  <h3 className="text-3xl md:text-4xl font-black text-orange-400 mb-2 group-hover:scale-110 transition-transform duration-300">
                    {event.photos.length}
                  </h3>
                  <p className="text-lg md:text-xl font-bold text-gray-400">FOTOS GESAMMELT</p>
                </div>
                <div className="text-center group">
                  <h3 className="text-3xl md:text-4xl font-black text-green-400 mb-2 group-hover:scale-110 transition-transform duration-300">
                    {Math.round(event.photos.reduce((acc, photo) => acc + (photo.size || 2500000), 0) / (1024 * 1024))}MB
                  </h3>
                  <p className="text-lg md:text-xl font-bold text-gray-400">GESAMTGRÖSSE</p>
                </div>
                <div className="text-center group">
                  <h3 className="text-3xl md:text-4xl font-black text-blue-400 mb-2 group-hover:scale-110 transition-transform duration-300">
                    {favorites.size}
                  </h3>
                  <p className="text-lg md:text-xl font-bold text-gray-400">FAVORITEN</p>
                </div>
                <div className="text-center group">
                  <h3 className="text-3xl md:text-4xl font-black text-purple-400 mb-2 group-hover:scale-110 transition-transform duration-300 animate-pulse">
                    LIVE
                  </h3>
                  <p className="text-lg md:text-xl font-bold text-gray-400">REAL-TIME UPDATES</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default GalleryPage;
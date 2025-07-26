import React, { useState, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Upload, Image, X, Check, ArrowLeft, Camera, Zap } from 'lucide-react';

interface UploadedPhoto {
  id: string;
  name: string;
  uploadedAt: string;
  url: string;
  file: File;
}

const UploadPage: React.FC = () => {
  const { eventId } = useParams();
  const [selectedFiles, setSelectedFiles] = useState<UploadedPhoto[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createPhotoObject = useCallback((file: File): UploadedPhoto => {
    return {
      id: Math.random().toString(36).substring(2, 15),
      name: file.name,
      uploadedAt: new Date().toISOString(),
      url: URL.createObjectURL(file),
      file: file
    };
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    const photoObjects = imageFiles.map(createPhotoObject);
    setSelectedFiles(prev => [...prev, ...photoObjects]);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    const photoObjects = imageFiles.map(createPhotoObject);
    setSelectedFiles(prev => [...prev, ...photoObjects]);
  };

  const removeFile = (id: string) => {
    setSelectedFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.url);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setUploadedCount(0);

    try {
      // Get existing event data
      const existingEvent = localStorage.getItem(`event_${eventId}`);
      let event = existingEvent ? JSON.parse(existingEvent) : { photos: [] };

      // Process each file
      for (let i = 0; i < selectedFiles.length; i++) {
        const photo = selectedFiles[i];
        
        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Create photo entry for storage
        const newPhoto = {
          id: photo.id,
          name: photo.name,
          uploadedAt: photo.uploadedAt,
          url: photo.url,
          size: photo.file.size,
          type: photo.file.type
        };

        // Add to event photos
        event.photos = event.photos || [];
        event.photos.push(newPhoto);
        
        setUploadedCount(i + 1);
      }

      // Save updated event
      localStorage.setItem(`event_${eventId}`, JSON.stringify(event));

      // Clear selected files after successful upload
      setTimeout(() => {
        setSelectedFiles([]);
        setUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 500);

    } catch (error) {
      console.error('Upload failed:', error);
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 animate-pulse"></div>
        <div 
          className="h-full w-full" 
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        ></div>
      </div>

      <div className="relative z-10 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-6 mb-12">
            <Link 
              to={`/gallery/${eventId}`}
              className="group bg-gradient-to-r from-gray-800 to-gray-700 backdrop-blur-sm border border-gray-600 
                       rounded-2xl p-4 hover:from-orange-500 hover:to-red-500 hover:border-orange-400 
                       transform hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-orange-500/25"
            >
              <ArrowLeft size={32} className="group-hover:text-white transition-colors duration-300" />
            </Link>
            <div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-2">
                <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                  FOTO
                </span>
                <span className="text-orange-400 animate-pulse"> UPLOAD</span>
              </h1>
              <p className="text-xl font-bold text-gray-400">
                ZIEHE BILDER HIERHIN ODER KLICKE ZUM AUSWÄHLEN
              </p>
            </div>
          </div>

          {/* Upload Zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative group border-4 border-dashed rounded-3xl p-16 text-center mb-8 cursor-pointer
                       transition-all duration-500 transform hover:scale-[1.02]
                       ${dragActive 
                         ? 'border-orange-400 bg-gradient-to-br from-orange-500/20 to-red-500/20 scale-[1.02]' 
                         : 'border-gray-600 bg-gradient-to-br from-gray-800/30 to-gray-900/30 hover:border-orange-400/50'
                       }
                       backdrop-blur-sm shadow-2xl hover:shadow-orange-500/10`}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="relative z-10">
              <div className={`mx-auto mb-8 transform transition-all duration-500 ${dragActive ? 'scale-125 rotate-12' : 'group-hover:scale-110'}`}>
                {dragActive ? (
                  <Zap size={120} className="text-orange-400 animate-pulse" />
                ) : (
                  <Upload size={120} className="text-gray-400 group-hover:text-orange-400 transition-colors duration-300" />
                )}
              </div>
              <h2 className="text-3xl md:text-4xl font-black mb-4 group-hover:text-orange-400 transition-colors duration-300">
                {dragActive ? 'JETZT LOSLASSEN!' : 'DRAG & DROP'}
              </h2>
              <p className="text-xl md:text-2xl font-bold text-gray-400 mb-8 group-hover:text-gray-300 transition-colors duration-300">
                ODER KLICKEN ZUM DATEI-BROWSER
              </p>
              <div className="flex items-center justify-center gap-4 text-lg font-bold text-gray-500">
                <Camera size={24} />
                <span>JPG, PNG, GIF, WEBP • KEINE GRÖSSENBESCHRÄNKUNG</span>
              </div>
            </div>
            
            {/* Animated Border Effect */}
            <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r from-orange-500/20 to-red-500/20 
                           opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`}></div>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Selected Files */}
          {selectedFiles.length > 0 && (
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm 
                          border border-gray-700/50 rounded-3xl p-8 mb-8 shadow-2xl">
              <h3 className="text-2xl md:text-3xl font-black mb-6 text-orange-400">
                AUSGEWÄHLTE DATEIEN ({selectedFiles.length})
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-8">
                {selectedFiles.map((photo, index) => (
                  <div 
                    key={photo.id} 
                    className="group relative transform hover:scale-105 transition-all duration-300"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="aspect-square bg-gradient-to-br from-gray-700 to-gray-800 
                                  border-2 border-gray-600 rounded-2xl overflow-hidden p-2
                                  group-hover:border-orange-400 transition-colors duration-300 shadow-lg">
                      <img
                        src={photo.url}
                        alt={photo.name}
                        className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-300"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(photo.id);
                        }}
                        className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white p-2 
                                 rounded-full border-2 border-red-500 hover:from-red-600 hover:to-red-700
                                 transform hover:scale-110 transition-all duration-300 shadow-lg"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <p className="text-xs font-bold mt-2 truncate text-gray-400 group-hover:text-gray-300 transition-colors">
                      {photo.name}
                    </p>
                  </div>
                ))}
              </div>

              <button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-6 text-2xl md:text-3xl font-black 
                         rounded-2xl hover:from-green-600 hover:to-emerald-600 transform hover:scale-105 
                         transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed 
                         disabled:transform-none shadow-2xl hover:shadow-green-500/25"
              >
                {uploading ? (
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>UPLOADING... {uploadedCount}/{selectedFiles.length}</span>
                  </div>
                ) : (
                  'ALLE FOTOS HOCHLADEN'
                )}
              </button>
            </div>
          )}

          {/* Upload Success */}
          {uploadedCount > 0 && !uploading && selectedFiles.length === 0 && (
            <div className="bg-gradient-to-br from-green-800/50 to-emerald-800/50 backdrop-blur-sm 
                          border border-green-500/50 rounded-3xl p-8 text-center shadow-2xl
                          animate-pulse">
              <div className="transform scale-110 animate-bounce mb-6">
                <Check size={80} className="mx-auto text-green-400" />
              </div>
              <h3 className="text-3xl md:text-4xl font-black text-green-400 mb-4">
                {uploadedCount} FOTOS HOCHGELADEN
              </h3>
              <p className="text-xl font-bold text-gray-300 mb-8">
                Alle Bilder sind jetzt in der Galerie verfügbar
              </p>
              <Link
                to={`/gallery/${eventId}`}
                className="inline-block bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 text-xl font-black 
                         rounded-2xl hover:from-green-600 hover:to-emerald-600 transform hover:scale-110 
                         transition-all duration-300 shadow-lg hover:shadow-green-500/25"
              >
                GALERIE ANSEHEN
              </Link>
            </div>
          )}

          {/* Instructions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              { 
                icon: Image, 
                title: 'ALLE FORMATE', 
                desc: 'JPG, PNG, GIF, WEBP und alle gängigen Bildformate werden unterstützt',
                gradient: 'from-blue-500 to-cyan-500'
              },
              { 
                icon: Upload, 
                title: 'BULK UPLOAD', 
                desc: 'Wähle mehrere Dateien gleichzeitig aus für maximale Effizienz',
                gradient: 'from-green-500 to-emerald-500'
              },
              { 
                icon: Check, 
                title: 'SOFORT SICHTBAR', 
                desc: 'Hochgeladene Bilder erscheinen sofort in der Event-Galerie',
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
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
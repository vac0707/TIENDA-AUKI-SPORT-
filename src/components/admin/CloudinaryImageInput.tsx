import React, { useState } from 'react';
import { Image as ImageIcon, Plus, Trash2, ArrowUp, ArrowDown, ExternalLink, AlertCircle, CheckCircle2 } from 'lucide-react';

interface CloudinaryImageInputProps {
  mainImage: string;
  onChangeMainImage: (url: string) => void;
  galleryImages: string[];
  onChangeGalleryImages: (urls: string[]) => void;
}

export const CloudinaryImageInput: React.FC<CloudinaryImageInputProps> = ({
  mainImage,
  onChangeMainImage,
  galleryImages,
  onChangeGalleryImages
}) => {
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [imageErrorMain, setImageErrorMain] = useState(false);
  const [imageErrorsGallery, setImageErrorsGallery] = useState<Record<number, boolean>>({});

  const handleAddGalleryUrl = () => {
    if (!newGalleryUrl.trim()) return;
    onChangeGalleryImages([...galleryImages, newGalleryUrl.trim()]);
    setNewGalleryUrl('');
  };

  const handleRemoveGalleryUrl = (index: number) => {
    const updated = galleryImages.filter((_, i) => i !== index);
    onChangeGalleryImages(updated);
  };

  const handleMoveGallery = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= galleryImages.length) return;
    const updated = [...galleryImages];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    onChangeGalleryImages(updated);
  };

  const isCloudinaryUrl = (url: string) => url.includes('cloudinary.com') || url.includes('res.cloudinary');

  return (
    <div className="space-y-6 bg-neutral-900/60 p-5 rounded-2xl border border-white/10">
      
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2 text-red-500 font-bold text-sm">
          <ImageIcon size={18} />
          <span>Gestión de Imágenes (Cloudinary CDN)</span>
        </div>
        <span className="text-[11px] text-white/50 bg-white/5 px-2.5 py-1 rounded-md">
          Sin almacenamiento local
        </span>
      </div>

      {/* Main Image URL Section */}
      <div className="space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-white/80">
          Imagen Principal (URL de Cloudinary) *
        </label>
        
        <div className="flex gap-2">
          <input
            type="url"
            value={mainImage}
            onChange={(e) => {
              setImageErrorMain(false);
              onChangeMainImage(e.target.value);
            }}
            placeholder="https://res.cloudinary.com/tu-cloud/image/upload/v123/zapatilla.jpg"
            className="flex-1 bg-black/80 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 transition-colors"
          />
          {mainImage && (
            <a
              href={mainImage}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 bg-neutral-800 hover:bg-neutral-700 text-white/80 rounded-xl transition-colors flex items-center justify-center"
              title="Abrir imagen"
            >
              <ExternalLink size={16} />
            </a>
          )}
        </div>

        {/* Live Main Image Preview */}
        {mainImage ? (
          <div className="relative group w-32 h-32 rounded-xl overflow-hidden border border-white/20 bg-black flex items-center justify-center">
            {!imageErrorMain ? (
              <img
                src={mainImage}
                alt="Vista previa principal"
                className="w-full h-full object-cover"
                onError={() => setImageErrorMain(true)}
              />
            ) : (
              <div className="p-3 text-center text-red-400 flex flex-col items-center gap-1">
                <AlertCircle size={20} />
                <span className="text-[10px] font-bold">URL no válida o no accesible</span>
              </div>
            )}
            {isCloudinaryUrl(mainImage) && (
              <span className="absolute bottom-1 right-1 bg-emerald-600 text-[9px] text-white font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                <CheckCircle2 size={10} /> Cloudinary
              </span>
            )}
          </div>
        ) : (
          <div className="w-32 h-32 rounded-xl border border-dashed border-white/20 bg-black/40 flex flex-col items-center justify-center text-white/40 text-[11px] gap-2">
            <ImageIcon size={24} />
            <span>Ingresa una URL</span>
          </div>
        )}
      </div>

      {/* Gallery Images Section */}
      <div className="space-y-3 pt-4 border-t border-white/10">
        <label className="block text-xs font-bold uppercase tracking-wider text-white/80">
          Galería de Imágenes Secundarias
        </label>

        {/* Add Gallery URL Form */}
        <div className="flex gap-2">
          <input
            type="url"
            value={newGalleryUrl}
            onChange={(e) => setNewGalleryUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddGalleryUrl();
              }
            }}
            placeholder="Pegar URL de Cloudinary para la galería..."
            className="flex-1 bg-black/80 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-red-500 transition-colors"
          />
          <button
            type="button"
            onClick={handleAddGalleryUrl}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Plus size={16} />
            <span>Agregar</span>
          </button>
        </div>

        {/* Gallery Preview List */}
        {galleryImages.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {galleryImages.map((url, idx) => (
              <div key={idx} className="relative group bg-black/80 border border-white/15 rounded-xl p-2 flex flex-col items-center space-y-2">
                <div className="w-full h-24 rounded-lg overflow-hidden bg-neutral-950 flex items-center justify-center">
                  {!imageErrorsGallery[idx] ? (
                    <img
                      src={url}
                      alt={`Galería ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={() => setImageErrorsGallery(prev => ({ ...prev, [idx]: true }))}
                    />
                  ) : (
                    <div className="p-2 text-center text-red-400 text-[10px]">
                      Error de carga
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between w-full text-[11px] pt-1 border-t border-white/10">
                  <span className="text-white/50 font-mono">#{idx + 1}</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleMoveGallery(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 hover:bg-white/10 text-white/70 rounded disabled:opacity-20"
                      title="Mover antes"
                    >
                      <ArrowUp size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveGallery(idx, 'down')}
                      disabled={idx === galleryImages.length - 1}
                      className="p-1 hover:bg-white/10 text-white/70 rounded disabled:opacity-20"
                      title="Mover después"
                    >
                      <ArrowDown size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryUrl(idx)}
                      className="p-1 hover:bg-red-950 text-red-400 rounded"
                      title="Eliminar URL"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[11px] text-white/40 italic">
            No hay imágenes secundarias en la galería.
          </p>
        )}
      </div>

    </div>
  );
};

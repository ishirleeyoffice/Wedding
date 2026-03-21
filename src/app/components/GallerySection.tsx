import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

const photos = [
  "https://images.unsplash.com/photo-1660294502608-d65e5c62f244?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjB3ZWRkaW5nJTIwY291cGxlfGVufDF8fHx8MTc3Mjg0MzE2M3ww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1606203947280-002271a37eb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwcmluZ3MlMjBjbG9zZXVwfGVufDF8fHx8MTc3MjgxOTY4Nnww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1769868628482-528d35164ae9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwd2VkZGluZyUyMGJvdXF1ZXR8ZW58MXx8fHwxNzcyODQzMTYzfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1521543387600-c745f8e83d77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwdmVudWUlMjBoYWxsfGVufDF8fHx8MTc3MjgzNTA2OXww&ixlib=rb-4.1.0&q=80&w=1080",
];

export function GallerySection() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const openImage = (index: number) => {
    setSelectedImage(index);
    document.body.style.overflow = "hidden";
  };

  const closeImage = () => {
    setSelectedImage(null);
    document.body.style.overflow = "unset";
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % photos.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + photos.length) % photos.length);
    }
  };

  return (
    <section className="py-20 px-6 bg-[#FAF9F8]">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
        }}
      >
        <h2 className="text-xl font-medium font-['Noto_Serif_KR'] text-gray-800 mb-10 text-center">
          우리의 순간
        </h2>

        <div className="grid grid-cols-2 gap-2">
          {photos.map((src, index) => (
            <div
              key={index}
              onClick={() => openImage(index)}
              className="aspect-square cursor-pointer overflow-hidden rounded-md bg-gray-200 shadow-sm transition-transform hover:scale-[1.02] active:scale-95"
            >
              <img
                src={src}
                alt={`Gallery ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeImage}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm touch-none"
          >
            <button
              onClick={closeImage}
              className="absolute top-6 right-6 z-50 p-2 text-white/70 hover:text-white transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            
            <div className="relative w-full h-full flex items-center justify-center p-4">
              <button
                onClick={prevImage}
                className="absolute left-4 p-3 bg-black/20 hover:bg-black/40 rounded-full text-white/80 transition-all"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>

              <motion.img
                key={selectedImage}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                src={photos[selectedImage]}
                alt={`Gallery Focus ${selectedImage + 1}`}
                className="max-w-full max-h-full object-contain pointer-events-none rounded-lg"
              />

              <button
                onClick={nextImage}
                className="absolute right-4 p-3 bg-black/20 hover:bg-black/40 rounded-full text-white/80 transition-all"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </div>
            
            <div className="absolute bottom-8 left-0 right-0 text-center text-white/60 text-sm font-['Gowun_Dodum']">
              {selectedImage + 1} / {photos.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

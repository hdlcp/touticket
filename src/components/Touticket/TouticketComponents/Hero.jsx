
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
 import carroussel1 from "@/assets/images/carroussel1.png";
 import carroussel2 from "@/assets/images/carroussel2.png";
 import carroussel3 from "@/assets/images/carroussel3.png";
 import carroussel4 from "@/assets/images/carroussel4.png";
 import carroussel5 from "@/assets/images/carroussel5.png";
 import carroussel6 from "@/assets/images/carroussel6.png";






const slides = [
  {
    image: carroussel1,
    title: "REVIVEZ LES MOMENTS FORTS DE L'EPAC"
  },
  {
    image: carroussel2,
    title: "CAPTUREZ CHAQUE INSTANT MAGIQUE"
  },
  {
    image: carroussel3,
    title: "PARTAGEZ VOS PLUS BEAUX SOUVENIRS"
  },
  {
    image: carroussel4,
    title: "DECOUVREZ LES EVENEMENTS EPAC"
  },
   {
    image: carroussel5,
    title: "DECOUVREZ LES EVENEMENTS EPAC"
  },
   {
    image: carroussel6,
    title: "PARTAGEZ VOS PLUS BEAUX SOUVENIRS"
  }
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Auto-play
  useEffect(() => {
    if (isPaused) return;
    
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, current]);

  return (
    <section 
      className="relative bg-[url(/src/assets/images/heroBg.png)] w-full h-[60vh] sm:h-[70vh] md:h-[85vh] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 pb-6 px-4 sm:pb-8 sm:px-6 md:pb-10 md:px-10 transition-all duration-1000 ease-in-out
            ${current === index ? "opacity-100 translate-x-0 z-10" : "opacity-0 -translate-x-10 z-0"}`}
        >
          <img src={slide.image} className="w-full h-full object-cover" alt={`Slide ${index + 1}`} />
          <div className="absolute inset-0 bg-black/45" />
        </div>
      ))}

      {/* Texte */}
      <div className="absolute inset-0 flex justify-center items-center z-20 px-4">
        <h1 
          key={current}
          className="text-white px-4 sm:px-8 max-w-xl sm:max-w-2xl md:max-w-4xl lg:max-w-6xl font-display text-xl sm:text-3xl md:text-5xl lg:text-6xl text-center leading-tight"
        >
          {slides[current].title}
        </h1>
      </div>

      {/* Boutons de navigation */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 z-30
                   bg-white/10 hover:bg-white/20 backdrop-blur-sm
                   text-white p-1.5 sm:p-2 md:p-2 rounded-full
                   transition-all duration-300 ease-out
                   hover:scale-110 active:scale-95
                   border border-white/20
                   group"
        aria-label="Slide précédent"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 group-hover:-translate-x-0.5 transition-transform" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 z-30
                   bg-white/10 hover:bg-white/20 backdrop-blur-sm
                   text-white p-1.5 sm:p-2 md:p-2 rounded-full
                   transition-all duration-300 ease-out
                   hover:scale-110 active:scale-95
                   border border-white/20
                   group"
        aria-label="Slide suivant"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Indicateurs de progression (dots) */}
      <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 w-full flex justify-center gap-2 sm:gap-2.5 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-1.5 sm:h-2 rounded-full transition-all duration-500 ease-out
                       hover:bg-white/80 cursor-pointer
              ${current === index 
                ? "bg-white w-8 sm:w-10 md:w-12" 
                : "bg-white/40 w-1.5 sm:w-2 hover:w-3 sm:hover:w-4"
              }`}
            aria-label={`Aller au slide ${index + 1}`}
          />
        ))}
      </div>

      <style >{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
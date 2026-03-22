import { Icon } from "@iconify/react";
import logo from "@/assets/logo/touticket-logo.svg";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-6 px-4 md:px-8 lg:px-16 mt-14">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Logo et nom */}
        <div className="flex items-center gap-2">
          <img 
            src={logo} 
            alt="EPAC Events Logo"
            className="w-8 h-8 object-contain"
          />
          <span className=" font-display text-lg">TOUTICKET</span>
        </div>

        {/* Copyright */}
        <div className="text-sm text-gray-400 text-center">
          © 2026 <a href="https://oloukpedeadeniyiprosper.pro" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors underline">Nunc Consulting</a>. Tous droits réservés.
        </div>

        {/* Réseaux sociaux */}
        <div className="flex items-center gap-2">
          <a 
            href="https://youtube.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-red-500 transition-colors"
            aria-label="YouTube"
          >
            <Icon icon="mdi:youtube" width="24" height="24" />
          </a>
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-pink-500 transition-colors"
            aria-label="Instagram"
          >
            <Icon icon="ri:instagram-line" width="24" height="24" />
          </a>
          <a 
            href="https://tiktok.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-gray-300 transition-colors"
            aria-label="TikTok"
          >
            <Icon icon="ic:sharp-tiktok" width="24" height="24" />
          </a>
          <a 
            href="https://twitter.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition-colors"
            aria-label="Twitter/X"
          >
            <Icon icon="prime:twitter" width="24" height="24" />
          </a>
          <a 
            href="https://facebook.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-blue-600 transition-colors"
            aria-label="Facebook"
          >
            <Icon icon="uil:facebook" width="24" height="24" />
          </a>
        </div>
      </div>
    </footer>
  );
}
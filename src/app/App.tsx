import React from "react";
import { HeroSection } from "./components/HeroSection";
import { GreetingSection } from "./components/GreetingSection";
import { GallerySection } from "./components/GallerySection";
import { LocationSection } from "./components/LocationSection";
import { AccountSection } from "./components/AccountSection";
import { GuestbookSection } from "./components/GuestbookSection";
import { RsvpSection } from "./components/RsvpSection";
import "../styles/fonts.css";

export default function App() {
  return (
    <div className="min-h-screen bg-[#f4f4f4] text-gray-900 font-['Gowun_Dodum'] selection:bg-pink-100">
      {/* Mobile Wrapper */}
      <div className="mx-auto w-full max-w-[480px] bg-white min-h-screen shadow-2xl relative overflow-x-hidden">
        
        {/* Decorative top pattern */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-100 via-pink-200 to-pink-100 opacity-80" />
        
        <main>
          <HeroSection />
          <GreetingSection />
          <GallerySection />
          <LocationSection />
          <AccountSection />
          <GuestbookSection />
          <RsvpSection />
        </main>
        
        <footer className="py-8 text-center text-xs text-gray-400 bg-[#FAF9F8] border-t border-gray-100 font-sans">
          <p>© 2026 Sungmin & Jieun.</p>
          <p className="mt-1">Created with Figma Make</p>
        </footer>
      </div>
    </div>
  );
}

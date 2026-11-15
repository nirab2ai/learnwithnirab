import React, { useState } from 'react';
import { MessageCircle, Phone, X } from 'lucide-react';
import { StoreSettings } from '../../types';

interface FloatingContactProps {
  settings: StoreSettings;
}

export const FloatingContact: React.FC<FloatingContactProps> = ({ settings }) => {
  const [isOpen, setIsOpen] = useState(false);

  const whatsappNum = settings.whatsapp || '01733044222';
  const phone1 = settings.phone1 || '01733044222';
  const phone2 = settings.phone2 || '01726590653';

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2.5">
      {/* Expanded Quick Options */}
      {isOpen && (
        <div className="flex flex-col gap-2 rounded-xl border border-[#2B2B2B] bg-[#161616] p-3 shadow-2xl text-white animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between gap-4 pb-2 border-b border-[#262626]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#C5A46D]">
              Direct Contact
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-neutral-400 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <a
            href={`https://wa.me/88${whatsappNum}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 rounded-lg bg-[#25D366] px-3.5 py-2 text-xs font-bold text-black transition-transform hover:scale-105"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Chat on WhatsApp</span>
          </a>

          <a
            href={`tel:${phone1}`}
            className="flex items-center gap-2.5 rounded-lg bg-[#1F1F1F] px-3.5 py-2 text-xs font-semibold text-white border border-[#333333] hover:border-[#C5A46D]"
          >
            <Phone className="h-4 w-4 text-[#C5A46D]" />
            <span>Call {phone1}</span>
          </a>

          <a
            href={`tel:${phone2}`}
            className="flex items-center gap-2.5 rounded-lg bg-[#1F1F1F] px-3.5 py-2 text-xs font-semibold text-white border border-[#333333] hover:border-[#C5A46D]"
          >
            <Phone className="h-4 w-4 text-[#C5A46D]" />
            <span>Call {phone2}</span>
          </a>
        </div>
      )}

      {/* Main Trigger Button */}
      <div className="flex items-center gap-2">
        <a
          href={`https://wa.me/88${whatsappNum}?text=Hello%20Classy%20Nirab,%20I%20would%20like%20to%20inquire%20about%20your%20products.`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-black shadow-xl shadow-[#25D366]/30 transition-transform hover:scale-110 active:scale-95"
          title="Chat on WhatsApp"
        >
          <MessageCircle className="h-6 w-6" />
        </a>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#C5A46D] text-black shadow-xl shadow-[#C5A46D]/30 transition-transform hover:scale-110 active:scale-95"
          title="Instant Support"
        >
          <Phone className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, Ruler } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'tops' | 'panjabi' | 'bottoms'>('tops');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-xl rounded-xl border border-[#2B2B2B] bg-[#161616] p-6 text-white shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-[#262626] pb-4">
          <div className="flex items-center gap-2">
            <Ruler className="h-5 w-5 text-[#C5A46D]" />
            <h3 className="font-serif text-lg font-bold text-white">
              CLASSY NIRAB • Size Guide
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-neutral-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-[#262626] py-3 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('tops')}
            className={`px-3 py-1.5 rounded transition-all ${
              activeTab === 'tops'
                ? 'bg-[#C5A46D] text-black font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Polos & T-Shirts
          </button>
          <button
            onClick={() => setActiveTab('panjabi')}
            className={`px-3 py-1.5 rounded transition-all ${
              activeTab === 'panjabi'
                ? 'bg-[#C5A46D] text-black font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Heritage Panjabi
          </button>
          <button
            onClick={() => setActiveTab('bottoms')}
            className={`px-3 py-1.5 rounded transition-all ${
              activeTab === 'bottoms'
                ? 'bg-[#C5A46D] text-black font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Pants & Jeans
          </button>
        </div>

        {/* Measurement Table */}
        <div className="py-4 overflow-x-auto text-xs">
          {activeTab === 'tops' && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#333333] text-neutral-400 uppercase tracking-wider">
                  <th className="py-2 px-3">Size</th>
                  <th className="py-2 px-3">Chest (Inches)</th>
                  <th className="py-2 px-3">Length (Inches)</th>
                  <th className="py-2 px-3">Sleeve</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262626] text-neutral-200">
                <tr>
                  <td className="py-2 px-3 font-bold text-[#C5A46D]">S</td>
                  <td className="py-2 px-3">38"</td>
                  <td className="py-2 px-3">27"</td>
                  <td className="py-2 px-3">7.5"</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-bold text-[#C5A46D]">M</td>
                  <td className="py-2 px-3">40"</td>
                  <td className="py-2 px-3">28"</td>
                  <td className="py-2 px-3">8.0"</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-bold text-[#C5A46D]">L</td>
                  <td className="py-2 px-3">42"</td>
                  <td className="py-2 px-3">29"</td>
                  <td className="py-2 px-3">8.5"</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-bold text-[#C5A46D]">XL</td>
                  <td className="py-2 px-3">44"</td>
                  <td className="py-2 px-3">30"</td>
                  <td className="py-2 px-3">9.0"</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-bold text-[#C5A46D]">XXL</td>
                  <td className="py-2 px-3">46"</td>
                  <td className="py-2 px-3">31"</td>
                  <td className="py-2 px-3">9.5"</td>
                </tr>
              </tbody>
            </table>
          )}

          {activeTab === 'panjabi' && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#333333] text-neutral-400 uppercase tracking-wider">
                  <th className="py-2 px-3">Size</th>
                  <th className="py-2 px-3">Chest</th>
                  <th className="py-2 px-3">Length</th>
                  <th className="py-2 px-3">Collar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262626] text-neutral-200">
                <tr>
                  <td className="py-2 px-3 font-bold text-[#C5A46D]">M (40)</td>
                  <td className="py-2 px-3">40"</td>
                  <td className="py-2 px-3">40"</td>
                  <td className="py-2 px-3">15.5"</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-bold text-[#C5A46D]">L (42)</td>
                  <td className="py-2 px-3">42"</td>
                  <td className="py-2 px-3">42"</td>
                  <td className="py-2 px-3">16.0"</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-bold text-[#C5A46D]">XL (44)</td>
                  <td className="py-2 px-3">44"</td>
                  <td className="py-2 px-3">44"</td>
                  <td className="py-2 px-3">16.5"</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-bold text-[#C5A46D]">XXL (46)</td>
                  <td className="py-2 px-3">46"</td>
                  <td className="py-2 px-3">45"</td>
                  <td className="py-2 px-3">17.0"</td>
                </tr>
              </tbody>
            </table>
          )}

          {activeTab === 'bottoms' && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#333333] text-neutral-400 uppercase tracking-wider">
                  <th className="py-2 px-3">Size</th>
                  <th className="py-2 px-3">Waist (Inches)</th>
                  <th className="py-2 px-3">Length (Inches)</th>
                  <th className="py-2 px-3">Thigh</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262626] text-neutral-200">
                <tr>
                  <td className="py-2 px-3 font-bold text-[#C5A46D]">M (30-31)</td>
                  <td className="py-2 px-3">30-31"</td>
                  <td className="py-2 px-3">39"</td>
                  <td className="py-2 px-3">22"</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-bold text-[#C5A46D]">L (32-33)</td>
                  <td className="py-2 px-3">32-33"</td>
                  <td className="py-2 px-3">40"</td>
                  <td className="py-2 px-3">23"</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-bold text-[#C5A46D]">XL (34-35)</td>
                  <td className="py-2 px-3">34-35"</td>
                  <td className="py-2 px-3">41"</td>
                  <td className="py-2 px-3">24"</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-bold text-[#C5A46D]">XXL (36-38)</td>
                  <td className="py-2 px-3">36-38"</td>
                  <td className="py-2 px-3">42"</td>
                  <td className="py-2 px-3">25"</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>

        <p className="border-t border-[#262626] pt-3 text-[11px] text-neutral-400">
          💡 If you fall between two sizes, we recommend choosing the larger size for a relaxed comfortable fit or contact us via WhatsApp for personalized sizing assistance.
        </p>
      </div>
    </div>
  );
};

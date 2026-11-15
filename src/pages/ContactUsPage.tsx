import React, { useState } from 'react';
import {
  MessageCircle,
  Phone,
  Mail,
  Facebook,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  ShieldCheck,
} from 'lucide-react';
import { StoreSettings } from '../types';

interface ContactUsPageProps {
  settings: StoreSettings;
}

export const ContactUsPage: React.FC<ContactUsPageProps> = ({ settings }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const whatsappLink = `https://wa.me/88${settings.whatsapp || '01733044222'}`;
  const phone1 = settings.phone1 || '01733044222';
  const phone2 = settings.phone2 || '01726590653';
  const emailAddr = settings.email || 'nirab2ai@gmail.com';
  const fbLink = settings.facebookUrl || 'https://www.facebook.com/profile.php?id=61594699696202';

  return (
    <div className="min-h-screen bg-[#F7F7F5] py-12 sm:py-20">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C5A46D]">
            REACH OUT TO US
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#111111] mt-1">
            Contact & VIP Concierge
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-2">
            Have questions about sizes, bespoke orders, or delivery status? Our dedicated fashion consultants are available 7 days a week.
          </p>
        </div>

        {/* 4 Clickable Primary Contact Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-14">
          {/* WhatsApp */}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-xl border border-[#E0E0DB] bg-white p-6 shadow-xs hover:border-[#25D366] hover:shadow-lg transition-all flex flex-col items-center text-center"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366] mb-4 group-hover:scale-110 transition-transform">
              <MessageCircle className="h-7 w-7" />
            </div>
            <h3 className="font-serif text-base font-bold text-[#111111]">
              WhatsApp Direct
            </h3>
            <p className="text-xs text-neutral-500 mt-1 mb-3">
              Instant response for sizing, orders & photos
            </p>
            <span className="inline-block rounded-full bg-[#25D366] px-3.5 py-1 text-xs font-bold text-black group-hover:bg-[#1ebd59]">
              01733044222
            </span>
          </a>

          {/* Phone Calling */}
          <div className="group rounded-xl border border-[#E0E0DB] bg-white p-6 shadow-xs hover:border-[#C5A46D] hover:shadow-lg transition-all flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#C5A46D]/10 text-[#C5A46D] mb-4 group-hover:scale-110 transition-transform">
              <Phone className="h-7 w-7" />
            </div>
            <h3 className="font-serif text-base font-bold text-[#111111]">
              Phone Hotlines
            </h3>
            <p className="text-xs text-neutral-500 mt-1 mb-3">
              Call us directly (10 AM - 10 PM)
            </p>
            <div className="flex flex-col gap-1 w-full">
              <a
                href={`tel:${phone1}`}
                className="rounded bg-[#111111] px-3 py-1 text-xs font-bold text-[#C5A46D] hover:bg-black"
              >
                Call: {phone1}
              </a>
              <a
                href={`tel:${phone2}`}
                className="rounded bg-neutral-100 px-3 py-1 text-xs font-bold text-neutral-800 hover:bg-neutral-200"
              >
                Call: {phone2}
              </a>
            </div>
          </div>

          {/* Email */}
          <a
            href={`mailto:${emailAddr}`}
            className="group rounded-xl border border-[#E0E0DB] bg-white p-6 shadow-xs hover:border-[#C5A46D] hover:shadow-lg transition-all flex flex-col items-center text-center"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#111111] text-[#C5A46D] mb-4 group-hover:scale-110 transition-transform">
              <Mail className="h-7 w-7" />
            </div>
            <h3 className="font-serif text-base font-bold text-[#111111]">
              Email Us
            </h3>
            <p className="text-xs text-neutral-500 mt-1 mb-3">
              Official store queries & corporate gifts
            </p>
            <span className="inline-block rounded-full border border-neutral-300 px-3 py-1 text-xs font-bold text-neutral-800 truncate max-w-full">
              {emailAddr}
            </span>
          </a>

          {/* Facebook */}
          <a
            href={fbLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-xl border border-[#E0E0DB] bg-white p-6 shadow-xs hover:border-[#1877F2] hover:shadow-lg transition-all flex flex-col items-center text-center"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1877F2]/10 text-[#1877F2] mb-4 group-hover:scale-110 transition-transform">
              <Facebook className="h-7 w-7" />
            </div>
            <h3 className="font-serif text-base font-bold text-[#111111]">
              Facebook Page
            </h3>
            <p className="text-xs text-neutral-500 mt-1 mb-3">
              Follow latest collections, drops & reels
            </p>
            <span className="inline-block rounded-full bg-[#1877F2] px-3.5 py-1 text-xs font-bold text-white group-hover:bg-blue-700">
              Visit Profile
            </span>
          </a>
        </div>

        {/* Contact Form & Studio Details */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 bg-white rounded-2xl border border-[#E0E0DB] p-6 sm:p-12 shadow-xs">
          {/* Left: Message Form */}
          <div className="lg:col-span-7">
            <h2 className="font-serif text-2xl font-bold text-[#111111] mb-2">
              Send Us a Message
            </h2>
            <p className="text-xs text-neutral-500 mb-6">
              Fill out the form below and our fashion team will respond within 2-4 business hours.
            </p>

            {submitted ? (
              <div className="rounded-xl bg-emerald-50 p-6 text-center border border-emerald-200">
                <CheckCircle className="h-10 w-10 text-emerald-600 mx-auto mb-2" />
                <h3 className="font-bold text-sm text-emerald-900">
                  Message Sent Successfully!
                </h3>
                <p className="text-xs text-emerald-700 mt-1 mb-4">
                  Thank you for reaching out to Classy Nirab. We have received your message.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="rounded-sm bg-[#111111] px-5 py-2 text-xs font-bold text-[#C5A46D]"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Asif Mahmud"
                      className="w-full rounded border border-[#D0D0CA] bg-white px-3 py-2.5 text-xs text-neutral-900 focus:border-[#C5A46D] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="017XXXXXXXX"
                      className="w-full rounded border border-[#D0D0CA] bg-white px-3 py-2.5 text-xs text-neutral-900 focus:border-[#C5A46D] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full rounded border border-[#D0D0CA] bg-white px-3 py-2.5 text-xs text-neutral-900 focus:border-[#C5A46D] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Your Inquiry / Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what product, size, or assistance you are inquiring about..."
                    className="w-full rounded border border-[#D0D0CA] bg-white px-3 py-2.5 text-xs text-neutral-900 focus:border-[#C5A46D] focus:outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-sm bg-[#111111] px-7 py-3 text-xs font-extrabold uppercase tracking-widest text-[#C5A46D] hover:bg-[#C5A46D] hover:text-black transition-all"
                >
                  <Send className="h-4 w-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>

          {/* Right: Operational Information */}
          <div className="lg:col-span-5 lg:border-l lg:border-[#EAEAE5] lg:pl-10 space-y-6">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#111111] mb-1">
                Store Concierge
              </h3>
              <p className="text-xs text-neutral-500">
                Crafted for excellence with personalized bespoke client care.
              </p>
            </div>

            <div className="space-y-4 text-xs text-neutral-700">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#C5A46D] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-neutral-900 block">Atelier & Distribution:</strong>
                  <span>House #24, Road #11, Banani / Uttara, Dhaka, Bangladesh</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-[#C5A46D] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-neutral-900 block">Customer Service Hours:</strong>
                  <span>Everyday: 10:00 AM – 10:00 PM (Bangladesh Standard Time)</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-[#C5A46D] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-neutral-900 block">Direct Store Hotline:</strong>
                  <span>01733044222 / 01726590653</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-[#FAFAF8] p-4 border border-[#E8E8E3] text-xs text-neutral-600">
              <p className="font-semibold text-neutral-900 mb-1">
                Need Instant Order Assistance?
              </p>
              <p className="text-[11px] leading-relaxed mb-3">
                Tap below to chat with our senior consultant on WhatsApp with one click.
              </p>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded bg-[#25D366] px-4 py-2 text-xs font-bold text-black"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Chat Now on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

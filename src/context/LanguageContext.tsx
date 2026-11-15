import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'bn';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    brand_tagline: 'STYLE • QUALITY • ELEGANCE',
    nav_home: 'Home',
    nav_shop: 'Shop All',
    nav_categories: 'Categories',
    nav_new_arrivals: 'New Arrivals',
    nav_best_sellers: 'Best Sellers',
    nav_panjabi: 'Panjabi',
    nav_winter: 'Winter Collection',
    nav_about: 'About Us',
    nav_contact: 'Contact Us',
    nav_admin: 'Admin Panel',
    nav_my_orders: 'My Orders',
    nav_my_profile: 'My Profile',
    nav_login: 'Login',
    nav_register: 'Register',
    nav_logout: 'Logout',
    search_placeholder: 'Search for luxury polos, panjabis, t-shirts, denim...',
    shop_now: 'Shop Now',
    add_to_cart: 'Add to Bag',
    buy_now: 'Buy It Now',
    in_stock: 'In Stock',
    out_of_stock: 'Out of Stock',
    free_delivery_badge: 'Free Shipping Available',
    cash_on_delivery: 'Cash on Delivery Available',
    exchange_guarantee: '7-Day Easy Exchange',
    cart_title: 'Your Shopping Bag',
    cart_empty: 'Your shopping bag is empty',
    cart_empty_sub: 'Discover our luxury collection and find your signature style.',
    continue_shopping: 'Continue Shopping',
    checkout: 'Proceed to Checkout',
    subtotal: 'Subtotal',
    delivery_fee: 'Delivery Fee',
    total: 'Total',
    inside_dhaka: 'Inside Dhaka (৳70)',
    outside_dhaka: 'Outside Dhaka (৳130)',
    order_notes: 'Order Notes / Delivery Instructions (Optional)',
    place_order: 'Confirm & Place Order',
    order_placed_title: 'Order Confirmed!',
    order_placed_msg: 'Thank you for shopping with Classy Nirab. Your order has been registered.',
    order_number: 'Order Number',
    order_status: 'Order Status',
    full_name: 'Full Name',
    phone_number: 'Phone Number (e.g. 01733044222)',
    email_address: 'Email Address',
    delivery_address: 'Full Street Address, House & Road',
    district: 'Select District',
    delivery_area: 'Delivery Area',
    filter_by: 'Filter By',
    sort_by: 'Sort By',
    price_low_high: 'Price: Low to High',
    price_high_low: 'Price: High to Low',
    newest: 'Newest First',
    size_guide: 'Size Guide',
    care_instructions: 'Fabric & Care',
    customer_reviews: 'Customer Reviews',
    verified_buyer: 'Verified Buyer',
    currency_symbol: '৳',
    whatsapp_order: 'Order via WhatsApp',
    call_us: 'Call Us Now',
  },
  bn: {
    brand_tagline: 'স্টাইল • কোয়ালিটি • এলিগ্যান্স',
    nav_home: 'হোম',
    nav_shop: 'সব পণ্য',
    nav_categories: 'ক্যাটাগরি',
    nav_new_arrivals: 'নতুন কালেকশন',
    nav_best_sellers: 'বেস্ট সেলার',
    nav_panjabi: 'পাঞ্জাবি',
    nav_winter: 'উইন্টার কালেকশন',
    nav_about: 'আমাদের সম্পর্কে',
    nav_contact: 'যোগাযোগ',
    nav_admin: 'অ্যাডমিন প্যানেল',
    nav_my_orders: 'আমার অর্ডার',
    nav_my_profile: 'আমার প্রোফাইল',
    nav_login: 'লগইন',
    nav_register: 'রেজিস্টার',
    nav_logout: 'লগআউট',
    search_placeholder: 'পোলো, পাঞ্জাবি, টি-শার্ট বা ডেনিম খুঁজুন...',
    shop_now: 'কেনাকাটা করুন',
    add_to_cart: 'ব্যাগে যোগ করুন',
    buy_now: 'এখনই কিনুন',
    in_stock: 'স্টকে আছে',
    out_of_stock: 'স্টক শেষ',
    free_delivery_badge: 'ফ্রি ডেলিভারি অফার',
    cash_on_delivery: 'ক্যাশ অন ডেলিভারি সুবিধা',
    exchange_guarantee: '৭ দিনের সহজ এক্সচেঞ্জ গ্যারান্টি',
    cart_title: 'আপনার শপিং ব্যাগ',
    cart_empty: 'আপনার শপিং ব্যাগ খালি',
    cart_empty_sub: 'আমাদের প্রিমিয়াম কালেকশন থেকে আপনার পছন্দের পোশাক বেছে নিন।',
    continue_shopping: 'কেনাকাটা চালিয়ে যান',
    checkout: 'চেকআউট করুন',
    subtotal: 'সাবটোটাল',
    delivery_fee: 'ডেলিভারি চার্জ',
    total: 'সর্বমোট',
    inside_dhaka: 'ঢাকার ভিতরে (৳৭০)',
    outside_dhaka: 'ঢাকার বাইরে (৳১৩০)',
    order_notes: 'বিশেষ নির্দেশাবলী (ঐচ্ছিক)',
    place_order: 'অর্ডার নিশ্চিত করুন',
    order_placed_title: 'অর্ডার সফলভাবে গ্রহণ করা হয়েছে!',
    order_placed_msg: 'ক্লাসি নীরবের সাথে কেনাকাটার জন্য ধন্যবাদ। শীঘ্রই আমাদের টিম আপনার সাথে যোগাযোগ করবে।',
    order_number: 'অর্ডার নম্বর',
    order_status: 'অর্ডার স্ট্যাটাস',
    full_name: 'সম্পূর্ণ নাম',
    phone_number: 'মোবাইল নম্বর (যেমন ০১৭১২******)',
    email_address: 'ইমেইল অ্যাড্রেস',
    delivery_address: 'সম্পূর্ণ ডেলিভারি ঠিকানা',
    district: 'জেলা নির্বাচন করুন',
    delivery_area: 'ডেলিভারি এরিয়া',
    filter_by: 'ফিল্টার',
    sort_by: 'সাজান',
    price_low_high: 'দাম: কম থেকে বেশি',
    price_high_low: 'দাম: বেশি থেকে কম',
    newest: 'সর্বশেষ সংযোজিত',
    size_guide: 'সাইজ চার্ট',
    care_instructions: 'ফেব্রিক ও যত্ন',
    customer_reviews: 'গ্রাহকদের রিভিউ',
    verified_buyer: 'ভেরিফাইড ক্রেতা',
    currency_symbol: '৳',
    whatsapp_order: 'হোয়াটসঅ্যাপে অর্ডার করুন',
    call_us: 'সরাসরি কল করুন',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('classy_nirab_lang');
    return saved === 'bn' ? 'bn' : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('classy_nirab_lang', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

import React, { useState } from 'react';
import {
  User,
  Package,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Edit2,
  Check,
  ArrowRight,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BANGLADESH_DISTRICTS } from '../data/initialData';
import { DeliveryZone } from '../types';

interface CustomerDashboardProps {
  navigate: (path: string) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ navigate }) => {
  const { currentUser, userProfile, isAdmin, logout, updateCustomerProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(userProfile?.displayName || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [address, setAddress] = useState(userProfile?.address || '');
  const [district, setDistrict] = useState(userProfile?.district || 'Dhaka');
  const [deliveryArea, setDeliveryArea] = useState<DeliveryZone>(userProfile?.deliveryArea || 'inside_dhaka');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!currentUser) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <User className="h-12 w-12 text-[#C5A46D] mb-3" />
        <h2 className="font-serif text-2xl font-bold text-[#111111] mb-2">
          Sign In Required
        </h2>
        <p className="text-xs text-neutral-500 mb-6">
          Please sign in to view your profile and order history.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="rounded-sm bg-[#111111] px-6 py-2.5 text-xs font-bold text-[#C5A46D] hover:bg-[#C5A46D] hover:text-black transition-colors"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateCustomerProfile({
        displayName: displayName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        district,
        deliveryArea,
      });
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F5] py-10 sm:py-16">
      <div className="mx-auto max-w-5xl px-4">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E0E0DB] pb-5 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C5A46D]">
              CUSTOMER PORTAL
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#111111] mt-1">
              Welcome, {userProfile?.displayName || currentUser.email?.split('@')[0]}
            </h1>
            <p className="text-xs text-neutral-500">
              Manage your personal shipping details, addresses, and view previous orders.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <button
                onClick={() => navigate('/admin')}
                className="inline-flex items-center gap-2 rounded-sm bg-[#C5A46D] px-4 py-2 text-xs font-bold text-black hover:bg-[#dfca9b] transition-all"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Admin Dashboard</span>
              </button>
            )}
            <button
              onClick={() => logout()}
              className="inline-flex items-center gap-1.5 rounded-sm border border-neutral-300 bg-white px-4 py-2 text-xs font-bold text-neutral-700 hover:border-black transition-all"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {saveSuccess && (
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 border border-emerald-200">
            <Check className="h-4 w-4 text-emerald-600" />
            <span>Profile and shipping details updated successfully!</span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left card: Summary & Links */}
          <div className="space-y-4">
            <div className="rounded-xl border border-[#E0E0DB] bg-white p-6 shadow-xs">
              <div className="flex items-center gap-3 pb-4 border-b border-[#EAEAE5]">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#111111] text-[#C5A46D] font-bold text-lg">
                  {(userProfile?.displayName?.[0] || currentUser.email?.[0] || 'U').toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-semibold text-neutral-900 truncate text-sm">
                    {userProfile?.displayName || 'Customer'}
                  </h3>
                  <p className="text-xs text-neutral-500 truncate">{currentUser.email}</p>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <button
                  onClick={() => navigate('/my-orders')}
                  className="flex w-full items-center justify-between rounded-lg bg-[#FAFAF8] p-3 text-xs font-bold text-neutral-900 hover:bg-[#F2F2EE] transition-colors border border-[#E8E8E3]"
                >
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-[#C5A46D]" />
                    <span>View My Orders</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-neutral-400" />
                </button>

                <button
                  onClick={() => navigate('/shop')}
                  className="flex w-full items-center justify-between rounded-lg bg-[#FAFAF8] p-3 text-xs font-bold text-neutral-900 hover:bg-[#F2F2EE] transition-colors border border-[#E8E8E3]"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#C5A46D]" />
                    <span>Browse Catalog</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-neutral-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Right card: Profile information form */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-[#E0E0DB] bg-white p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-[#EAEAE5] pb-4">
                <h3 className="font-serif text-lg font-bold text-[#111111]">
                  Personal & Delivery Profile
                </h3>
                {!isEditing ? (
                  <button
                    onClick={() => {
                      setDisplayName(userProfile?.displayName || '');
                      setPhone(userProfile?.phone || '');
                      setAddress(userProfile?.address || '');
                      setDistrict(userProfile?.district || 'Dhaka');
                      setDeliveryArea(userProfile?.deliveryArea || 'inside_dhaka');
                      setIsEditing(true);
                    }}
                    className="flex items-center gap-1.5 rounded-sm bg-[#111111] px-3.5 py-1.5 text-xs font-bold text-[#C5A46D] hover:bg-[#C5A46D] hover:text-black transition-colors"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-xs text-neutral-500 hover:text-black underline"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {!isEditing ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                  <div>
                    <span className="font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                      Full Name
                    </span>
                    <p className="text-neutral-900 font-semibold text-sm">
                      {userProfile?.displayName || 'Not provided'}
                    </p>
                  </div>

                  <div>
                    <span className="font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                      Email Address
                    </span>
                    <p className="text-neutral-900 font-semibold text-sm">
                      {currentUser.email}
                    </p>
                  </div>

                  <div>
                    <span className="font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                      Phone Number
                    </span>
                    <p className="text-neutral-900 font-semibold text-sm">
                      {userProfile?.phone || 'Not provided'}
                    </p>
                  </div>

                  <div>
                    <span className="font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                      Default District
                    </span>
                    <p className="text-neutral-900 font-semibold text-sm">
                      {userProfile?.district || 'Dhaka'} (
                      {userProfile?.deliveryArea === 'outside_dhaka'
                        ? 'Outside Dhaka'
                        : 'Inside Dhaka'}
                      )
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <span className="font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                      Shipping Address
                    </span>
                    <p className="text-neutral-900 leading-relaxed font-semibold">
                      {userProfile?.address || 'No default delivery address configured yet.'}
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full rounded border border-[#D0D0CA] bg-white px-3 py-2 text-xs focus:border-[#C5A46D] focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="017XXXXXXXX"
                        className="w-full rounded border border-[#D0D0CA] bg-white px-3 py-2 text-xs focus:border-[#C5A46D] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                        District
                      </label>
                      <select
                        value={district}
                        onChange={(e) => {
                          const val = e.target.value;
                          setDistrict(val);
                          setDeliveryArea(val === 'Dhaka' ? 'inside_dhaka' : 'outside_dhaka');
                        }}
                        className="w-full rounded border border-[#D0D0CA] bg-white px-3 py-2 text-xs focus:border-[#C5A46D] focus:outline-hidden"
                      >
                        {BANGLADESH_DISTRICTS.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      Delivery Address
                    </label>
                    <textarea
                      rows={3}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="House, Road, Area, Thana"
                      className="w-full rounded border border-[#D0D0CA] bg-white px-3 py-2 text-xs focus:border-[#C5A46D] focus:outline-hidden"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-sm bg-[#111111] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#C5A46D] hover:bg-[#C5A46D] hover:text-black transition-colors"
                  >
                    {saving ? 'Saving Changes...' : 'Save Profile Details'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

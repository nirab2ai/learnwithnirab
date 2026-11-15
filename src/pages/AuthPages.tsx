import React, { useState } from 'react';
import {
  Lock,
  Mail,
  User,
  Phone,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface AuthPagesProps {
  initialMode?: 'login' | 'register' | 'forgot';
  navigate: (path: string) => void;
}

export const AuthPages: React.FC<AuthPagesProps> = ({ initialMode = 'login', navigate }) => {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, sendPasswordReset, currentUser, isAdmin } = useAuth();
  const { t } = useLanguage();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (currentUser) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="h-14 w-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
          <CheckCircle className="h-8 w-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#111111] mb-2">
          You are currently signed in
        </h2>
        <p className="text-xs text-neutral-500 mb-6">
          Logged in as <strong>{currentUser.email}</strong>
        </p>

        <div className="flex flex-wrap gap-3">
          {isAdmin && (
            <button
              onClick={() => navigate('/admin')}
              className="rounded-sm bg-[#C5A46D] px-6 py-2.5 text-xs font-bold text-black hover:bg-[#dfca9b]"
            >
              Go to Admin Panel
            </button>
          )}
          <button
            onClick={() => navigate('/dashboard')}
            className="rounded-sm bg-[#111111] px-6 py-2.5 text-xs font-bold text-[#C5A46D] hover:bg-black"
          >
            My Profile & Orders
          </button>
          <button
            onClick={() => navigate('/shop')}
            className="rounded-sm border border-neutral-300 bg-white px-6 py-2.5 text-xs font-bold text-neutral-800 hover:border-black"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await signInWithEmail(email, password);
        navigate('/shop');
      } else if (mode === 'register') {
        if (!name.trim()) throw new Error('Please enter your full name.');
        if (password.length < 6) throw new Error('Password must be at least 6 characters.');
        await signUpWithEmail(email, password, name, phone);
        navigate('/shop');
      } else if (mode === 'forgot') {
        await sendPasswordReset(email);
        setSuccessMsg(`A password reset link has been dispatched to ${email}. Check your inbox.`);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      let friendly = err.message || 'An error occurred during authentication.';
      if (friendly.includes('auth/invalid-credential') || friendly.includes('auth/wrong-password')) {
        friendly = 'Invalid email or password. Please verify your credentials.';
      } else if (friendly.includes('auth/email-already-in-use')) {
        friendly = 'An account with this email already exists. Please sign in instead.';
      } else if (friendly.includes('auth/weak-password')) {
        friendly = 'Password is too weak. Please use at least 6 characters.';
      }
      setErrorMsg(friendly);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate('/shop');
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      setErrorMsg(err.message || 'Google sign-in was cancelled or encountered an error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F5] py-12 sm:py-20 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border border-[#E0E0DB] bg-white p-6 sm:p-8 shadow-sm">
        {/* Brand header */}
        <div className="text-center mb-6">
          <span className="font-serif text-lg font-bold tracking-widest text-[#111111] block">
            SHOP WITH <span className="text-[#C5A46D]">CLASSY NIRAB</span>
          </span>
          <span className="text-[9px] uppercase tracking-[0.3em] text-neutral-400 mt-0.5 block">
            STYLE • QUALITY • ELEGANCE
          </span>
        </div>

        {/* Mode Selector Tabs */}
        {mode !== 'forgot' && (
          <div className="grid grid-cols-2 gap-2 border-b border-neutral-200 pb-3 mb-6">
            <button
              onClick={() => {
                setMode('login');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`pb-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
                mode === 'login'
                  ? 'border-[#C5A46D] text-black'
                  : 'border-transparent text-neutral-400 hover:text-black'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode('register');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`pb-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
                mode === 'register'
                  ? 'border-[#C5A46D] text-black'
                  : 'border-transparent text-neutral-400 hover:text-black'
              }`}
            >
              Register
            </button>
          </div>
        )}

        {mode === 'forgot' && (
          <div className="border-b border-neutral-200 pb-3 mb-6">
            <h3 className="font-serif text-base font-bold text-neutral-900">
              Reset Your Password
            </h3>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              Enter your registered email to receive recovery instructions.
            </p>
          </div>
        )}

        {/* Alerts */}
        {errorMsg && (
          <div className="mb-4 flex items-center gap-2 rounded bg-red-50 p-3 text-xs text-red-700 border border-red-200">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 flex items-center gap-2 rounded bg-emerald-50 p-3 text-xs text-emerald-800 border border-emerald-200">
            <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Nirab Ahmed"
                  className="w-full rounded border border-[#D0D0CA] bg-white pl-9 pr-3 py-2 text-xs focus:border-[#C5A46D] focus:outline-hidden"
                />
              </div>
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Mobile Number (Optional)
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full rounded border border-[#D0D0CA] bg-white pl-9 pr-3 py-2 text-xs focus:border-[#C5A46D] focus:outline-hidden"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full rounded border border-[#D0D0CA] bg-white pl-9 pr-3 py-2 text-xs focus:border-[#C5A46D] focus:outline-hidden"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                  Password *
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setErrorMsg('');
                    }}
                    className="text-[11px] text-[#C5A46D] hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded border border-[#D0D0CA] bg-white pl-9 pr-3 py-2 text-xs focus:border-[#C5A46D] focus:outline-hidden"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-sm bg-[#111111] py-3 text-xs font-extrabold uppercase tracking-widest text-[#C5A46D] shadow-md hover:bg-[#C5A46D] hover:text-black transition-all active:scale-98 disabled:opacity-50"
          >
            {loading ? (
              <span>Processing...</span>
            ) : mode === 'login' ? (
              'Sign In'
            ) : mode === 'register' ? (
              'Create Account'
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        {/* Google sign-in */}
        {mode !== 'forgot' && (
          <div className="mt-5 space-y-4">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E5E5E0]" />
              </div>
              <span className="relative bg-white px-2 text-[10px] uppercase font-bold text-neutral-400">
                Or Continue With
              </span>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded border border-[#D5D5D0] bg-white py-2.5 text-xs font-semibold text-neutral-800 shadow-xs hover:border-black transition-all"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>
        )}

        {mode === 'forgot' && (
          <div className="mt-4 text-center">
            <button
              onClick={() => {
                setMode('login');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className="text-xs font-bold text-[#C5A46D] hover:underline"
            >
              ← Back to Sign In
            </button>
          </div>
        )}

        {/* Store Admin Notice */}
        <div className="mt-6 rounded-lg bg-neutral-50 p-3 text-[11px] text-neutral-500 border border-neutral-200">
          <div className="flex items-center gap-1.5 font-bold text-neutral-800 mb-0.5">
            <ShieldCheck className="h-3.5 w-3.5 text-[#C5A46D]" />
            <span>Store Owner Access</span>
          </div>
          Authorized store owner (<strong>nirab2ai@gmail.com</strong>) can sign in above to access the protected Admin Dashboard.
        </div>
      </div>
    </div>
  );
};

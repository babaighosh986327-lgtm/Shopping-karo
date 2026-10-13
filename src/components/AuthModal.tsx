import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { 
    signInWithGoogle, 
    loginWithEmail, 
    registerWithEmail, 
    toggleAdminSimulate, 
    isSimulatingAdmin,
    currentUser 
  } = useAuth();

  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      setSuccessMsg('');
      await signInWithGoogle();
      setSuccessMsg('Welcome! Signed in successfully.');
      setTimeout(() => {
        onClose();
        setSuccessMsg('');
      }, 700);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to authenticate with Google.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (mode === 'signin') {
        await loginWithEmail(email, password);
        setSuccessMsg('Welcome back! Signed in successfully.');
      } else {
        await registerWithEmail(email, password, name || 'Valued Client');
        setSuccessMsg('Account created successfully! Welcome to LUXEBAG.');
      }
      setTimeout(() => {
        onClose();
        setSuccessMsg('');
      }, 700);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`auth-page ${isOpen ? 'active' : ''}`} onClick={onClose}>
      <div className="auth-card" onClick={(e) => e.stopPropagation()}>
        
        {/* Top Header */}
        <div className="auth-top">
          <div className="flex flex-col">
            <span className="font-serif text-2xl font-bold tracking-[0.2em] text-[#141414]">
              LUXEBAG
            </span>
            <span className="text-[9px] uppercase tracking-[0.3em] text-[#A39077] -mt-0.5">
              Paris • Client Sanctuary
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#747989] hover:text-[#141414] rounded-full hover:bg-[#F2ECE1] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Heading & Subtitle */}
        <h2>
          {mode === 'signin' ? 'Sign In to Account' : 'Create an Account'}
        </h2>
        <p className="auth-subtitle">
          {mode === 'signin' 
            ? 'Enter your credentials to access saved wishlist, bespoke orders, and concierge services.' 
            : 'Join LUXEBAG to receive VIP previews, complimentary monogramming, and private capsule access.'}
        </p>

        {/* Status Messages */}
        {errorMsg && (
          <div className="auth-message show error">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="auth-message show success">
            {successMsg}
          </div>
        )}

        {/* Quick Google Sign In */}
        <div className="mt-5">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl border border-[#E2E4EC] bg-white hover:bg-[#FAF8F5] text-xs font-semibold text-[#1C1917] flex items-center justify-center gap-3 transition-colors shadow-2xs cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
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

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E8DFC9]" />
          </div>
          <div className="relative flex justify-center text-[11px] uppercase tracking-wider text-[#A39077]">
            <span className="bg-[#FAF8F5] px-3">or continue with email</span>
          </div>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleEmailSubmit}>
          {mode === 'register' && (
            <div className="auth-field">
              <label>Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Eleanor Vance"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="auth-field">
            <label>Email Address</label>
            <input
              type="email"
              required
              placeholder="client@luxury.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="auth-field">
            <label>Password</label>
            <div className="password-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <span className="flex items-center gap-1"><EyeOff className="w-3.5 h-3.5" /> Hide</span>
                ) : (
                  <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> Show</span>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="auth-submit py-3.5 px-6 rounded-full bg-[#1C1917] hover:bg-[#B38E46] text-[#FAF8F5] text-xs font-semibold uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Switcher */}
        <div className="auth-switch">
          {mode === 'signin' ? (
            <p>
              New to LUXEBAG?{' '}
              <button
                type="button"
                onClick={() => { setMode('register'); setErrorMsg(''); setSuccessMsg(''); }}
                className="auth-link"
              >
                Create Account
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => { setMode('signin'); setErrorMsg(''); setSuccessMsg(''); }}
                className="auth-link"
              >
                Sign In
              </button>
            </p>
          )}
        </div>

        {/* Administrator Fast Access Helper */}
        <div className="mt-6 pt-4 border-t border-[#E8DFC9] bg-[#F4ECE1]/60 rounded-xl p-3 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs text-[#856514] font-medium mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Store Administrator Access</span>
          </div>
          <p className="text-[11px] text-[#8A8175] mb-2">
            Default administrator: <code className="text-[#1C1917] font-mono">bg5684017@gmail.com</code>.
          </p>
          <button
            type="button"
            onClick={() => {
              toggleAdminSimulate();
              onClose();
            }}
            className="text-[11px] px-3.5 py-1.5 bg-white hover:bg-[#FAF8F5] border border-[#D4AF37]/50 text-[#856514] font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            {isSimulatingAdmin ? 'Disable Admin Simulation' : 'Toggle Admin Test Mode'}
          </button>
        </div>
      </div>
    </div>
  );
};

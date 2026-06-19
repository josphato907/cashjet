"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/auth-store';
import { useGameStore } from '@/store/game-store';
import { AlertCircle, CheckCircle } from 'lucide-react';

export default function Register() {
  const router = useRouter();
  const { initializeDevice, setUser } = useAuthStore();
  const { setBalance, setUsername } = useGameStore();

  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '', confirmPassword: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [refCode, setRefCode] = useState(null);

  useEffect(() => {
    initializeDevice();
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) setRefCode(ref);
  }, [initializeDevice]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const name = form.name.trim();
      const phone = form.phone.trim();
      const email = form.email.trim();
      const password = form.password;
      const confirmPassword = form.confirmPassword;

      if (!name) throw new Error("Name is required");
      const cleanPhone = phone.replace(/\s/g, '');
      if (!/^(\+?254|0)[17][0-9]{8}$/.test(cleanPhone)) {
        throw new Error("Please enter a valid Kenyan phone number (07XXXXXXXX)");
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error("Please enter a valid email address");
      }
      if (!password) throw new Error("Please enter a password");
      if (password !== confirmPassword) throw new Error("Passwords do not match");

      const allUsers = JSON.parse(localStorage.getItem("cashjet-all-users") || "[]");
      if (allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error("This email is already registered. Please use a different email.");
      }
      if (allUsers.find((u) => u.phone === phone)) {
        throw new Error("This phone number is already registered. Please use a different number.");
      }

      const newUser = {
        id: `user_${Date.now()}`,
        name, email, phone, password,
        balance: 500, bonus: 500,
        activationFeePaid: false,
        deviceId: "", ip: "",
        lastLogin: Date.now(), createdAt: Date.now(),
        sharedCount: 0, lastSharedAt: 0,
      };

      allUsers.push({
        email: newUser.email, phone: newUser.phone,
        id: newUser.id, name: newUser.name,
        password: newUser.password, balance: newUser.balance,
        bonus: newUser.bonus, activationFeePaid: newUser.activationFeePaid,
        createdAt: newUser.createdAt, sharedCount: 0, lastSharedAt: 0,
      });
      localStorage.setItem("cashjet-all-users", JSON.stringify(allUsers));

      setUser(newUser);
      setBalance(500);
      setUsername(name);

      setIsSuccess(true);
      setTimeout(() => router.push('/dashboard'), 3000);
    } catch (err) {
      setErrorMsg(err.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 font-sans text-white">
      {isSuccess ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-slate-900/60 border border-slate-800 backdrop-blur-xl px-10 py-12 rounded-3xl max-w-md w-full shadow-2xl"
        >
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6 animate-pulse" />
          <h2 className="text-3xl font-extrabold text-white mb-3">Congratulations!</h2>
          <p className="text-xl text-gray-300 mb-1">KSH 500 has been successfully</p>
          <p className="text-xl text-gray-300 mb-6">credited to your account</p>
          <p className="text-gray-500 text-xs">Redirecting to dashboard...</p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl space-y-6">
            <div className="space-y-1.5">
              <h1 className="text-3xl font-extrabold text-white">Create Account &amp; Start Earning</h1>
              <p className="text-gray-400 text-sm">Join CashJet - Unlimited earning potential</p>
              {refCode ? (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className="mt-4 bg-green-500/10 border-2 border-green-500/35 rounded-xl p-4 text-center">
                  <p className="text-green-400 font-bold text-base">🎉 Joined via Referral Link!</p>
                  <p className="text-green-300 text-xs mt-1 font-semibold">✓ Get KSH 500 Direct to M-Pesa After Registration</p>
                  <p className="text-green-300 text-xs mt-0.5">Bonus verified and paid instantly upon account verification</p>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className="mt-4 bg-blue-500/10 border-2 border-blue-500/35 rounded-xl p-4 text-center">
                  <p className="text-blue-400 font-bold text-sm">
                    💡 Pro Tip: Share your referral link after registration to earn KSH 300 per person!
                  </p>
                </motion.div>
              )}
            </div>

            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-xs flex items-center gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="font-semibold">{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { id: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
                { id: 'phone', label: 'Phone Number', type: 'tel', placeholder: '07XXXXXXXX' },
                { id: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com' },
                { id: 'password', label: 'Password', type: 'password', placeholder: '••••••••', hint: 'Any password works' },
                { id: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: '••••••••' },
              ].map(({ id, label, type, placeholder, hint }) => (
                <div key={id} className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300 block" htmlFor={id}>{label}</label>
                  <input
                    type={type} id={id} name={id}
                    placeholder={placeholder}
                    value={form[id]} onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 text-sm"
                    disabled={isLoading}
                  />
                  {hint && <p className="text-[10px] text-gray-500">{hint}</p>}
                </div>
              ))}

              <button
                type="submit" disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-extrabold py-3.5 rounded-xl transition text-base shadow-lg disabled:opacity-50 mt-2"
              >
                {isLoading ? "Creating Account..." : "🎁 Register & Get KSH 500 to M-Pesa"}
              </button>
            </form>

            <p className="text-center text-gray-400 text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-yellow-500 hover:text-yellow-400 font-bold transition">Login</Link>
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

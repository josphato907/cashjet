"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/auth-store';
import { useGameStore } from '@/store/game-store';
import { AlertCircle, CheckCircle } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const { initializeDevice, setUser } = useAuthStore();
  const { setBalance, setUsername } = useGameStore();

  const [form, setForm] = useState({ emailOrPhone: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Initialize device ID on mount
  useEffect(() => {
    initializeDevice();
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
      const emailOrPhone = form.emailOrPhone.trim();
      const password = form.password.trim();

      if (!emailOrPhone) throw new Error("Email or phone number is required");
      if (!password) throw new Error("Password is required");

      // Load client-side user database
      const usersList = JSON.parse(localStorage.getItem("cashjet-all-users") || "[]");
      const matchedUser = usersList.find(
        (u) => u.email.toLowerCase() === emailOrPhone.toLowerCase() || u.phone === emailOrPhone
      );

      if (!matchedUser) {
        throw new Error("User not found. Please check your email or phone number.");
      }

      if (matchedUser.password !== password) {
        throw new Error("Invalid password. Please try again.");
      }

      // Default user session object
      let userSession = {
        id: matchedUser.id,
        name: matchedUser.name || "Player",
        email: matchedUser.email,
        phone: matchedUser.phone,
        balance: matchedUser.balance || 500,
        bonus: matchedUser.bonus || 500,
        activationFeePaid: matchedUser.activationFeePaid || false,
        deviceId: "",
        ip: "",
        lastLogin: Date.now(),
        createdAt: matchedUser.createdAt || Date.now(),
        sharedCount: matchedUser.sharedCount || 0,
        lastSharedAt: matchedUser.lastSharedAt || 0,
      };

      // Merge existing auth store details if available
      const localAuth = localStorage.getItem("auth-store");
      if (localAuth) {
        try {
          const authData = JSON.parse(localAuth);
          if (authData.state?.user?.id === matchedUser.id) {
            userSession = {
              ...userSession,
              ...authData.state.user,
              lastLogin: Date.now(),
            };
          }
        } catch (err) {}
      }

      // Merge current game balance if available
      const localGame = localStorage.getItem("aviator-game-storage");
      if (localGame) {
        try {
          const gameData = JSON.parse(localGame);
          if (gameData.state) {
            userSession.balance = Math.max(userSession.balance, gameData.state.balance || userSession.balance);
          }
        } catch (err) {}
      }

      // Set state stores
      setUser(userSession);
      setBalance(userSession.balance);
      setUsername(userSession.name);

      setIsSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);

    } catch (err) {
      setErrorMsg(err.message || "Login failed");
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
          <h2 className="text-3xl font-extrabold text-white mb-3">Welcome Back!</h2>
          <p className="text-gray-300 text-base mb-1">Your account is loaded</p>
          <p className="text-gray-300 text-base mb-6">with your earnings</p>
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
              <h1 className="text-3xl font-extrabold text-white">Welcome Back to CashJet</h1>
              <p className="text-gray-400 text-sm">Login to your account and continue earning</p>
            </div>

            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-xs flex items-center gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="font-semibold">{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300 block" htmlFor="emailOrPhone">
                  Email or Phone Number
                </label>
                <input
                  type="text"
                  id="emailOrPhone"
                  name="emailOrPhone"
                  placeholder="you@example.com or 07XXXXXXXX"
                  value={form.emailOrPhone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 text-sm"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300 block" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 text-sm"
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-extrabold py-3.5 rounded-xl transition text-base shadow-lg disabled:opacity-50 mt-2"
              >
                {isLoading ? "Logging In..." : "🎮 Login & Play"}
              </button>
            </form>

            <p className="text-center text-gray-400 text-sm">
              Don't have an account?{" "}
              <Link href="/register" className="text-yellow-500 hover:text-yellow-400 font-bold transition">
                Register here
              </Link>
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

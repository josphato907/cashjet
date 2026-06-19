"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { TrendingUp, Shield, Zap, Users, Trophy, Plane } from 'lucide-react';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white font-sans overflow-x-hidden">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-85 transition">
            <Image
              src="/cashjet-logo.png"
              alt="CashJet Logo"
              width={140}
              height={45}
              priority
              className="h-10 sm:h-12 w-auto"
            />
          </Link>
          <div className="flex gap-2.5 sm:gap-4">
            <Link
              href="/login"
              className="px-4 py-2 border border-slate-700 hover:border-slate-500 rounded-xl text-white hover:bg-slate-850 transition text-sm font-semibold flex items-center"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-755 text-white rounded-xl font-bold transition text-sm shadow-md flex items-center"
            >
              Register Now
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-6 sm:space-y-8 max-w-3xl mx-auto"
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 bg-clip-text text-transparent drop-shadow-sm leading-tight">
            Experience the Thrill of Aviator
          </h1>
          <p className="text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            The premier crash game where skill meets fortune. Watch your multiplier soar and cash out before the plane crashes!
          </p>
          <div className="pt-2">
            <Link
              href="/register"
              className="inline-flex items-center justify-center bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-slate-950 font-black text-lg px-8 py-4.5 rounded-2xl shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Play Now & Get KSH 500
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Feature Section Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8"
        >
          {/* Card 1 */}
          <motion.div
            variants={itemVariants}
            className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6.5 hover:bg-slate-800/50 hover:border-slate-700 transition duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 mb-5">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Real-Time Multipliers</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Watch your winnings multiply in real-time with our advanced, provably fair algorithm.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            variants={itemVariants}
            className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6.5 hover:bg-slate-800/50 hover:border-slate-700 transition duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 mb-5">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Secure & Fair</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Provably fair gaming with transparent crash points, hash verifications, and secure accounts.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            variants={itemVariants}
            className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6.5 hover:bg-slate-800/50 hover:border-slate-700 transition duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 mb-5">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Instant Withdrawals</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Deductions clear instantly. Receive your payouts straight to your M-Pesa wallet with zero delay.
            </p>
          </motion.div>

          {/* Card 4 */}
          <motion.div
            variants={itemVariants}
            className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6.5 hover:bg-slate-800/50 hover:border-slate-700 transition duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 mb-5">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Live Community</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Play alongside thousands of active players, chat in real-time, and watch mutual bets.
            </p>
          </motion.div>

          {/* Card 5 */}
          <motion.div
            variants={itemVariants}
            className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6.5 hover:bg-slate-800/50 hover:border-slate-700 transition duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 mb-5">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Daily Rewards</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Earn free lobby bonuses, referral cash rewards, and participate in active chats.
            </p>
          </motion.div>

          {/* Card 6 */}
          <motion.div
            variants={itemVariants}
            className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6.5 hover:bg-slate-800/50 hover:border-slate-700 transition duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 mb-5">
              <Plane className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Mobile Optimized</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Fully optimized layout designed specifically for high-speed performance on mobile and desktop.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* How it Works Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-white mb-16">How It Works</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center font-bold text-slate-950 mx-auto text-lg shadow-md">
              1
            </div>
            <h4 className="font-bold text-white text-base">Sign Up</h4>
            <p className="text-gray-400 text-xs leading-relaxed max-w-xs mx-auto">
              Get KSH 500 bonus instantly in your account.
            </p>
          </div>

          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center font-bold text-slate-950 mx-auto text-lg shadow-md">
              2
            </div>
            <h4 className="font-bold text-white text-base">Place Bet</h4>
            <p className="text-gray-400 text-xs leading-relaxed max-w-xs mx-auto">
              Choose your bet amount or configure auto bets.
            </p>
          </div>

          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center font-bold text-slate-950 mx-auto text-lg shadow-md">
              3
            </div>
            <h4 className="font-bold text-white text-base">Watch & Win</h4>
            <p className="text-gray-400 text-xs leading-relaxed max-w-xs mx-auto">
              Cash out before the jet crashes to lock in multipliers.
            </p>
          </div>

          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center font-bold text-slate-950 mx-auto text-lg shadow-md">
              4
            </div>
            <h4 className="font-bold text-white text-base">Withdraw</h4>
            <p className="text-gray-400 text-xs leading-relaxed max-w-xs mx-auto">
              Request instant withdrawal to your M-Pesa number.
            </p>
          </div>
        </div>
      </section>

      {/* Promos Banner Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-green-500/10 via-emerald-600/15 to-green-500/10 border-2 border-green-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Promo Image */}
            <div className="hidden md:flex justify-center relative w-full h-64">
              <Image
                src="/cashjet-lady-bonus.jpg"
                alt="Register - CashJet KSH 500 Bonus"
                fill
                className="rounded-2xl shadow-xl object-cover"
              />
            </div>
            {/* Promo Content */}
            <div className="bg-slate-950/40 border border-green-500/25 rounded-2xl p-6 sm:p-8 space-y-4">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Register - CashJet</h3>
              <p className="text-green-400 font-bold text-sm sm:text-base">
                Create your CashJet account and get KSH 500 bonus
              </p>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                Unlock instant withdrawals to M-Pesa, fair gaming multipliers, and refer others to earn more.
              </p>
              <div className="bg-slate-900/60 border border-green-500/20 rounded-xl p-3.5 font-mono text-xs sm:text-sm text-center">
                cashjet.vercel.app
              </div>
              <Link
                href="/register"
                className="w-full inline-flex items-center justify-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-extrabold py-3.5 rounded-xl transition shadow-lg text-sm sm:text-base hover:scale-[1.01]"
              >
                Register Now - Get KSH 500
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Statistics Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-1">
            <p className="text-3xl sm:text-5xl font-black text-yellow-500 font-mono">50,000+</p>
            <p className="text-gray-400 text-xs sm:text-sm font-semibold uppercase tracking-wider">Active Players</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-5xl font-black text-yellow-500 font-mono">KSH 2M+</p>
            <p className="text-gray-400 text-xs sm:text-sm font-semibold uppercase tracking-wider">Daily Payouts</p>
          </div>
          <div className="space-y-1 col-span-2 md:col-span-1">
            <p className="text-3xl sm:text-5xl font-black text-yellow-500 font-mono">8.5x</p>
            <p className="text-gray-400 text-xs sm:text-sm font-semibold uppercase tracking-wider">Avg Multiplier</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8 mb-16 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-yellow-500/10 via-amber-600/15 to-yellow-500/10 border border-yellow-500/25 rounded-3xl p-8 sm:p-12 space-y-6 shadow-2xl"
        >
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Ready to Start Winning?</h3>
          <p className="text-gray-300 text-sm max-w-md mx-auto">
            Join thousands of winning players today and claim your registration bonus.
          </p>
          <div>
            <Link
              href="/register"
              className="inline-flex items-center justify-center bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-755 text-slate-950 font-black text-base px-8 py-3.5 rounded-xl transition shadow-lg hover:scale-[1.01]"
            >
              Get KSH 500 Bonus Now
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/60 py-12 md:py-16 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10 text-sm">
            <div className="space-y-3">
              <h4 className="font-bold text-white">About</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-yellow-500 transition">About Us</a></li>
                <li><a href="#" className="hover:text-yellow-500 transition">Blog</a></li>
                <li><a href="#" className="hover:text-yellow-500 transition">Careers</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-bold text-white">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-yellow-500 transition">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-yellow-500 transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-yellow-500 transition">Responsible Gaming</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-bold text-white">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-yellow-500 transition">Contact Us</a></li>
                <li><a href="#" className="hover:text-yellow-500 transition">FAQ</a></li>
                <li><a href="#" className="hover:text-yellow-500 transition">Help Center</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-bold text-white">Follow</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-yellow-500 transition">Twitter</a></li>
                <li><a href="#" className="hover:text-yellow-500 transition">Facebook</a></li>
                <li><a href="#" className="hover:text-yellow-500 transition">Instagram</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800/60 pt-6 text-center text-xs text-gray-500">
            <p>© 2026 CashJet. All rights reserved. Play responsibly.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

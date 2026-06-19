import React, { useState } from 'react';
import { useGameStore } from '@/store/game-store';
import { STKPrompt, PaymentConfirmation, TransactionVerification, TransactionSuccess } from './mpesa-helpers';
import { X, Smartphone, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DepositModal({ isOpen, onClose }) {
  const [step, setStep] = useState('phoneInput'); // phoneInput, amounts, stk, confirmation, verification, success
  const [phone, setPhone] = useState('');
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [stkData, setStkData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const addBalance = useGameStore((state) => state.addBalance);

  const quickAmounts = [100, 500, 1000, 5000];

  const handlePhoneSubmit = (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (!phone.trim()) {
      setErrorMsg('Please enter a phone number');
      return;
    }
    // Simple validation of Kenyan number lengths (9, 10, or 12 digits)
    if (cleanPhone.length !== 9 && cleanPhone.length !== 10 && cleanPhone.length !== 12) {
      setErrorMsg('Please enter a valid Kenyan phone number (e.g. 07XXXXXXXX)');
      return;
    }
    setStep('amounts');
  };

  const handleInitiatePayment = async () => {
    if (!selectedAmount || selectedAmount <= 0) {
      setErrorMsg('Please select a deposit amount');
      return;
    }
    setIsLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/mpesa/stk-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: phone,
          amount: selectedAmount,
          transactionType: 'deposit',
          accountReference: `DEP-${Date.now()}`
        })
      });

      const data = await response.json();
      if (data.success && data.checkoutRequestId) {
        setStkData(data);
        setStep('stk');
      } else {
        setErrorMsg(data.message || 'Failed to initiate STK push. Please try again.');
      }
    } catch (e) {
      setErrorMsg('An error occurred during communication. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStkContinue = () => {
    setStep('confirmation');
  };

  const handleConfirmPay = (paid) => {
    if (paid) {
      setStep('verification');
    } else {
      setStep('amounts');
      setStkData(null);
    }
  };

  const handleVerifyCode = async (code) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      // Any 10 characters code is approved
      if (code.length === 10) {
        addBalance(selectedAmount);
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
    setStep('phoneInput');
    setPhone('');
    setSelectedAmount(null);
    setStkData(null);
    setErrorMsg('');
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
          {/* Close button (visible only in initial steps to avoid breaking flow in pending states) */}
          {step !== 'stk' && step !== 'confirmation' && step !== 'verification' && step !== 'success' && (
            <button
              onClick={handleReset}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition p-1 hover:bg-slate-700/50 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {step === 'phoneInput' && (
            <div className="p-6 space-y-5">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-white">Deposit Funds</h2>
                <p className="text-gray-400 text-xs">Enter your M-Pesa phone number to continue</p>
              </div>

              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 block">M-Pesa Phone Number</label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                    <input
                      type="tel"
                      placeholder="07XXXXXXXX or 2547XXXXXXXX"
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

                <button
                  type="submit"
                  disabled={isLoading || !phone.trim()}
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-slate-900 font-extrabold py-3.5 rounded-xl transition disabled:opacity-50 text-base shadow-lg"
                >
                  {isLoading ? 'Processing...' : 'Continue'}
                </button>
              </form>
            </div>
          )}

          {step === 'amounts' && (
            <div className="p-6 space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-white">Select Deposit Amount</h2>
                <p className="text-gray-400 text-xs">Choose how much you want to deposit</p>
              </div>

              <div className="bg-slate-900/50 border border-slate-700 p-3.5 rounded-xl flex justify-between items-center text-sm">
                <span className="text-gray-400">Phone Number</span>
                <span className="font-semibold text-yellow-500 font-mono">{phone}</span>
              </div>

              <div className="space-y-2.5">
                <span className="text-xs font-semibold text-gray-400 block">Quick Amounts</span>
                <div className="grid grid-cols-2 gap-2.5">
                  {quickAmounts.map((amt) => (
                    <button
                      key={amt}
                      onClick={() => {
                        setSelectedAmount(amt);
                        setErrorMsg('');
                      }}
                      className={`py-3.5 rounded-xl font-bold transition text-sm flex justify-center items-center ${
                        selectedAmount === amt
                          ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 shadow-md'
                          : 'bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-gray-300'
                      }`}
                    >
                      KSH {amt.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {errorMsg && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-700/40">
                <p className="text-gray-400 text-xs mb-1">Selected Deposit</p>
                <p className="text-3xl font-extrabold text-yellow-500">
                  {selectedAmount ? `KSH ${selectedAmount.toLocaleString()}` : 'Select Amount'}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('phoneInput')}
                  className="flex-1 bg-slate-700/60 hover:bg-slate-750 border border-slate-650 text-gray-300 font-bold py-3.5 rounded-xl transition"
                >
                  Back
                </button>
                <button
                  onClick={handleInitiatePayment}
                  disabled={isLoading || !selectedAmount}
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-slate-900 font-extrabold py-3.5 rounded-xl transition disabled:opacity-50 shadow-lg"
                >
                  {isLoading ? 'Processing...' : 'Proceed to M-Pesa'}
                </button>
              </div>
            </div>
          )}

          {step === 'stk' && (
            <STKPrompt
              phoneNumber={phone}
              amount={selectedAmount}
              onContinue={handleStkContinue}
              isLoading={isLoading}
            />
          )}

          {step === 'confirmation' && (
            <PaymentConfirmation
              phoneNumber={phone}
              amount={selectedAmount}
              onConfirmYes={() => handleConfirmPay(true)}
              onConfirmNo={() => handleConfirmPay(false)}
              isLoading={isLoading}
            />
          )}

          {step === 'verification' && (
            <TransactionVerification
              phoneNumber={phone}
              amount={selectedAmount}
              onVerify={handleVerifyCode}
              transactionType="deposit"
            />
          )}

          {step === 'success' && (
            <TransactionSuccess
              phoneNumber={phone}
              amount={selectedAmount}
              transactionType="deposit"
              onContinue={handleReset}
            />
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

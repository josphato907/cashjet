import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, CheckCircle, AlertCircle, MessageCircle } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';

// STK Prompt Component (nT)
export function STKPrompt({ phoneNumber, amount, onContinue, isLoading }) {
  const [timeLeft, setTimeLeft] = useState(15);

  useEffect(() => {
    if (timeLeft <= 0) {
      onContinue();
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, onContinue]);

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-xl animate-pulse" />
        <div className="w-20 h-20 bg-slate-800 rounded-full border border-slate-700 flex items-center justify-center z-10">
          <Smartphone className="w-10 h-10 text-yellow-500 animate-bounce" />
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-white">Check Your Phone</h3>
        <p className="text-gray-400 text-sm max-w-xs">
          An M-Pesa STK push prompt has been sent to <span className="text-yellow-500 font-semibold">{phoneNumber}</span>.
        </p>
        <p className="text-gray-400 text-xs">
          Enter your M-Pesa PIN on your phone to authorize the payment of <span className="text-white font-bold">KSH {amount}</span>.
        </p>
      </div>

      <div className="w-full max-w-xs space-y-2">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Waiting for response...</span>
          <span className="font-mono font-bold text-yellow-500">{timeLeft}s</span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 15, ease: "linear" }}
            className="h-full bg-yellow-500"
          />
        </div>
      </div>

      <button
        onClick={onContinue}
        disabled={isLoading}
        className="w-full max-w-xs bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white font-bold py-3 rounded-lg transition"
      >
        I entered my PIN
      </button>
    </div>
  );
}

// Payment Confirmation Component (nI)
export function PaymentConfirmation({ phoneNumber, amount, onConfirmYes, onConfirmNo, isLoading }) {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="w-16 h-16 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center">
        <AlertCircle className="w-8 h-8 text-yellow-500" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-white">Confirm Payment</h3>
        <p className="text-gray-400 text-sm max-w-xs">
          Did you receive the M-Pesa PIN prompt and complete the payment of <span className="text-white font-semibold">KSH {amount}</span>?
        </p>
      </div>
      <div className="w-full max-w-xs flex gap-3">
        <button
          onClick={onConfirmNo}
          disabled={isLoading}
          className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-gray-300 font-bold py-3 rounded-lg transition"
        >
          No, cancel
        </button>
        <button
          onClick={onConfirmYes}
          disabled={isLoading}
          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 rounded-lg transition shadow-lg"
        >
          Yes, I Paid
        </button>
      </div>
    </div>
  );
}

// Transaction Verification Component (nL)
export function TransactionVerification({ phoneNumber, amount, onVerify, transactionType }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');
    const cleanCode = code.trim();
    if (cleanCode.length !== 10) {
      setError('Invalid transaction code format. Must be 10 characters.');
      return;
    }
    setIsValidating(true);
    const success = await onVerify(cleanCode);
    setIsValidating(false);
    if (!success) {
      setError('Verification failed. Please check your transaction code.');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold text-white">Verify Transaction</h3>
        <p className="text-gray-400 text-sm max-w-xs mx-auto">
          Enter the 10-character M-Pesa transaction code (e.g. QXA2BR83KJ) from your confirmation SMS to credit your account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-xs mx-auto">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-400">M-Pesa Transaction Code</label>
          <input
            type="text"
            placeholder="e.g. QXA2BR83KJ"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 10))}
            className="w-full bg-slate-900 border border-slate-700 focus:border-yellow-500 text-center font-mono text-white text-lg tracking-widest py-3 rounded-lg focus:outline-none"
            maxLength={10}
            disabled={isValidating}
          />
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isValidating || code.trim().length !== 10}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 shadow-lg"
        >
          {isValidating ? 'Verifying Code...' : 'Verify & Complete'}
        </button>
      </form>
      <p className="text-gray-500 text-xs text-center max-w-xs mx-auto">
        Your transaction code is a 10-character alpha-numeric code that appears at the start of your M-Pesa confirmation SMS.
      </p>
    </div>
  );
}

// Transaction Success Component (nF)
export function TransactionSuccess({ phoneNumber, amount, transactionType, onContinue }) {
  const { user, addSharedEarning } = useAuthStore();
  const [shared, setShared] = useState(false);
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setPulse((p) => !p), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleShare = () => {
    const refCode = user?.referralCode || "REF123";
    const text = encodeURIComponent(`Register - CashJet\n\nCreate your CashJet account and get KSH 500 bonus\n\nInstant withdrawals to M-Pesa, fair gaming, and real-time multipliers.\n\nhttps://cashjet.vercel.app/register?ref=${refCode}\n\n#CashJet #EarnMoney #MPESA`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
    if (!shared) {
      addSharedEarning();
      setShared(true);
    }
  };

  const cleanPhone = phoneNumber.replace(/\D/g, "");
  const displayPhone = cleanPhone.length >= 10 ? `+254${cleanPhone.slice(-9)}` : phoneNumber;

  const title = transactionType === 'withdrawal'
    ? 'Withdrawal Initiated!'
    : 'Deposit Successful!';

  const details = transactionType === 'withdrawal'
    ? `Dear ${user?.name || 'Player'}, congratulations! Your withdrawal of KES ${amount.toLocaleString()} has been initiated successfully to M-Pesa number ${displayPhone}. We are processing your request now. Funds will arrive within 24-48 hours. Meanwhile, keep playing and winning more!`
    : `Congratulations ${user?.name || 'Player'}! Your deposit of KES ${amount.toLocaleString()} has been successfully processed. Your account has been credited. Start playing Aviator and win big!`;

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center space-y-6 max-w-md mx-auto">
      <div className="relative">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
          className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-2xl z-10"
        >
          <CheckCircle className="w-10 h-10 text-white" />
        </motion.div>
      </div>

      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-green-500">{title}</h2>
        <p className="text-gray-400 text-xs">Transaction completed successfully</p>
      </div>

      <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 w-full text-gray-300 leading-relaxed text-sm">
        {details}
      </div>

      {transactionType === 'withdrawal' && (
        <div className="w-full bg-slate-800/80 border border-slate-700/60 p-4 rounded-xl space-y-3">
          <p className="text-green-400 text-xs font-bold">
            🎉 Share on WhatsApp & Earn KSH 300 Instantly!
          </p>
          <button
            onClick={handleShare}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-white transition text-sm ${
              shared ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-md'
            }`}
            disabled={shared}
          >
            <MessageCircle className="w-4 h-4" />
            {shared ? '✓ Earned KSH 300' : 'Share on WhatsApp - Earn KSH 300'}
          </button>
        </div>
      )}

      <button
        onClick={onContinue}
        className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 rounded-lg transition text-sm"
      >
        Continue Playing & Win More
      </button>

      <p className="text-gray-500 text-xs">
        {transactionType === 'withdrawal'
          ? 'Your withdrawal is being processed. Check M-Pesa in 24-48 hours. Keep playing Aviator!'
          : 'Your balance is ready. Play now and multiply your winnings!'}
      </p>
    </div>
  );
}

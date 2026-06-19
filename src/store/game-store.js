import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useGameStore = create(
  persist(
    (set, get) => ({
      balance: 5000,
      username: "Player",
      isDemo: true,
      pendingWithdrawals: [],
      referral: {
        referralCode: `REF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        referredBy: null,
        totalEarnings: 0
      },
      gamePhase: "waiting", // "waiting" (countdown), "flying", "crashed"
      currentMultiplier: 1.0,
      crashPoint: 1.0,
      countdown: 15,
      roundId: "1",
      
      bet1Amount: 100,
      bet2Amount: 50,
      bet1Active: false,
      bet2Active: false,
      bet1CashedOut: false,
      bet2CashedOut: false,
      bet1CashoutMultiplier: null,
      bet2CashoutMultiplier: null,
      
      autoBet1: false,
      autoBet2: false,
      autoCashout1: 2.0,
      autoCashout2: 2.0,
      autoCashout1Enabled: false,
      autoCashout2Enabled: false,
      
      betHistory: [],
      roundHistory: [],
      liveBets: [],
      chatMessages: [],
      onlineUsers: 367,
      topCrashers: [],
      showWinPopup: false,
      winAmount: 0,
      winMultiplier: 0,

      setBalance: (bal) => set({ balance: bal }),
      addBalance: (amount) => set((state) => ({ balance: state.balance + amount })),
      subtractBalance: (amount) => set((state) => ({ balance: Math.max(0, state.balance - amount) })),
      setUsername: (name) => set({ username: name }),
      
      setBet1Amount: (amount) => set({ bet1Amount: Math.max(10, amount) }),
      setBet2Amount: (amount) => set({ bet2Amount: Math.max(10, amount) }),
      
      placeBet1: () => {
        const state = get();
        if (state.balance >= state.bet1Amount && !state.bet1Active) {
          set({
            balance: state.balance - state.bet1Amount,
            bet1Active: true,
            bet1CashedOut: false,
            bet1CashoutMultiplier: null
          });
          return true;
        }
        return false;
      },
      
      placeBet2: () => {
        const state = get();
        if (state.balance >= state.bet2Amount && !state.bet2Active) {
          set({
            balance: state.balance - state.bet2Amount,
            bet2Active: true,
            bet2CashedOut: false,
            bet2CashoutMultiplier: null
          });
          return true;
        }
        return false;
      },

      cashoutBet1: () => {
        const state = get();
        if (state.bet1Active && !state.bet1CashedOut && state.gamePhase === "flying") {
          const payout = state.bet1Amount * state.currentMultiplier;
          set({
            balance: state.balance + payout,
            bet1CashedOut: true,
            bet1CashoutMultiplier: state.currentMultiplier,
            showWinPopup: true,
            winAmount: payout,
            winMultiplier: state.currentMultiplier,
            betHistory: [
              {
                id: Date.now().toString(),
                stake: state.bet1Amount,
                oddsAtCashout: state.currentMultiplier,
                oddsAtCrash: null,
                payout: payout,
                status: "won",
                timestamp: Date.now(),
                roundId: state.roundId
              },
              ...state.betHistory.slice(0, 49)
            ]
          });
        }
      },

      cashoutBet2: () => {
        const state = get();
        if (state.bet2Active && !state.bet2CashedOut && state.gamePhase === "flying") {
          const payout = state.bet2Amount * state.currentMultiplier;
          set({
            balance: state.balance + payout,
            bet2CashedOut: true,
            bet2CashoutMultiplier: state.currentMultiplier,
            showWinPopup: true,
            winAmount: payout,
            winMultiplier: state.currentMultiplier,
            betHistory: [
              {
                id: Date.now().toString(),
                stake: state.bet2Amount,
                oddsAtCashout: state.currentMultiplier,
                oddsAtCrash: null,
                payout: payout,
                status: "won",
                timestamp: Date.now(),
                roundId: state.roundId
              },
              ...state.betHistory.slice(0, 49)
            ]
          });
        }
      },

      setGamePhase: (phase) => {
        const state = get();
        if (phase === "crashed") {
          const updates = { gamePhase: phase };
          const history = [];

          if (state.bet1Active && !state.bet1CashedOut) {
            history.push({
              id: Date.now().toString() + "-1",
              stake: state.bet1Amount,
              oddsAtCashout: null,
              oddsAtCrash: state.crashPoint,
              payout: 0,
              status: "lost",
              timestamp: Date.now(),
              roundId: state.roundId
            });
          }

          if (state.bet2Active && !state.bet2CashedOut) {
            history.push({
              id: Date.now().toString() + "-2",
              stake: state.bet2Amount,
              oddsAtCashout: null,
              oddsAtCrash: state.crashPoint,
              payout: 0,
              status: "lost",
              timestamp: Date.now(),
              roundId: state.roundId
            });
          }

          if (history.length > 0) {
            updates.betHistory = [...history, ...state.betHistory].slice(0, 50);
          }

          set(updates);
        } else {
          set({ gamePhase: phase });
        }
      },

      setCurrentMultiplier: (mult) => set({ currentMultiplier: mult }),
      setCrashPoint: (cp) => set({ crashPoint: cp }),
      setCountdown: (cd) => set({ countdown: cd }),
      setRoundId: (rid) => set({ roundId: rid }),
      
      addRoundHistory: (round) => set((state) => ({
        roundHistory: [round, ...state.roundHistory].slice(0, 30)
      })),

      setLiveBets: (bets) => set({ liveBets: bets }),
      updateLiveBet: (id, updates) => set((state) => ({
        liveBets: state.liveBets.map((b) => b.id === id ? { ...b, ...updates } : b)
      })),

      addChatMessage: (msg) => set((state) => ({
        chatMessages: [...state.chatMessages.slice(-49), msg]
      })),

      setOnlineUsers: (count) => set({ onlineUsers: count }),
      setTopCrashers: (crashers) => set({ topCrashers: crashers }),

      resetBets: () => set({
        bet1Active: false,
        bet2Active: false,
        bet1CashedOut: false,
        bet2CashedOut: false,
        bet1CashoutMultiplier: null,
        bet2CashoutMultiplier: null
      }),

      resetCashoutState: () => set({
        bet1CashedOut: false,
        bet2CashedOut: false,
        bet1CashoutMultiplier: null,
        bet2CashoutMultiplier: null
      }),

      setAutoBet1: (val) => set({ autoBet1: val }),
      setAutoBet2: (val) => set({ autoBet2: val }),
      setAutoCashout1: (val) => set({ autoCashout1: val }),
      setAutoCashout2: (val) => set({ autoCashout2: val }),
      setAutoCashout1Enabled: (val) => set({ autoCashout1Enabled: val }),
      setAutoCashout2Enabled: (val) => set({ autoCashout2Enabled: val }),

      showWin: (amount, multiplier) => set({
        showWinPopup: true,
        winAmount: amount,
        winMultiplier: multiplier
      }),
      hideWin: () => set({ showWinPopup: false }),

      createPendingWithdrawal: (amount, phone, checkoutRequestId) => {
        const id = `WD-${Date.now()}`;
        set((state) => ({
          pendingWithdrawals: [
            {
              id: id,
              amount: amount,
              phone: phone,
              activationFeePaid: false,
              checkoutRequestId: checkoutRequestId,
              status: "pending",
              createdAt: Date.now()
            },
            ...state.pendingWithdrawals
          ]
        }));
        return id;
      },

      updateWithdrawalStatus: (id, status) => set((state) => ({
        pendingWithdrawals: state.pendingWithdrawals.map(
          (w) => w.id === id ? { ...w, status: status } : w
        )
      })),

      completePendingWithdrawal: (id) => set((state) => ({
        pendingWithdrawals: state.pendingWithdrawals.filter((w) => w.id !== id)
      })),

      setReferralCode: (code) => set((state) => ({
        referral: { ...state.referral, referralCode: code }
      })),

      setReferredBy: (referrer) => set((state) => ({
        referral: { ...state.referral, referredBy: referrer }
      })),

      addReferralEarnings: (amount) => set((state) => ({
        balance: state.balance + amount,
        referral: {
          ...state.referral,
          totalEarnings: state.referral.totalEarnings + amount
        }
      })),

      initializeDemo: () => set({
        balance: 5000,
        isDemo: true,
        betHistory: []
      })
    }),
    {
      name: "aviator-game-storage",
      partialize: (state) => ({
        balance: state.balance,
        username: state.username,
        isDemo: state.isDemo,
        betHistory: state.betHistory,
        roundHistory: state.roundHistory,
        pendingWithdrawals: state.pendingWithdrawals,
        referral: state.referral
      }),
      skipHydration: typeof window === 'undefined'
    }
  )
);

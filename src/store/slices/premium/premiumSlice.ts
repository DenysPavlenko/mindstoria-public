import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PremiumState {
  isPaywallVisible: boolean;
  isPremium: boolean;
}

const initialState: PremiumState = {
  isPaywallVisible: false,
  isPremium: false,
};

export const premiumSlice = createSlice({
  name: "premium",
  initialState,
  reducers: {
    showPaywall: (state) => {
      if (!state.isPremium) {
        state.isPaywallVisible = true;
      }
    },
    hidePaywall: (state) => {
      state.isPaywallVisible = false;
    },
    setPremiumStatus: (state, action: PayloadAction<boolean>) => {
      state.isPremium = action.payload;
      if (action.payload) {
        // If user becomes premium, hide paywall
        state.isPaywallVisible = false;
      }
    },
  },
});

export const { showPaywall, hidePaywall, setPremiumStatus } =
  premiumSlice.actions;

export default premiumSlice.reducer;

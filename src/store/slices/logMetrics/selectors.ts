import { RootState } from "@/store";

export const selectLogMetrics = (state: RootState) => state.logMetrics.items;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { View, ViewTrackingConfig } from "../../types/views/viewTypes";

interface ViewsState {
  selectedView: View | null;
  filterByType: string | null;
  filterByUser: string | null;
  filterByViewable: string | null;
  sortBy: "recent" | "oldest";
  searchQuery: string;
  dateRange: {
    startDate: string | null;
    endDate: string | null;
  };
  trackedViews: string[]; // Array of viewable identifiers already tracked
  viewDebounceMap: Record<string, number>; // Timestamp of last view track
  trackingConfig: ViewTrackingConfig;
}

const initialState: ViewsState = {
  selectedView: null,
  filterByType: null,
  filterByUser: null,
  filterByViewable: null,
  sortBy: "recent",
  searchQuery: "",
  dateRange: {
    startDate: null,
    endDate: null,
  },
  trackedViews: [],
  viewDebounceMap: {},
  trackingConfig: {
    debounceTime: 5000, // 5 seconds
    trackAnonymous: true,
    excludeOwnViews: true,
  },
};
const viewsSlice = createSlice({
  name: "views",
  initialState,
  reducers: {
    setSelectedView: (state, action: PayloadAction<View | null>) => {
      state.selectedView = action.payload;
    },
    setFilterByType: (state, action: PayloadAction<string | null>) => {
      state.filterByType = action.payload;
    },

    setFilterByUser: (state, action: PayloadAction<string | null>) => {
      state.filterByUser = action.payload;
    },

    setFilterByViewable: (state, action: PayloadAction<string | null>) => {
      state.filterByViewable = action.payload;
    },

    clearFilters: (state) => {
      state.filterByType = null;
      state.filterByUser = null;
      state.filterByViewable = null;
    },

    setSortBy: (state, action: PayloadAction<"recent" | "oldest">) => {
      state.sortBy = action.payload;
    },

    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },

    clearSearchQuery: (state) => {
      state.searchQuery = "";
    },

    setDateRange: (
      state,
      action: PayloadAction<{
        startDate: string | null;
        endDate: string | null;
      }>
    ) => {
      state.dateRange = action.payload;
    },

    clearDateRange: (state) => {
      state.dateRange = {
        startDate: null,
        endDate: null,
      };
    },

    addTrackedView: (state, action: PayloadAction<string>) => {
      if (!state.trackedViews.includes(action.payload)) {
        state.trackedViews.push(action.payload);
      }
    },

    removeTrackedView: (state, action: PayloadAction<string>) => {
      state.trackedViews = state.trackedViews.filter(
        (id) => id !== action.payload
      );
    },

    clearTrackedViews: (state) => {
      state.trackedViews = [];
    },

    setViewDebounce: (
      state,
      action: PayloadAction<{ viewableKey: string; timestamp: number }>
    ) => {
      state.viewDebounceMap[action.payload.viewableKey] =
        action.payload.timestamp;
    },

    clearViewDebounce: (state, action: PayloadAction<string>) => {
      delete state.viewDebounceMap[action.payload];
    },

    clearAllViewDebounces: (state) => {
      state.viewDebounceMap = {};
    },

    setTrackingConfig: (
      state,
      action: PayloadAction<Partial<ViewTrackingConfig>>
    ) => {
      state.trackingConfig = { ...state.trackingConfig, ...action.payload };
    },

    resetViewsState: () => initialState,
  },
});
export const {
  setSelectedView,
  setFilterByType,
  setFilterByUser,
  setFilterByViewable,
  clearFilters,
  setSortBy,
  setSearchQuery,
  clearSearchQuery,
  setDateRange,
  clearDateRange,
  addTrackedView,
  removeTrackedView,
  clearTrackedViews,
  setViewDebounce,
  clearViewDebounce,
  clearAllViewDebounces,
  setTrackingConfig,
  resetViewsState,
} = viewsSlice.actions;
export default viewsSlice.reducer;

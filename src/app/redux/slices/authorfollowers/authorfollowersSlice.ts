import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AuthorFollower } from '../../types/authorfollowers/authorfollowersTypes';
import type { User } from '../../types/users/userTypes';

interface AuthorFollowersState {
  selectedFollower: AuthorFollower | null;
  selectedFollowerIds: string[];
  viewMode: 'followers' | 'following';
  sortBy: 'recent' | 'oldest' | 'name';
  searchQuery: string;
  filterByAuthor: string | null;
  filterByFollower: string | null;
  isFollowing: Record<string, boolean>;
  followSuggestions: User[];
  showSuggestions: boolean;
}

const initialState: AuthorFollowersState = {
  selectedFollower: null,
  selectedFollowerIds: [],
  viewMode: 'followers',
  sortBy: 'recent',
  searchQuery: '',
  filterByAuthor: null,
  filterByFollower: null,
  isFollowing: {},
  followSuggestions: [],
  showSuggestions: false,
};

const authorFollowersSlice = createSlice({
  name: 'authorFollowers',
  initialState,
  reducers: {
    setSelectedFollower: (state, action: PayloadAction<AuthorFollower | null>) => {
      state.selectedFollower = action.payload;
    },

    addSelectedFollowerId: (state, action: PayloadAction<string>) => {
      if (!state.selectedFollowerIds.includes(action.payload)) {
        state.selectedFollowerIds.push(action.payload);
      }
    },

    removeSelectedFollowerId: (state, action: PayloadAction<string>) => {
      state.selectedFollowerIds = state.selectedFollowerIds.filter(
        id => id !== action.payload
      );
    },

    setSelectedFollowerIds: (state, action: PayloadAction<string[]>) => {
      state.selectedFollowerIds = action.payload;
    },

    toggleFollowerSelection: (state, action: PayloadAction<string>) => {
      const index = state.selectedFollowerIds.indexOf(action.payload);
      if (index > -1) {
        state.selectedFollowerIds.splice(index, 1);
      } else {
        state.selectedFollowerIds.push(action.payload);
      }
    },

    clearSelectedFollowers: (state) => {
      state.selectedFollowerIds = [];
      state.selectedFollower = null;
    },

    selectAllFollowers: (state, action: PayloadAction<string[]>) => {
      state.selectedFollowerIds = action.payload;
    },

    setViewMode: (state, action: PayloadAction<'followers' | 'following'>) => {
      state.viewMode = action.payload;
    },

    toggleViewMode: (state) => {
      state.viewMode = state.viewMode === 'followers' ? 'following' : 'followers';
    },

    setSortBy: (state, action: PayloadAction<'recent' | 'oldest' | 'name'>) => {
      state.sortBy = action.payload;
    },

    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },

    clearSearchQuery: (state) => {
      state.searchQuery = '';
    },

    setFilterByAuthor: (state, action: PayloadAction<string | null>) => {
      state.filterByAuthor = action.payload;
    },

    setFilterByFollower: (state, action: PayloadAction<string | null>) => {
      state.filterByFollower = action.payload;
    },

    clearFilters: (state) => {
      state.filterByAuthor = null;
      state.filterByFollower = null;
    },

    setIsFollowing: (
      state,
      action: PayloadAction<{ authorId: string; isFollowing: boolean }>
    ) => {
      state.isFollowing[action.payload.authorId] = action.payload.isFollowing;
    },

    setFollowSuggestions: (state, action: PayloadAction<User[]>) => {
      state.followSuggestions = action.payload;
    },

    addFollowSuggestion: (state, action: PayloadAction<User>) => {
      if (!state.followSuggestions.find((u: User) => u.id === action.payload.id)) {
        state.followSuggestions.push(action.payload);
      }
    },

    removeFollowSuggestion: (state, action: PayloadAction<string>) => {
      state.followSuggestions = state.followSuggestions.filter(
        (u: User) => u.id !== action.payload
      );
    },

    clearFollowSuggestions: (state) => {
      state.followSuggestions = [];
    },

    setShowSuggestions: (state, action: PayloadAction<boolean>) => {
      state.showSuggestions = action.payload;
    },

    toggleShowSuggestions: (state) => {
      state.showSuggestions = !state.showSuggestions;
    },

    resetAuthorFollowersState: () => initialState,
  },
});

export const {
  setSelectedFollower,
  addSelectedFollowerId,
  removeSelectedFollowerId,
  setSelectedFollowerIds,
  toggleFollowerSelection,
  clearSelectedFollowers,
  selectAllFollowers,
  setViewMode,
  toggleViewMode,
  setSortBy,
  setSearchQuery,
  clearSearchQuery,
  setFilterByAuthor,
  setFilterByFollower,
  clearFilters,
  setIsFollowing,
  setFollowSuggestions,
  addFollowSuggestion,
  removeFollowSuggestion,
  clearFollowSuggestions,
  setShowSuggestions,
  toggleShowSuggestions,
  resetAuthorFollowersState,
} = authorFollowersSlice.actions;

export default authorFollowersSlice.reducer;
import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/auth/authSlice'
import authorFollowersReducer from './slices/authorfollowers/authorfollowersSlice'
import answersReducer from './slices/answers/answersSlice'
import bookmarksReducer from './slices/bookmarks/bookmarksSlice'
import categoriesReducer from './slices/categories/categoriesSlice'
import commentRepliesReducer from './slices/commentReplies/commentRepliesSlice'
import draftsReducer from './slices/drafts/draftsSlice'
import mediaReducer from './slices/media/mediaSlice'
import notificationsReducer from './slices/notifications/notificationsSlice'
import postsReducer from './slices/posts/postsSlice'
import questionsReducer from './slices/questions/questionsSlice'
import reactionsReducer from './slices/reactions/reactionsSlice'
import tagsReducer from './slices/tags/tagsSlice'
import usersReducer from './slices/users/usersSlice'
import viewsReducer from './slices/views/viewsSlice'


import { authApi } from './api/auth/authApi';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    authorFollowers: authorFollowersReducer,
    answers: answersReducer,
    bookmarks: bookmarksReducer,
    categories: categoriesReducer,
    commentReplies: commentRepliesReducer,
    drafts: draftsReducer,
    media: mediaReducer,
    notifications: notificationsReducer,
    posts: postsReducer,
    questions: questionsReducer,
    reactions: reactionsReducer,
    tags: tagsReducer,
    users: usersReducer,
    views: viewsReducer,

     [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
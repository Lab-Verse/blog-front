# Blog Site - LLM Code Generation Instructions

## Project Overview

This is a modern blog and magazine website focused on **digital currency, coins, technology, education, and AI**. The platform allows users to register, create accounts, and publish blog posts as authors. The site features a comprehensive content management system with categories, tags, bookmarks, reactions, comments, and user profiles.

## Technology Stack

### Core Technologies
- **Framework**: Next.js 15.5+ (App Router with Route Groups)
- **React**: 19.1.0
- **TypeScript**: 5.2.2 (Strict Mode Enabled)
- **Node Package Manager**: npm/bun

### State Management
- **Redux Toolkit**: @reduxjs/toolkit 2.11.0
- **React Redux**: 9.2.0
- **RTK Query**: For API calls and caching

### Styling & UI
- **TailwindCSS**: 4.1.5 (latest with @theme directive)
- **Headless UI**: For accessible components
- **Heroicons & HugeIcons**: Icon libraries
- **Framer Motion**: For animations
- **SASS**: For Tiptap editor styles

### Rich Text Editor
- **Tiptap**: 2.14.0 (with multiple extensions)
- Custom nodes and extensions for advanced editing

### Additional Libraries
- **React Player**: For video/audio playback
- **Embla Carousel**: For carousels/sliders
- **React Use**: Utility hooks
- **JWT Decode**: For authentication
- **Lodash**: Utility functions

## Project Structure

```
src/
├── app/                        # Next.js App Router
│   ├── (app)/                 # Main application routes
│   │   ├── (home)/           # Home page variants
│   │   ├── (search)/         # Search functionality
│   │   ├── about/            # About page
│   │   ├── author/           # Author profile pages
│   │   ├── category/         # Category archive pages
│   │   ├── contact/          # Contact page
│   │   ├── post/             # Individual post pages
│   │   ├── subscription/     # Subscription pages
│   │   └── tag/              # Tag archive pages
│   ├── (auth)/                # Authentication routes
│   │   └── login, register, etc.
│   ├── api/                   # API routes
│   ├── dashboard/             # User dashboard
│   ├── submission/            # Post submission
│   ├── redux/                 # Redux setup
│   │   ├── api/              # RTK Query API endpoints
│   │   ├── slices/           # Redux slices
│   │   ├── selectors/        # Redux selectors
│   │   ├── types/            # TypeScript types for Redux
│   │   ├── utils/            # Redux utilities (cookies)
│   │   ├── store.ts          # Redux store configuration
│   │   └── hooks.ts          # Typed Redux hooks
│   ├── layout.tsx             # Root layout
│   ├── theme-provider.tsx     # Theme & Redux Provider
│   └── SiteHeader.tsx         # Global header component
├── components/                 # Feature-specific components
│   ├── Header/               # Header components
│   ├── Footer/               # Footer components
│   ├── PostCards/            # Various post card layouts
│   ├── CategoryCards/        # Category card components
│   ├── CardAuthorBoxs/       # Author card components
│   ├── PostCardMeta/         # Post metadata components
│   ├── PostFeaturedMedia/    # Media display components
│   ├── CommentCard/          # Comment components
│   ├── NcImage/              # Optimized image component
│   ├── audio-player/         # Audio player components
│   ├── aside/                # Sidebar components
│   ├── tiptap-extension/     # Custom Tiptap extensions
│   ├── tiptap-icons/         # Tiptap toolbar icons
│   ├── tiptap-node/          # Custom Tiptap nodes
│   ├── tiptap-templates/     # Tiptap templates
│   ├── tiptap-ui/            # Tiptap UI components
│   ├── tiptap-ui-primitive/  # Tiptap UI primitives
│   └── Section*/             # Layout sections (Hero, Magazine, Slider, etc.)
├── shared/                     # Reusable UI components
│   ├── Avatar.tsx
│   ├── Badge.tsx
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Checkbox.tsx
│   ├── Select.tsx
│   ├── Textarea.tsx
│   ├── Heading.tsx
│   ├── Logo.tsx
│   ├── Pagination.tsx
│   ├── SwitchDarkMode.tsx
│   ├── dialog.tsx
│   ├── dropdown.tsx
│   ├── listbox.tsx
│   ├── navbar.tsx
│   ├── table.tsx
│   └── ... (37+ shared components)
├── data/                       # Static/demo data
│   ├── posts.ts
│   ├── authors.ts
│   ├── categories.ts
│   ├── navigation.ts
│   ├── search.ts
│   └── types.ts
├── hooks/                      # Custom React hooks
├── lib/                        # Utility libraries
├── routers/                    # Routing configurations
├── styles/                     # Global styles
│   ├── tailwind.css          # TailwindCSS configuration
│   ├── _tiptap-variables.scss
│   └── _tiptap-keyframe-animations.scss
├── utils/                      # Utility functions
└── type.d.ts                   # Global type definitions
```

## Redux Architecture

### Store Configuration

The Redux store is configured with:
- **14 Redux Slices**: auth, posts, categories, tags, users, bookmarks, reactions, comments, drafts, media, notifications, questions, answers, authorFollowers, views
- **RTK Query baseApi**: For all API calls with automatic re-authentication
- **DevTools**: Enabled in development mode

### Redux Slices

Each slice follows this pattern:
```typescript
// Example: postsSlice.ts
interface PostsState {
  selectedPost: Post | null;
  filters: PostFilters;
  viewMode: 'grid' | 'list';
  sortBy: 'recent' | 'popular' | 'title';
  isCreating: boolean;
  isEditing: boolean;
}
```

**Available Slices**:
1. **auth**: Authentication state, user session, tokens
2. **posts**: Post selection, filters, view mode, sorting
3. **categories**: Category management and filtering
4. **tags**: Tag management
5. **users**: User profiles and data
6. **bookmarks**: Saved posts
7. **reactions**: Likes, hearts, reactions
8. **commentReplies**: Comment reply threads
9. **drafts**: Draft posts
10. **media**: Media/image management
11. **notifications**: User notifications
12. **questions**: Q&A functionality
13. **answers**: Q&A answers
14. **authorFollowers**: Author following system
15. **views**: Post view tracking

### RTK Query API

Located in `src/app/redux/api/baseApi.ts`:
- **Base URL**: `process.env.NEXT_PUBLIC_API_URL`
- **Authentication**: Bearer token via cookies
- **Auto Re-auth**: Handles 401 errors with refresh token flow
- **Tag Types**: 40+ cache tag types for granular invalidation

**API Tag Types Include**:
Auth, User, UserProfile, Post, PostComments, PostMedia, Category, Tag, Bookmark, Reaction, Draft, Notification, Question, Answer, AuthorFollower, View, Media, CommentReply, and many more.

### Redux Hooks

Always use typed hooks from `src/app/redux/hooks.ts`:
```typescript
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
```

### Redux Provider Setup

The Redux Provider is wrapped in `theme-provider.tsx` along with ThemeContext:
```typescript
<Provider store={store}>
  <ThemeContext.Provider value={...}>
    {children}
  </ThemeContext.Provider>
</Provider>
```

## Styling Guidelines

### TailwindCSS Configuration

**Color Palette** (defined in `src/styles/tailwind.css`):
- **Primary**: Indigo shades (50-900) - `primary-500`, `primary-600`, etc.
- **Secondary**: Teal shades (50-900) - `secondary-500`, `secondary-600`, etc.
- **Neutral**: Gray shades (50-900) - `neutral-500`, `neutral-900`, etc.

**Dark Mode**:
- Use the `dark:` variant for dark mode styles
- Dark mode is controlled via `ThemeContext` and localStorage
- HTML element gets `.dark` class when dark mode is active
- Example: `bg-white dark:bg-neutral-900`

**Custom Utilities**:
- `container`: Custom container with responsive padding
- `pl-container`: Progressive left padding for asymmetric layouts
- `hidden-scrollbar`: Hide scrollbars while maintaining scroll functionality
- `z-max`: Maximum z-index (99999999)
- `nc-animation-spin`: Custom spinning animation
- `custom-shadow-1`: Custom box shadow
- `embla`, `embla__container`, `embla__slide`: Carousel utilities
- `menu-item`, `sub-menu`: Menu/megamenu utilities

### Component Styling Patterns

1. **Always use TailwindCSS utility classes** - Avoid custom CSS unless absolutely necessary
2. **Maintain consistent spacing**: Use standard Tailwind spacing scale (`p-4`, `mt-6`, `gap-8`, etc.)
3. **Responsive design**: Use responsive variants (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`)
4. **Consistent border radius**: Use Tailwind's radius scale or custom `--radius-*` variables
5. **Typography**: Use Tailwind typography classes with `@tailwindcss/typography` plugin
6. **Transitions**: Use `transition-*` classes for smooth interactions

### Font

The site uses **Be Vietnam Pro** font family (weights: 300, 400, 500, 600, 700):
```typescript
import { Be_Vietnam_Pro } from 'next/font/google'
```

## Component Development

### Shared Components (`src/shared/`)

These are the building blocks - **ALWAYS USE THESE COMPONENTS** instead of creating new ones:

**Form Components**:
- `Input.tsx`: Text inputs
- `Textarea.tsx`: Multi-line text inputs
- `Checkbox.tsx`: Checkboxes with variants
- `Radio.tsx`: Radio buttons
- `Select.tsx`: Select dropdowns
- `TagsInput.tsx`: Tag input component
- `Switch.tsx`: Toggle switches

**Button Components**:
- `Button.tsx`: Primary button component with many variants
- `ButtonPrimary.tsx`: Primary style preset
- `ButtonSecondary.tsx`: Secondary style preset
- `ButtonThird.tsx`: Tertiary style preset
- `ButtonCircle.tsx`: Circular button
- `ButtonClose.tsx`: Close button

**UI Components**:
- `Avatar.tsx`: User avatars with sizes and variants
- `Badge.tsx`: Status badges
- `Heading.tsx`: Section headings
- `HeadingWithArrowBtns.tsx`: Heading with navigation arrows
- `Logo.tsx`: Site logo component
- `Pagination.tsx`: Pagination component
- `NextPrev.tsx`: Next/previous navigation
- `SocialsList.tsx`, `SocialsList1.tsx`: Social media links
- `SwitchDarkMode.tsx`, `SwitchDarkMode2.tsx`: Dark mode toggles
- `Tag.tsx`: Content tags

**Layout Components**:
- `alert.tsx`: Alert/notification banners
- `banner.tsx`: Banner components
- `dialog.tsx`: Modal dialogs
- `dropdown.tsx`: Dropdown menus
- `listbox.tsx`: List selection boxes
- `navbar.tsx`: Navigation bars
- `table.tsx`: Data tables
- `divider.tsx`: Section dividers
- `fieldset.tsx`: Form fieldsets
- `spin-loading.tsx`: Loading spinners

### Feature Components (`src/components/`)

**Post Components**:
- `PostCards/*`: 20+ post card layout variants (Card1, Card2, Card3... CardLarge1, etc.)
- `PostCardMeta/*`: Post metadata displays
- `PostFeaturedMedia/*`: Post images, videos, audio, galleries
- `PostCardLikeBtn.tsx`: Like button
- `PostCardCommentBtn.tsx`: Comment button
- `PostCardSaveBtn.tsx`: Bookmark button
- `PostTypeFeaturedIcon.tsx`: Post type icons

**Section Components**:
Use these for page layouts:
- `SectionHero.tsx`, `SectionHero2.tsx`, `SectionHero3.tsx`: Hero sections
- `SectionMagazine1-11.tsx`: Magazine-style layouts
- `SectionSliderPosts.tsx`: Post sliders
- `SectionGridPosts.tsx`: Post grids
- `SectionLargeSlider.tsx`: Large post slider
- `SectionVideos.tsx`: Video grid section
- `SectionTrending.tsx`: Trending posts
- `SectionSubscribe2.tsx`: Newsletter subscription

**Widget Components**:
- `WidgetPosts.tsx`: Post widget for sidebars
- `WidgetCategories.tsx`: Category widget
- `WidgetTags.tsx`: Tag cloud widget
- `WidgetAuthors.tsx`: Author list widget
- `WidgetHeading.tsx`: Widget heading

**Other Components**:
- `CategoryCards/*`: Category display components
- `CardAuthorBoxs/*`: Author card components
- `CommentCard/*`: Comment display components
- `Header/*`: Header components and navigation
- `Footer/*`: Footer component
- `NcImage/*`: Next.js Image wrapper with loading states
- `audio-player/*`: Custom audio player

### Component Naming Conventions

1. **Shared components**: PascalCase, descriptive (e.g., `ButtonPrimary`, `SwitchDarkMode`)
2. **Feature components**: PascalCase with prefixes (e.g., `PostCard`, `SectionHero`, `WidgetPosts`)
3. **Class prefixes**: Use `nc-` prefix for custom classes (e.g., `nc-PostCardCommentBtn`)
4. **File organization**: Group related components in directories

### TypeScript Guidelines

1. **Strict Mode**: Always enabled - no `any` types
2. **Explicit Typing**: Type all props, state, and function returns
3. **Interface vs Type**:
   - Use `interface` for component props and extendable object shapes
   - Use `type` for unions, intersections, and complex types
4. **Generic Types**: Leverage TypeScript generics for reusable components
5. **Null Safety**: Use optional chaining (`?.`) and nullish coalescing (`??`)

### Component Template

```typescript
'use client' // Only if client-side interactivity is needed

import React, { FC } from 'react'
import { useAppSelector, useAppDispatch } from '@/app/redux/hooks'

interface MyComponentProps {
  title: string
  description?: string
  variant?: 'primary' | 'secondary'
  className?: string
}

const MyComponent: FC<MyComponentProps> = ({ 
  title, 
  description, 
  variant = 'primary',
  className = '' 
}) => {
  // Redux state and dispatch
  const someState = useAppSelector((state) => state.sliceName.field)
  const dispatch = useAppDispatch()

  // Component logic here

  return (
    <div className={`your-base-classes ${className}`}>
      {/* Component JSX */}
    </div>
  )
}

export default MyComponent
```

## Redux Integration Patterns

### Connecting Components to Redux

**1. Reading State**:
```typescript
import { useAppSelector } from '@/app/redux/hooks'

const posts = useAppSelector((state) => state.posts.selectedPost)
const isDarkMode = useAppSelector((state) => state.theme.isDarkMode)
```

**2. Dispatching Actions**:
```typescript
import { useAppDispatch } from '@/app/redux/hooks'
import { setSelectedPost } from '@/app/redux/slices/posts/postsSlice'

const dispatch = useAppDispatch()
dispatch(setSelectedPost(post))
```

**3. Using RTK Query (API Calls)**:
```typescript
// Create API endpoint in appropriate file under src/app/redux/api/
import { baseApi } from '../baseApi'

export const postsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: (params) => `/posts`,
      providesTags: ['Post'],
    }),
    createPost: builder.mutation({
      query: (body) => ({
        url: '/posts',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Post'],
    }),
  }),
})

export const { useGetPostsQuery, useCreatePostMutation } = postsApi

// In component:
const { data, isLoading, error } = useGetPostsQuery(params)
const [createPost, { isLoading: isCreating }] = useCreatePostMutation()
```

### When to Use Redux vs Local State

**Use Redux for**:
- User authentication state
- Global UI state (dark mode, language)
- Data shared across multiple pages/components
- Server cache (via RTK Query)
- Complex state that needs computed selectors

**Use Local State (useState) for**:
- Form inputs
- UI toggle states (modals, dropdowns)
- Component-specific state
- Temporary/transient data

## Theme & Dark Mode

### ThemeContext Usage

```typescript
import { useContext } from 'react'
import { ThemeContext } from '@/app/theme-provider'

const { isDarkMode, toggleDarkMode, themeDir, setThemeDir } = useContext(ThemeContext)!
```

**Theme Features**:
- `isDarkMode`: Boolean, current dark mode state
- `toggleDarkMode()`: Function to toggle dark/light mode
- `themeDir`: 'ltr' | 'rtl' - text direction
- `setThemeDir()`: Function to change text direction

**Storage**: Theme preference is stored in localStorage as 'theme' ('light-mode' | 'dark-mode')

## Routing & Navigation

### Route Structure

- **App Routes**: `src/app/(app)/*` - Main application pages
- **Auth Routes**: `src/app/(auth)/*` - Login, register, forgot password
- **Dashboard**: `src/app/dashboard/*` - User dashboard
- **Submission**: `src/app/submission/*` - Create/edit posts
- **API Routes**: `src/app/api/*` - Server-side API endpoints

### Navigation

Use Next.js Link component:
```typescript
import Link from 'next/link'

<Link href="/post/slug" className="...">
  Read More
</Link>
```

## Content Types & Data Models

### Post

Posts are the primary content type covering:
- Digital currency and cryptocurrency news
- Blockchain technology
- Education content
- AI and machine learning
- Technology trends
- Tutorials and guides

**Post Types**: Article, Video, Audio, Gallery, Standard

### Categories

Main content categories:
- Digital Currency / Cryptocurrency
- Blockchain Technology
- Education & Tutorials
- Artificial Intelligence
- Technology News
- Coins & Tokens

### User Roles

- **Reader**: Can read posts, comment, like, bookmark
- **Author**: Can create and publish posts
- **Admin**: Full access (future implementation)

## Best Practices

### Development Workflow

1. **TypeScript First**: Always define types/interfaces before implementation
2. **Component Reuse**: Check `shared/` and `components/` before creating new components
3. **Redux Integration**: 
   - Create slices for global state
   - Use RTK Query for API calls
   - Properly connect components to Redux store
4. **Styling Consistency**: Use existing TailwindCSS classes and color palette
5. **Responsive Design**: Test all breakpoints (mobile, tablet, desktop)
6. **Dark Mode**: Always implement dark mode variants
7. **Accessibility**: Use semantic HTML, ARIA labels, keyboard navigation
8. **Performance**: Lazy load images, code splitting, memoization

### Code Quality

1. **Follow .cursorrules**: Adhere to project-specific linting and formatting rules
2. **Use Prettier**: Auto-format code (configured with tailwindcss plugin)
3. **ESLint**: Fix all linting errors before committing
4. **Type Safety**: No `any` types, proper null checks
5. **Conventional Commits**: Use conventional commit messages (feat:, fix:, docs:, etc.)

### Testing

- Unit tests for utilities and hooks
- Integration tests for Redux slices
- Component tests for shared components
- E2E tests for critical user flows

## Environment Variables

Required environment variables:
```
NEXT_PUBLIC_API_URL=<backend-api-url>
```

## SEO & Metadata

Implement proper metadata in page components:
```typescript
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Title - Blog Site',
  description: 'Page description for SEO',
  keywords: ['cryptocurrency', 'blockchain', 'AI', 'technology'],
}
```

## Common Patterns

### Loading States

```typescript
{isLoading ? (
  <div className="flex items-center justify-center">
    <SpinLoading />
  </div>
) : (
  <YourContent />
)}
```

### Error Handling

```typescript
{error && (
  <Alert type="error">
    An error occurred. Please try again.
  </Alert>
)}
```

### Conditional Rendering with Auth

```typescript
const user = useAppSelector((state) => state.auth.user)

{user ? (
  <AuthenticatedView />
) : (
  <LoginPrompt />
)}
```

## Important Notes

1. **Redux is NOT fully integrated with all pages** - When working on pages, ensure proper Redux integration
2. **Maintain existing design system** - Keep consistent with current styling, layout, and component patterns
3. **Reuse components** - Don't create duplicate components, use the extensive shared library
4. **Follow the theme** - All new components must support dark mode
5. **TypeScript strict mode** - No shortcuts, proper typing required
6. **Content focus** - Design and content should align with digital currency, technology, education, and AI themes

## Quick Reference

### Import Paths
```typescript
// Components
import Button from '@/shared/Button'
import PostCard1 from '@/components/PostCards/PostCard1'

// Redux
import { useAppSelector, useAppDispatch } from '@/app/redux/hooks'
import { setSelectedPost } from '@/app/redux/slices/posts/postsSlice'

// Utilities
import { /* util */ } from '@/utils/...'

// Data
import { DEMO_POSTS } from '@/data/posts'

// Styles
import '@/styles/tailwind.css'
```

### Frequently Used Classes
```css
/* Layout */
container mx-auto px-4

/* Spacing */
p-4 mt-6 mb-8 gap-4

/* Text */
text-neutral-900 dark:text-neutral-100
font-medium text-lg

/* Background */
bg-white dark:bg-neutral-900
bg-primary-500

/* Border */
rounded-lg border border-neutral-200 dark:border-neutral-700

/* Effects */
hover:bg-primary-600 transition-colors
shadow-lg
```

---

**Last Updated**: December 2024
**Project Version**: 2.0.0
**Next.js Version**: 15.5+
**Target Audience**: LLM Code Generators (Claude, GPT-4, Gemini, etc.)

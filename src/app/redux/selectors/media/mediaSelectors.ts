import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../store';
import type { Media } from '../../types/media/mediaTypes';
import { MediaType } from '../../types/media/mediaTypes';

// Helper function to determine media type from mime type
const getMediaType = (mimeType: string): MediaType => {
  if (mimeType.startsWith('image/')) return MediaType.IMAGE;
  if (mimeType.startsWith('video/')) return MediaType.VIDEO;
  if (mimeType.startsWith('audio/')) return MediaType.AUDIO;
  if (mimeType.includes('pdf') || mimeType.includes('document')) return MediaType.DOCUMENT;
  return MediaType.OTHER;
};

// Helper function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// Base selectors
export const selectMediaState = (state: RootState) => state.media;

export const selectSelectedMedia = (state: RootState) => 
  state.media.selectedMedia;

export const selectSelectedMediaIds = (state: RootState) => 
  state.media.selectedMediaIds;

export const selectIsUploading = (state: RootState) => 
  state.media.isUploading;

export const selectIsDeleting = (state: RootState) => 
  state.media.isDeleting;

export const selectUploadProgress = (state: RootState) => 
  state.media.uploadProgress;

export const selectViewMode = (state: RootState) => 
  state.media.viewMode;

export const selectSortBy = (state: RootState) => 
  state.media.sortBy;

export const selectFilters = (state: RootState) => 
  state.media.filters;

export const selectSearchQuery = (state: RootState) => 
  state.media.searchQuery;

export const selectPreviewMedia = (state: RootState) => 
  state.media.previewMedia;

export const selectIsPreviewOpen = (state: RootState) => 
  state.media.isPreviewOpen;

// Memoized selectors
export const selectIsMediaSelected = createSelector(
  [
    selectSelectedMediaIds,
    (_state: RootState, mediaId: string) => mediaId,
  ],
  (selectedIds, mediaId) => {
    return selectedIds.includes(mediaId);
  }
);

export const selectHasSelectedMedia = createSelector(
  [selectSelectedMediaIds],
  (selectedIds) => selectedIds.length > 0
);

export const selectSelectedMediaCount = createSelector(
  [selectSelectedMediaIds],
  (selectedIds) => selectedIds.length
);

export const selectUploadProgressList = createSelector(
  [selectUploadProgress],
  (progress) => Object.values(progress)
);

export const selectActiveUploads = createSelector(
  [selectUploadProgressList],
  (progressList) => {
    return progressList.filter(
      p => p.status === 'uploading' || p.status === 'pending'
    );
  }
);

export const selectCompletedUploads = createSelector(
  [selectUploadProgressList],
  (progressList) => {
    return progressList.filter(p => p.status === 'completed');
  }
);

export const selectFailedUploads = createSelector(
  [selectUploadProgressList],
  (progressList) => {
    return progressList.filter(p => p.status === 'failed');
  }
);

export const selectMediaById = createSelector(
  [
    (_state: RootState, mediaList: Media[]) => mediaList,
    (_state: RootState, _mediaList: Media[], mediaId: string) => mediaId,
  ],
  (mediaList, mediaId) => {
    return mediaList.find(media => media.id === mediaId) ?? null;
  }
);

export const selectMediaByIds = createSelector(
  [
    (_state: RootState, mediaList: Media[]) => mediaList,
    selectSelectedMediaIds,
  ],
  (mediaList, selectedIds) => {
    return mediaList.filter(media => selectedIds.includes(media.id));
  }
);

export const selectSortedMedia = createSelector(
  [
    (_state: RootState, mediaList: Media[]) => mediaList,
    selectSortBy,
  ],
  (mediaList, sortBy) => {
    const sorted = [...mediaList];

    switch (sortBy) {
      case 'recent':
        sorted.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case 'oldest':
        sorted.sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        break;
      case 'name':
        sorted.sort((a, b) => a.filename.localeCompare(b.filename));
        break;
      case 'size':
        sorted.sort((a, b) => b.file_size - a.file_size);
        break;
    }

    return sorted;
  }
);

export const selectFilteredMedia = createSelector(
  [
    (_state: RootState, mediaList: Media[]) => mediaList,
    selectFilters,
    selectSearchQuery,
  ],
  (mediaList, filters, searchQuery) => {
    let filtered = [...mediaList];

    // Apply media type filter
    if (filters.mediaType) {
      filtered = filtered.filter(
        media => getMediaType(media.mime_type) === filters.mediaType
      );
    }

    // Apply mime type filter
    if (filters.mimeType) {
      filtered = filtered.filter(media => media.mime_type === filters.mimeType);
    }

    // Apply size filters
    if (filters.minSize !== undefined) {
      filtered = filtered.filter(media => media.file_size >= filters.minSize!);
    }
    if (filters.maxSize !== undefined) {
      filtered = filtered.filter(media => media.file_size <= filters.maxSize!);
    }

    // Apply date filters
    if (filters.startDate) {
      filtered = filtered.filter(
        media => new Date(media.created_at) >= new Date(filters.startDate!)
      );
    }
    if (filters.endDate) {
      filtered = filtered.filter(
        media => new Date(media.created_at) <= new Date(filters.endDate!)
      );
    }

    // Apply user filter
    if (filters.userId) {
      filtered = filtered.filter(media => media.user_id === filters.userId);
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(media =>
        media.filename.toLowerCase().includes(query)
      );
    }

    return filtered;
  }
);

export const selectSortedAndFilteredMedia = createSelector(
  [
    selectSortedMedia,
    selectFilters,
    selectSearchQuery,
  ],
  (sortedMedia, filters, searchQuery) => {
    let filtered = [...sortedMedia];

    // Apply media type filter
    if (filters.mediaType) {
      filtered = filtered.filter(
        media => getMediaType(media.mime_type) === filters.mediaType
      );
    }

    // Apply mime type filter
    if (filters.mimeType) {
      filtered = filtered.filter(media => media.mime_type === filters.mimeType);
    }

    // Apply size filters
    if (filters.minSize !== undefined) {
      filtered = filtered.filter(media => media.file_size >= filters.minSize!);
    }
    if (filters.maxSize !== undefined) {
      filtered = filtered.filter(media => media.file_size <= filters.maxSize!);
    }

    // Apply date filters
    if (filters.startDate) {
      filtered = filtered.filter(
        media => new Date(media.created_at) >= new Date(filters.startDate!)
      );
    }
    if (filters.endDate) {
      filtered = filtered.filter(
        media => new Date(media.created_at) <= new Date(filters.endDate!)
      );
    }

    // Apply user filter
    if (filters.userId) {
      filtered = filtered.filter(media => media.user_id === filters.userId);
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(media =>
        media.filename.toLowerCase().includes(query)
      );
    }

    return filtered;
  }
);

export const selectMediaByType = createSelector(
  [
    (_state: RootState, mediaList: Media[]) => mediaList,
    (_state: RootState, _mediaList: Media[], mediaType: MediaType) => mediaType,
  ],
  (mediaList, mediaType) => {
    return mediaList.filter(
      media => getMediaType(media.mime_type) === mediaType
    );
  }
);

export const selectMediaGroupedByType = createSelector(
  [(_state: RootState, mediaList: Media[]) => mediaList],
  (mediaList) => {
    const grouped = mediaList.reduce((acc, media) => {
      const type = getMediaType(media.mime_type);
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(media);
      return acc;
    }, {} as Record<MediaType, Media[]>);

    return Object.entries(grouped).map(([type, items]) => ({
      type: type as MediaType,
      media: items,
      count: items.length,
      totalSize: items.reduce((sum, m) => sum + m.file_size, 0),
    }));
  }
);

export const selectMediaGroupedByDate = createSelector(
  [selectSortedMedia],
  (mediaList) => {
    const grouped = mediaList.reduce((acc, media) => {
      const date = new Date(media.created_at).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(media);
      return acc;
    }, {} as Record<string, Media[]>);

    return Object.entries(grouped).map(([date, items]) => ({
      date,
      media: items,
      count: items.length,
    }));
  }
);

export const selectRecentMedia = createSelector(
  [
    selectSortedMedia,
    (_state: RootState, _mediaList: Media[], limit: number) => limit,
  ],
  (mediaList, limit) => {
    return mediaList.slice(0, limit);
  }
);

export const selectMediaStats = createSelector(
  [(_state: RootState, mediaList: Media[]) => mediaList],
  (mediaList) => {
    const totalSize = mediaList.reduce((sum, media) => sum + media.file_size, 0);
    
    const byType = mediaList.reduce((acc, media) => {
      const type = getMediaType(media.mime_type);
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<MediaType, number>);

    const byUser = mediaList.reduce((acc, media) => {
      acc[media.user_id] = (acc[media.user_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: mediaList.length,
      totalSize,
      formattedTotalSize: formatFileSize(totalSize),
      byType,
      byUser,
      averageSize: mediaList.length > 0 
        ? Math.round(totalSize / mediaList.length) 
        : 0,
    };
  }
);

export const selectImagesOnly = createSelector(
  [(_state: RootState, mediaList: Media[]) => mediaList],
  (mediaList) => {
    return mediaList.filter(media => getMediaType(media.mime_type) === MediaType.IMAGE);
  }
);

export const selectVideosOnly = createSelector(
  [(_state: RootState, mediaList: Media[]) => mediaList],
  (mediaList) => {
    return mediaList.filter(media => getMediaType(media.mime_type) === MediaType.VIDEO);
  }
);

export const selectDocumentsOnly = createSelector(
  [(_state: RootState, mediaList: Media[]) => mediaList],
  (mediaList) => {
    return mediaList.filter(media => getMediaType(media.mime_type) === MediaType.DOCUMENT);
  }
);

export const selectLargestMedia = createSelector(
  [
    (_state: RootState, mediaList: Media[]) => mediaList,
    (_state: RootState, _mediaList: Media[], limit: number) => limit,
  ],
  (mediaList, limit) => {
    return [...mediaList]
      .sort((a, b) => b.file_size - a.file_size)
      .slice(0, limit);
  }
);

export const selectHasSearchQuery = createSelector(
  [selectSearchQuery],
  (searchQuery) => searchQuery.trim().length > 0
);

export const selectHasActiveFilters = createSelector(
  [selectFilters],
  (filters) => {
    return Object.keys(filters).length > 0;
  }
);

export const selectIsAnyUploading = createSelector(
  [selectActiveUploads],
  (activeUploads) => activeUploads.length > 0
);

export const selectTotalUploadProgress = createSelector(
  [selectActiveUploads],
  (activeUploads) => {
    if (activeUploads.length === 0) return 0;
    const totalProgress = activeUploads.reduce(
      (sum, upload) => sum + upload.progress,
      0
    );
    return Math.round(totalProgress / activeUploads.length);
  }
);

export const selectMediaByUser = createSelector(
  [
    (_state: RootState, mediaList: Media[]) => mediaList,
    (_state: RootState, _mediaList: Media[], userId: string) => userId,
  ],
  (mediaList, userId) => {
    return mediaList.filter(media => media.user_id === userId);
  }
);
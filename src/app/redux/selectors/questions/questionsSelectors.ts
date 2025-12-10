import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../store';
import type { Question, QuestionStatus } from '../../types/questions/questionTypes';

// Helper functions
const getWordCount = (text: string): number => {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

// Base selectors
export const selectQuestionsState = (state: RootState) => state.questions;

export const selectSelectedQuestion = (state: RootState) => 
  state.questions.selectedQuestion;

export const selectSelectedQuestionIds = (state: RootState) => 
  state.questions.selectedQuestionIds;

export const selectIsCreating = (state: RootState) => 
  state.questions.isCreating;

export const selectIsEditing = (state: RootState) => 
  state.questions.isEditing;

export const selectEditingQuestionId = (state: RootState) => 
  state.questions.editingQuestionId;

export const selectIsDeleting = (state: RootState) => 
  state.questions.isDeleting;

export const selectViewMode = (state: RootState) => 
  state.questions.viewMode;

export const selectSortBy = (state: RootState) => 
  state.questions.sortBy;

export const selectFilters = (state: RootState) => 
  state.questions.filters;

export const selectSearchQuery = (state: RootState) => 
  state.questions.searchQuery;

// Memoized selectors
export const selectIsQuestionSelected = createSelector(
  [
    selectSelectedQuestionIds,
    (_state: RootState, questionId: string) => questionId,
  ],
  (selectedIds, questionId) => {
    return selectedIds.includes(questionId);
  }
);

export const selectHasSelectedQuestions = createSelector(
  [selectSelectedQuestionIds],
  (selectedIds) => selectedIds.length > 0
);

export const selectSelectedQuestionsCount = createSelector(
  [selectSelectedQuestionIds],
  (selectedIds) => selectedIds.length
);

export const selectQuestionById = createSelector(
  [
    (_state: RootState, questions: Question[]) => questions,
    (_state: RootState, _questions: Question[], questionId: string) => questionId,
  ],
  (questions, questionId) => {
    return questions.find(q => q.id === questionId) ?? null;
  }
);

export const selectQuestionsByIds = createSelector(
  [
    (_state: RootState, questions: Question[]) => questions,
    selectSelectedQuestionIds,
  ],
  (questions, selectedIds) => {
    return questions.filter(q => selectedIds.includes(q.id));
  }
);

export const selectSortedQuestions = createSelector(
  [
    (_state: RootState, questions: Question[]) => questions,
    selectSortBy,
  ],
  (questions, sortBy) => {
    const sorted = [...questions];

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
      case 'popular':
        sorted.sort((a, b) => b.views_count - a.views_count);
        break;
      case 'unanswered':
        sorted.sort((a, b) => a.answers_count - b.answers_count);
        break;
      case 'mostAnswered':
        sorted.sort((a, b) => b.answers_count - a.answers_count);
        break;
    }

    return sorted;
  }
);

export const selectFilteredQuestions = createSelector(
  [
    (_state: RootState, questions: Question[]) => questions,
    selectFilters,
    selectSearchQuery,
  ],
  (questions, filters, searchQuery) => {
    let filtered = [...questions];

    // Filter by category
    if (filters.categoryId) {
      filtered = filtered.filter(q => q.category_id === filters.categoryId);
    }

    // Filter by user
    if (filters.userId) {
      filtered = filtered.filter(q => q.user_id === filters.userId);
    }

    // Filter by status
    if (filters.status) {
      filtered = filtered.filter(q => q.status === filters.status);
    }

    // Filter by has answers
    if (filters.hasAnswers !== undefined) {
      filtered = filtered.filter(q => 
        filters.hasAnswers ? q.answers_count > 0 : q.answers_count === 0
      );
    }

    // Filter by is unanswered
    if (filters.isUnanswered) {
      filtered = filtered.filter(q => q.answers_count === 0);
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(q => 
        q.title.toLowerCase().includes(query) ||
        q.content.toLowerCase().includes(query)
      );
    }

    return filtered;
  }
);

export const selectSortedAndFilteredQuestions = createSelector(
  [
    selectSortedQuestions,
    selectFilters,
    selectSearchQuery,
  ],
  (sortedQuestions, filters, searchQuery) => {
    let filtered = [...sortedQuestions];

    // Filter by category
    if (filters.categoryId) {
      filtered = filtered.filter(q => q.category_id === filters.categoryId);
    }

    // Filter by user
    if (filters.userId) {
      filtered = filtered.filter(q => q.user_id === filters.userId);
    }

    // Filter by status
    if (filters.status) {
      filtered = filtered.filter(q => q.status === filters.status);
    }

    // Filter by has answers
    if (filters.hasAnswers !== undefined) {
      filtered = filtered.filter(q => 
        filters.hasAnswers ? q.answers_count > 0 : q.answers_count === 0
      );
    }

    // Filter by is unanswered
    if (filters.isUnanswered) {
      filtered = filtered.filter(q => q.answers_count === 0);
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(q => 
        q.title.toLowerCase().includes(query) ||
        q.content.toLowerCase().includes(query)
      );
    }

    return filtered;
  }
);

export const selectOpenQuestions = createSelector(
  [(_state: RootState, questions: Question[]) => questions],
  (questions) => {
    return questions.filter(q => q.status === 'open');
  }
);

export const selectClosedQuestions = createSelector(
  [(_state: RootState, questions: Question[]) => questions],
  (questions) => {
    return questions.filter(q => q.status === 'closed');
  }
);

export const selectArchivedQuestions = createSelector(
  [(_state: RootState, questions: Question[]) => questions],
  (questions) => {
    return questions.filter(q => q.status === 'archived');
  }
);

export const selectUnansweredQuestions = createSelector(
  [(_state: RootState, questions: Question[]) => questions],
  (questions) => {
    return questions.filter(q => q.answers_count === 0);
  }
);

export const selectQuestionsByStatus = createSelector(
  [
    (_state: RootState, questions: Question[]) => questions,
    (_state: RootState, _questions: Question[], status: QuestionStatus) => status,
  ],
  (questions, status) => {
    return questions.filter(q => q.status === status);
  }
);

export const selectQuestionsByCategory = createSelector(
  [
    (_state: RootState, questions: Question[]) => questions,
    (_state: RootState, _questions: Question[], categoryId: string) => categoryId,
  ],
  (questions, categoryId) => {
    return questions.filter(q => q.category_id === categoryId);
  }
);

export const selectQuestionsByUser = createSelector(
  [
    (_state: RootState, questions: Question[]) => questions,
    (_state: RootState, _questions: Question[], userId: string) => userId,
  ],
  (questions, userId) => {
    return questions.filter(q => q.user_id === userId);
  }
);

export const selectQuestionsGroupedByStatus = createSelector(
  [(_state: RootState, questions: Question[]) => questions],
  (questions) => {
    const grouped = questions.reduce((acc, question) => {
      const status = question.status;
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(question);
      return acc;
    }, {} as Record<QuestionStatus, Question[]>);

    return Object.entries(grouped).map(([status, items]) => ({
      status: status as QuestionStatus,
      questions: items,
      count: items.length,
    }));
  }
);

export const selectQuestionsGroupedByCategory = createSelector(
  [(_state: RootState, questions: Question[]) => questions],
  (questions) => {
    const grouped = questions.reduce((acc, question) => {
      const categoryId = question.category_id;
      if (!acc[categoryId]) {
        acc[categoryId] = [];
      }
      acc[categoryId].push(question);
      return acc;
    }, {} as Record<string, Question[]>);

    return Object.entries(grouped).map(([categoryId, items]) => ({
      categoryId,
      category: items[0]?.category ?? null,
      questions: items,
      count: items.length,
    }));
  }
);

export const selectRecentQuestions = createSelector(
  [
    selectSortedQuestions,
    (_state: RootState, _questions: Question[], limit: number) => limit,
  ],
  (questions, limit) => {
    return questions.slice(0, limit);
  }
);

export const selectPopularQuestions = createSelector(
  [
    (_state: RootState, questions: Question[]) => questions,
    (_state: RootState, _questions: Question[], limit: number) => limit,
  ],
  (questions, limit) => {
    return [...questions]
      .sort((a, b) => b.views_count - a.views_count)
      .slice(0, limit);
  }
);

export const selectMostAnsweredQuestions = createSelector(
  [
    (_state: RootState, questions: Question[]) => questions,
    (_state: RootState, _questions: Question[], limit: number) => limit,
  ],
  (questions, limit) => {
    return [...questions]
      .sort((a, b) => b.answers_count - a.answers_count)
      .slice(0, limit);
  }
);

export const selectQuestionsStats = createSelector(
  [(_state: RootState, questions: Question[]) => questions],
  (questions) => {
    const totalViews = questions.reduce((sum, q) => sum + q.views_count, 0);
    const totalAnswers = questions.reduce((sum, q) => sum + q.answers_count, 0);

    return {
      total: questions.length,
      open: questions.filter(q => q.status === 'open').length,
      closed: questions.filter(q => q.status === 'closed').length,
      archived: questions.filter(q => q.status === 'archived').length,
      answered: questions.filter(q => q.answers_count > 0).length,
      unanswered: questions.filter(q => q.answers_count === 0).length,
      totalViews,
      totalAnswers,
      averageAnswers: questions.length > 0 
        ? Math.round(totalAnswers / questions.length * 100) / 100 
        : 0,
    };
  }
);

export const selectQuestionWithDetails = createSelector(
  [
    (_state: RootState, questions: Question[]) => questions,
    (_state: RootState, _questions: Question[], questionId: string) => questionId,
  ],
  (questions, questionId) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return null;

    return {
      ...question,
      wordCount: getWordCount(question.content),
      hasAcceptedAnswer: false, // This would come from answers data
      isUnanswered: question.answers_count === 0,
    };
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

export const selectIsEditingQuestion = createSelector(
  [
    selectEditingQuestionId,
    (_state: RootState, questionId: string) => questionId,
  ],
  (editingQuestionId, questionId) => {
    return editingQuestionId === questionId;
  }
);
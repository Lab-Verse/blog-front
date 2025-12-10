import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../store';
import type { Answer } from '../../types/answers/answerTypes';

// Helper functions
const getWordCount = (text: string): number => {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

const getCharacterCount = (text: string): number => {
  return text.length;
};

// Base selectors
export const selectAnswersState = (state: RootState) => state.answers;

export const selectSelectedAnswer = (state: RootState) => 
  state.answers.selectedAnswer;

export const selectSelectedAnswerIds = (state: RootState) => 
  state.answers.selectedAnswerIds;

export const selectIsCreating = (state: RootState) => 
  state.answers.isCreating;

export const selectIsEditing = (state: RootState) => 
  state.answers.isEditing;

export const selectEditingAnswerId = (state: RootState) => 
  state.answers.editingAnswerId;

export const selectIsDeleting = (state: RootState) => 
  state.answers.isDeleting;

export const selectSortBy = (state: RootState) => 
  state.answers.sortBy;

export const selectSearchQuery = (state: RootState) => 
  state.answers.searchQuery;

export const selectFilterByQuestion = (state: RootState) => 
  state.answers.filterByQuestion;

export const selectFilterByUser = (state: RootState) => 
  state.answers.filterByUser;

export const selectShowAcceptedOnly = (state: RootState) => 
  state.answers.showAcceptedOnly;

export const selectReplyingToQuestionId = (state: RootState) => 
  state.answers.replyingToQuestionId;

// Memoized selectors
export const selectIsAnswerSelected = createSelector(
  [
    selectSelectedAnswerIds,
    (_state: RootState, answerId: string) => answerId,
  ],
  (selectedIds, answerId) => {
    return selectedIds.includes(answerId);
  }
);

export const selectHasSelectedAnswers = createSelector(
  [selectSelectedAnswerIds],
  (selectedIds) => selectedIds.length > 0
);

export const selectSelectedAnswersCount = createSelector(
  [selectSelectedAnswerIds],
  (selectedIds) => selectedIds.length
);

export const selectIsReplyingToQuestion = createSelector(
  [
    selectReplyingToQuestionId,
    (_state: RootState, questionId: string) => questionId,
  ],
  (replyingToQuestionId, questionId) => {
    return replyingToQuestionId === questionId;
  }
);

export const selectAnswerById = createSelector(
  [
    (_state: RootState, answers: Answer[]) => answers,
    (_state: RootState, _answers: Answer[], answerId: string) => answerId,
  ],
  (answers, answerId) => {
    return answers.find(a => a.id === answerId) ?? null;
  }
);

export const selectAnswersByIds = createSelector(
  [
    (_state: RootState, answers: Answer[]) => answers,
    selectSelectedAnswerIds,
  ],
  (answers, selectedIds) => {
    return answers.filter(a => selectedIds.includes(a.id));
  }
);

export const selectAcceptedAnswers = createSelector(
  [(_state: RootState, answers: Answer[]) => answers],
  (answers) => {
    return answers.filter(a => a.is_accepted);
  }
);

export const selectNotAcceptedAnswers = createSelector(
  [(_state: RootState, answers: Answer[]) => answers],
  (answers) => {
    return answers.filter(a => !a.is_accepted);
  }
);

export const selectAnswersWithVotes = createSelector(
  [(_state: RootState, answers: Answer[]) => answers],
  (answers) => {
    return answers.filter(a => a.votes_count > 0);
  }
);

export const selectSortedAnswers = createSelector(
  [
    (_state: RootState, answers: Answer[]) => answers,
    selectSortBy,
  ],
  (answers, sortBy) => {
    const sorted = [...answers];

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
      case 'votes':
        sorted.sort((a, b) => b.votes_count - a.votes_count);
        break;
      case 'accepted':
        sorted.sort((a, b) => {
          if (a.is_accepted === b.is_accepted) {
            return b.votes_count - a.votes_count;
          }
          return a.is_accepted ? -1 : 1;
        });
        break;
    }

    return sorted;
  }
);

export const selectFilteredAnswers = createSelector(
  [
    (_state: RootState, answers: Answer[]) => answers,
    selectFilterByQuestion,
    selectFilterByUser,
    selectShowAcceptedOnly,
    selectSearchQuery,
  ],
  (answers, filterByQuestion, filterByUser, showAcceptedOnly, searchQuery) => {
    let filtered = [...answers];

    // Filter by question
    if (filterByQuestion) {
      filtered = filtered.filter(a => a.question_id === filterByQuestion);
    }

    // Filter by user
    if (filterByUser) {
      filtered = filtered.filter(a => a.user_id === filterByUser);
    }

    // Filter by accepted only
    if (showAcceptedOnly) {
      filtered = filtered.filter(a => a.is_accepted);
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(a =>
        a.content.toLowerCase().includes(query)
      );
    }

    return filtered;
  }
);

export const selectSortedAndFilteredAnswers = createSelector(
  [
    selectSortedAnswers,
    selectFilterByQuestion,
    selectFilterByUser,
    selectShowAcceptedOnly,
    selectSearchQuery,
  ],
  (sortedAnswers, filterByQuestion, filterByUser, showAcceptedOnly, searchQuery) => {
    let filtered = [...sortedAnswers];

    // Filter by question
    if (filterByQuestion) {
      filtered = filtered.filter(a => a.question_id === filterByQuestion);
    }

    // Filter by user
    if (filterByUser) {
      filtered = filtered.filter(a => a.user_id === filterByUser);
    }

    // Filter by accepted only
    if (showAcceptedOnly) {
      filtered = filtered.filter(a => a.is_accepted);
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(a =>
        a.content.toLowerCase().includes(query)
      );
    }

    return filtered;
  }
);

export const selectAnswersByQuestion = createSelector(
  [
    (_state: RootState, answers: Answer[]) => answers,
    (_state: RootState, _answers: Answer[], questionId: string) => questionId,
  ],
  (answers, questionId) => {
    return answers.filter(a => a.question_id === questionId);
  }
);

export const selectAnswersByUser = createSelector(
  [
    (_state: RootState, answers: Answer[]) => answers,
    (_state: RootState, _answers: Answer[], userId: string) => userId,
  ],
  (answers, userId) => {
    return answers.filter(a => a.user_id === userId);
  }
);

export const selectAnswersGroupedByQuestion = createSelector(
  [(_state: RootState, answers: Answer[]) => answers],
  (answers) => {
    const grouped = answers.reduce((acc, answer) => {
      const questionId = answer.question_id;
      if (!acc[questionId]) {
        acc[questionId] = [];
      }
      acc[questionId].push(answer);
      return acc;
    }, {} as Record<string, Answer[]>);

    return Object.entries(grouped).map(([questionId, items]) => {
      const acceptedAnswer = items.find(a => a.is_accepted);
      const topAnswer = [...items].sort((a, b) => b.votes_count - a.votes_count)[0];

      return {
        questionId,
        question: items[0]?.question ?? null,
        answers: items,
        count: items.length,
        acceptedAnswer,
        topAnswer,
      };
    });
  }
);

export const selectAcceptedAnswerForQuestion = createSelector(
  [
    (_state: RootState, answers: Answer[]) => answers,
    (_state: RootState, _answers: Answer[], questionId: string) => questionId,
  ],
  (answers, questionId) => {
    return answers.find(a => a.question_id === questionId && a.is_accepted) ?? null;
  }
);

export const selectTopAnswerForQuestion = createSelector(
  [
    (_state: RootState, answers: Answer[]) => answers,
    (_state: RootState, _answers: Answer[], questionId: string) => questionId,
  ],
  (answers, questionId) => {
    const questionAnswers = answers.filter(a => a.question_id === questionId);
    if (questionAnswers.length === 0) return null;
    
    return questionAnswers.reduce((top, current) => 
      current.votes_count > top.votes_count ? current : top
    );
  }
);

export const selectRecentAnswers = createSelector(
  [
    selectSortedAnswers,
    (_state: RootState, _answers: Answer[], limit: number) => limit,
  ],
  (answers, limit) => {
    return answers.slice(0, limit);
  }
);

export const selectTopAnswers = createSelector(
  [
    (_state: RootState, answers: Answer[]) => answers,
    (_state: RootState, _answers: Answer[], limit: number) => limit,
  ],
  (answers, limit) => {
    return [...answers]
      .sort((a, b) => b.votes_count - a.votes_count)
      .slice(0, limit);
  }
);

export const selectAnswersStats = createSelector(
  [(_state: RootState, answers: Answer[]) => answers],
  (answers) => {
    const totalVotes = answers.reduce((sum, a) => sum + a.votes_count, 0);

    return {
      total: answers.length,
      accepted: answers.filter(a => a.is_accepted).length,
      notAccepted: answers.filter(a => !a.is_accepted).length,
      totalVotes,
      averageVotes: answers.length > 0 
        ? Math.round(totalVotes / answers.length * 100) / 100 
        : 0,
      withVotes: answers.filter(a => a.votes_count > 0).length,
      withoutVotes: answers.filter(a => a.votes_count === 0).length,
    };
  }
);

export const selectAnswerWithDetails = createSelector(
  [
    (_state: RootState, answers: Answer[]) => answers,
    (_state: RootState, _answers: Answer[], answerId: string) => answerId,
  ],
  (answers, answerId) => {
    const answer = answers.find(a => a.id === answerId);
    if (!answer) return null;

    // Find all answers for the same question
    const questionAnswers = answers.filter(a => a.question_id === answer.question_id);
    const topAnswer = questionAnswers.reduce((top, current) => 
      current.votes_count > top.votes_count ? current : top
    );

    return {
      ...answer,
      wordCount: getWordCount(answer.content),
      characterCount: getCharacterCount(answer.content),
      hasVotes: answer.votes_count > 0,
      isTopAnswer: topAnswer.id === answer.id,
    };
  }
);

export const selectHasSearchQuery = createSelector(
  [selectSearchQuery],
  (searchQuery) => searchQuery.trim().length > 0
);

export const selectHasActiveFilters = createSelector(
  [selectFilterByQuestion, selectFilterByUser, selectShowAcceptedOnly],
  (filterByQuestion, filterByUser, showAcceptedOnly) => {
    return filterByQuestion !== null || 
           filterByUser !== null || 
           showAcceptedOnly;
  }
);

export const selectIsEditingAnswer = createSelector(
  [
    selectEditingAnswerId,
    (_state: RootState, answerId: string) => answerId,
  ],
  (editingAnswerId, answerId) => {
    return editingAnswerId === answerId;
  }
);
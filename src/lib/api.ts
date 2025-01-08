import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Question {
  id: number;
  subject_id: number;
  topic_id: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
  year: number;
  explanation_text: string;
}

export interface Subject {
  id: number;
  name: string;
}

export interface Topic {
  id: number;
  subject_id: number;
  name: string;
}

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'https://test.upscpreviousquestiones.com/' }),
  endpoints: (builder) => ({
    getQuestions: builder.query<Question[], void>({
      query: () => 'questions',
    }),
    getSubjects: builder.query<Subject[], void>({
      query: () => 'subjects',
    }),
    getTopics: builder.query<Topic[], number>({
      query: (subjectId) => `topics?subject_id=${subjectId}`,
    }),
  }),
});

export const { useGetQuestionsQuery, useGetSubjectsQuery, useGetTopicsQuery } = api;
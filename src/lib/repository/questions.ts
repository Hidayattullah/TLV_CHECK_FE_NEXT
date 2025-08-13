import customFetch from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { Question } from "@/lib/api/types";

// This is the REAL repository that will be used in production.
// It will make real API calls to the backend.

export async function getQuestions(): Promise<Question[]> {
  console.log("Fetching real questions data...");
  return customFetch<Question[]>(API_ENDPOINTS.GET_QUESTIONS);
}

export async function addQuestion(data: { questionText: string }): Promise<Question> {
  console.log("Adding new question via API...");
  return customFetch<Question>(API_ENDPOINTS.ADD_QUESTION, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function respondToQuestion(
  questionId: string,
  responseText: string,
  responderName: string
): Promise<Question> {
  console.log(`Responding to question ${questionId} via API...`);
  return customFetch<Question>(API_ENDPOINTS.RESPOND_TO_QUESTION(questionId), {
    method: 'POST',
    body: JSON.stringify({ responseText, responderName }),
  });
}

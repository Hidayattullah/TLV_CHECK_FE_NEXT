import { mockQuestions } from "@/lib/mock/questions";
import type { Question } from "@/lib/api/types";

let questions: Question[] = [...mockQuestions];

const simulateApiDelay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export async function getQuestions(): Promise<Question[]> {
  await simulateApiDelay();
  console.log("Fetching mock questions...");
  return Promise.resolve([...questions]);
}

export async function respondToQuestion(
  questionId: string,
  responseText: string,
  responderName: string
): Promise<Question> {
  await simulateApiDelay();
  console.log(`Responding to mock question ${questionId}...`);
  let updatedQuestion: Question | undefined;
  questions = questions.map(q => {
    if (q.id === questionId) {
      updatedQuestion = {
        ...q,
        isResponded: true,
        responseText,
        responseBy: responderName,
      };
      return updatedQuestion;
    }
    return q;
  });

  if (updatedQuestion) {
    return Promise.resolve(updatedQuestion);
  } else {
    return Promise.reject(new Error("Question not found"));
  }
}

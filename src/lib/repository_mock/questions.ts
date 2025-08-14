
import { mockQuestions } from "@/lib/mock/questions";
import type { Question } from "@/lib/api/types";

let questions: Question[] = [...mockQuestions];
const ARCHIVE_AFTER_DAYS = 7;
const DELETE_AFTER_DAYS = 14;

const simulateApiDelay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate cron job for archiving and deleting
const processQuestions = () => {
  const now = new Date();
  questions = questions
    .map(q => {
      const submittedDate = new Date(q.submittedDate);
      const diffDays = (now.getTime() - submittedDate.getTime()) / (1000 * 3600 * 24);
      
      if (!q.isArchived && diffDays > ARCHIVE_AFTER_DAYS) {
        return { ...q, isArchived: true, archivedDate: now.toISOString() };
      }
      return q;
    })
    .filter(q => {
        if (q.isArchived && q.archivedDate) {
            const archivedDate = new Date(q.archivedDate);
            const diffDays = (now.getTime() - archivedDate.getTime()) / (1000 * 3600 * 24);
            return diffDays <= ARCHIVE_AFTER_DAYS;
        }
        return true;
    });
};


export async function getQuestions(): Promise<Question[]> {
  await simulateApiDelay();
  processQuestions(); // Run processing before returning data
  console.log("Fetching mock questions...");
  return Promise.resolve([...questions]);
}

export async function addQuestion(data: { userName: string, avatarUrl?: string, questionText: string }): Promise<Question> {
  await simulateApiDelay();
  console.log("Adding mock question...");
  const newQuestion: Question = {
    ...data,
    id: `q-${Date.now()}`,
    submittedDate: new Date().toISOString(),
    isResponded: false,
    isArchived: false,
  };
  questions = [newQuestion, ...questions];
  return Promise.resolve(newQuestion);
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

export async function deleteQuestions(ids: string[]): Promise<void> {
    await simulateApiDelay(500);
    console.log(`Deleting mock questions: ${ids.join(', ')}`);
    const initialLength = questions.length;
    questions = questions.filter(q => !ids.includes(q.id));
    if (questions.length < initialLength) {
        return Promise.resolve();
    } else {
        return Promise.reject(new Error("Some questions not found for deletion"));
    }
}

export async function archiveQuestion(questionId: string): Promise<Question> {
  await simulateApiDelay();
  console.log(`Archiving mock question ${questionId}...`);
  let archivedQuestion: Question | undefined;
  questions = questions.map(q => {
    if (q.id === questionId) {
      archivedQuestion = {
        ...q,
        isArchived: true,
        archivedDate: new Date().toISOString(),
      };
      return archivedQuestion;
    }
    return q;
  });

  if (archivedQuestion) {
    return Promise.resolve(archivedQuestion);
  } else {
    return Promise.reject(new Error("Question not found for archiving"));
  }
}

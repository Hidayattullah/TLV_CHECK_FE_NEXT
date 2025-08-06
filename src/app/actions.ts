"use server";

import { generatePersonalizedMessage, type PersonalizedMessageInput } from "@/ai/flows/generate-personalized-message";

export async function generatePersonalizedMessageAction(input: PersonalizedMessageInput) {
  try {
    const result = await generatePersonalizedMessage(input);
    return { success: true, message: result.personalizedMessage };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, error: `Failed to generate message: ${errorMessage}` };
  }
}

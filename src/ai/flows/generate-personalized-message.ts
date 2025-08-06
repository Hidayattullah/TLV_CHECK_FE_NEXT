'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating personalized messages to church members based on their attendance.
 *
 * The flow takes member details and attendance history as input and returns a personalized message.
 * - generatePersonalizedMessage - A function that generates personalized messages for church members.
 * - PersonalizedMessageInput - The input type for the generatePersonalizedMessage function.
 * - PersonalizedMessageOutput - The return type for the generatePersonalizedMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedMessageInputSchema = z.object({
  memberName: z.string().describe('The name of the church member.'),
  attendanceHistory: z.string().describe('The attendance history of the member.'),
  recentActivities: z.string().optional().describe('Recent activities or events the member participated in.'),
});

export type PersonalizedMessageInput = z.infer<typeof PersonalizedMessageInputSchema>;

const PersonalizedMessageOutputSchema = z.object({
  personalizedMessage: z.string().describe('The personalized message for the church member.'),
});

export type PersonalizedMessageOutput = z.infer<typeof PersonalizedMessageOutputSchema>;

export async function generatePersonalizedMessage(input: PersonalizedMessageInput): Promise<PersonalizedMessageOutput> {
  return generatePersonalizedMessageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedMessagePrompt',
  input: {schema: PersonalizedMessageInputSchema},
  output: {schema: PersonalizedMessageOutputSchema},
  prompt: `You are a church administrator tasked with generating personalized messages to encourage members with low attendance to attend more regularly.

  Use the following information to create an engaging and supportive message:

  Member Name: {{{memberName}}}
  Attendance History: {{{attendanceHistory}}}
  Recent Activities: {{{recentActivities}}}

  Focus on fostering a sense of community and reminding the member of the benefits of regular attendance.`,
});

const generatePersonalizedMessageFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedMessageFlow',
    inputSchema: PersonalizedMessageInputSchema,
    outputSchema: PersonalizedMessageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

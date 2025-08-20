// threat-detection.ts
'use server';
/**
 * @fileOverview An AI-powered threat detection flow.
 *
 * - detectThreat - A function that analyzes user behavior and flags suspicious activities.
 * - ThreatDetectionInput - The input type for the detectThreat function.
 * - ThreatDetectionOutput - The return type for the detectThreat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ThreatDetectionInputSchema = z.object({
  userActivity: z.string().describe('Description of the user activity to analyze.'),
  userRole: z.string().describe('The role of the user performing the activity.'),
  accessLevel: z.string().describe('The level of access the user has.'),
});
export type ThreatDetectionInput = z.infer<typeof ThreatDetectionInputSchema>;

const ThreatDetectionOutputSchema = z.object({
  isSuspicious: z.boolean().describe('Whether the activity is considered suspicious.'),
  threatLevel: z.string().describe('The level of threat (e.g., low, medium, high).'),
  explanation: z.string().describe('Explanation of why the activity is suspicious or not.'),
});
export type ThreatDetectionOutput = z.infer<typeof ThreatDetectionOutputSchema>;

export async function detectThreat(input: ThreatDetectionInput): Promise<ThreatDetectionOutput> {
  return detectThreatFlow(input);
}

const detectThreatPrompt = ai.definePrompt({
  name: 'detectThreatPrompt',
  input: {schema: ThreatDetectionInputSchema},
  output: {schema: ThreatDetectionOutputSchema},
  prompt: `You are an AI-powered security analyst that analyzes user activity, role, and access level to detect suspicious behavior.

  Based on the provided information, determine if the activity is suspicious and provide a threat level and explanation.

  User Activity: {{{userActivity}}}
  User Role: {{{userRole}}}
  Access Level: {{{accessLevel}}}

  Consider factors such as unusual access times, unauthorized resource access, and deviations from typical behavior for the user role.

  Return a JSON object in the following format:
  {
    "isSuspicious": true/false,
    "threatLevel": "low/medium/high",
    "explanation": "Explanation of the analysis."
  }`,
});

const detectThreatFlow = ai.defineFlow(
  {
    name: 'detectThreatFlow',
    inputSchema: ThreatDetectionInputSchema,
    outputSchema: ThreatDetectionOutputSchema,
  },
  async input => {
    const {output} = await detectThreatPrompt(input);
    return output!;
  }
);

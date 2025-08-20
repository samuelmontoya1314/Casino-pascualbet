'use server';

import { z } from 'zod';
import { detectThreat, type ThreatDetectionOutput } from '@/ai/flows/threat-detection';

const threatSchema = z.object({
  userActivity: z.string().min(10, 'Activity description must be at least 10 characters long.'),
  userRole: z.string(),
  accessLevel: z.string(),
});

interface ThreatDetectionState {
    result?: ThreatDetectionOutput;
    error?: string;
    message?: string;
}

export async function checkForThreat(prevState: any, formData: FormData): Promise<ThreatDetectionState> {
  const validatedFields = threatSchema.safeParse({
    userActivity: formData.get('userActivity'),
    userRole: formData.get('userRole'),
    accessLevel: formData.get('accessLevel'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.userActivity?.join(', ') ?? 'Invalid input.',
    };
  }

  try {
    const result = await detectThreat(validatedFields.data);
    return { result, message: "Analysis complete." };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to analyze threat. Please try again later.' };
  }
}

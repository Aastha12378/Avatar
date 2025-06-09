'use server';

import {ai} from '@/lib/genkit';
import {z} from 'genkit';

// Combined schema for input and output
const ThemeSchema = {
  input: z.object({
    photoDataUri: z.string().describe("Profile picture as data URI (format: 'data:<mimetype>;base64,<encoded_data>')"),
    userInput: z.string().describe('User preferences or desired theme characteristics')
  }),
  output: z.object({
    themes: z.array(z.string()).describe('Array of suggested themes')
  })
};

export type ThemeInput = z.infer<typeof ThemeSchema.input>;
export type ThemeOutput = z.infer<typeof ThemeSchema.output>;

// Single optimized function for theme suggestions
export async function suggestThemes(input: ThemeInput): Promise<ThemeOutput> {
  const prompt = ai.definePrompt({
    name: 'suggestThemesPrompt',
    model: 'googleai/gemini-1.5-flash',
    input: {schema: ThemeSchema.input},
    output: {schema: ThemeSchema.output},
    prompt: `You are an AI-powered theme suggestion tool for profile pictures.
    Based on the uploaded profile picture and user input, suggest a list of approximately 10 themes that would be suitable for the profile picture.
    User Input: {{{userInput}}}
    Profile Picture: {{media url=photoDataUri}}`
  });

  const {output} = await prompt(input);
  return {
    themes: output?.themes.slice(0, 12) || []
  };
} 
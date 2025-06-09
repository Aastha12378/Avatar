import {ai} from '@/lib/genkit';
import {z} from 'genkit';

const SuggestThemesInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A profile picture as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  userInput: z.string().describe('User preferences or desired theme characteristics.'),
});

const SuggestThemesOutputSchema = z.object({
  themes: z.array(z.string()).describe('An array of approximately 10 suggested themes.'),
});

const prompt = ai.definePrompt({
  name: 'suggestThemesPrompt',
  model: 'llava-1.5-7b',
  input: {schema: SuggestThemesInputSchema},
  output: {schema: SuggestThemesOutputSchema},
  prompt: `You are an AI-powered theme suggestion tool for profile pictures. Analyze the provided profile picture and suggest themes based on the user's preferences.

  User Input: {{{userInput}}}
  Profile Picture: {{media url=photoDataUri}}

  Please analyze the image and suggest themes that would complement the profile picture while considering the user's preferences. Return a JSON array of theme suggestions.
  `,
});

export const suggestThemesFlow = ai.defineFlow(
  {
    name: 'suggestThemesFlow',
    inputSchema: SuggestThemesInputSchema,
    outputSchema: SuggestThemesOutputSchema,
  },
  async (input: z.infer<typeof SuggestThemesInputSchema>) => {
    const {output} = await prompt(input);
    if (!output) {
      console.warn('Suggest themes flow received no output from the prompt.');
      return { themes: [] };
    }
    // Ensure a maximum of 10-12 themes even if the model provides more
    if (output.themes.length > 12) {
        return { themes: output.themes.slice(0, 12) };
    }
    console.log('output', output);
    
    return output!;
  }
); 
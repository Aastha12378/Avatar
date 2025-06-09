import {ai} from '@/lib/genkit';
import {z} from 'genkit';

const GenerateThemedImageInputSchema = z.object({
  originalImage: z
    .string()
    .describe(
      "The original profile picture as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  theme: z.string().describe('The theme to apply to the image.'),
  style: z.string().optional().describe('Optional style preferences for the theme.'),
});

const GenerateThemedImageOutputSchema = z.object({
  description: z.string().describe('A detailed description of how the themed image should look.'),
  suggestions: z.array(z.string()).describe('Specific suggestions for implementing the theme.'),
});

const prompt = ai.definePrompt({
  name: 'generateThemedImagePrompt',
  model: 'llava-1.5-7b',
  input: {schema: GenerateThemedImageInputSchema},
  output: {schema: GenerateThemedImageOutputSchema},
  prompt: `You are an AI-powered image theme generator. Analyze the provided profile picture and generate a detailed description of how it should be themed.

  Original Image: {{media url=originalImage}}
  Theme: {{{theme}}}
  Style Preferences: {{{style}}}

  Please analyze the image and provide:
  1. A detailed description of how the themed image should look
  2. Specific suggestions for implementing the theme while maintaining the original image's key features
  `,
});

export const generateThemedImageFlow = ai.defineFlow(
  {
    name: 'generateThemedImageFlow',
    inputSchema: GenerateThemedImageInputSchema,
    outputSchema: GenerateThemedImageOutputSchema,
  },
  async (input: z.infer<typeof GenerateThemedImageInputSchema>) => {
    const {output} = await prompt(input);
    if (!output) {
      console.warn('Generate themed image flow received no output from the prompt.');
      return {
        description: 'Unable to generate theme suggestions.',
        suggestions: [],
      };
    }
    
    return output;
  }
); 
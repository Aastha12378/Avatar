"use server";

import { ai } from "@/lib/genkit";
import { z } from "genkit";

const GenerateAvatarInputSchema = z.object({
  imageUrl: z
    .string()
    .describe(
      "A profile picture as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'. This image will be transformed into the specified style and theme."
    ),
  style: z
    .string()
    .describe("The selected avatar style (cartoon, anime, comic, sketch)"),
  theme: z.string().describe("The selected theme for the avatar"),
  contentType: z.string().optional().describe("The content type of the image"),
});

export type GenerateAvatarInput = z.infer<typeof GenerateAvatarInputSchema>;

const GenerateAvatarOutputSchema = z.object({
  imageUrl: z.string().describe("The URL of the generated avatar image"),
});

export type GenerateAvatarOutput = z.infer<typeof GenerateAvatarOutputSchema>;

export async function generateAvatar(
  input: GenerateAvatarInput
): Promise<GenerateAvatarOutput> {
  return generateAvatarFlow(input);
}

const generateAvatarFlow = ai.defineFlow(
  {
    name: "generateAvatarFlow",
    inputSchema: GenerateAvatarInputSchema,
    outputSchema: GenerateAvatarOutputSchema,
  },
  async (input) => {
    if (!input.imageUrl) {
      throw new Error("Image URL is required");
    }

    input.contentType = input.contentType || "image/jpeg";
    try {
      const { media } = await ai.generate({
        model: "googleai/gemini-2.0-flash-exp",
        prompt: [
          {
            media: {
              url: input.imageUrl,
              contentType: input.contentType,
            },
          },
          {
            text: `You are an advanced AI that transforms profile images into stylized avatars.
            
Please transform the provided profile picture into an avatar with the following specifications:
- **Style**: ${input.style} 
- **Theme**: ${input.theme} 
- **Format**: SVG vector graphic

Ensure:
- The person's core facial features are retained.
- The output image is detailed, aesthetically styled, and fits the requested style and theme.
- The result is an SVG image that can be used in digital profile displays.
            
Return only the generated SVG image URL or Base64-encoded image. Do not return any placeholder URLs or sample outputs.`,
          },
        ],
        config: {
          responseModalities: ["TEXT", "IMAGE"],
        },
      });

      if (!media?.url) {
        throw new Error("Failed to generate avatar: No image URL received");
      }

      const url = new URL(media.url);
      return { imageUrl: url.toString() };
    } catch (error) {
      console.error("Avatar generation error:", error);
      throw new Error(
        "Failed to generate avatar: " +
        (error instanceof Error ? error.message : "Unknown error")
      );
    }
  }
);

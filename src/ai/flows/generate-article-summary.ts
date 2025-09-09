'use server';

/**
 * @fileOverview An AI agent that generates a brief summary of an article.
 *
 * - generateArticleSummary - A function that generates the article summary.
 * - GenerateArticleSummaryInput - The input type for the generateArticleSummary function.
 * - GenerateArticleSummaryOutput - The return type for the generateArticleSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateArticleSummaryInputSchema = z.object({
  articleHtml: z
    .string()
    .describe('The full HTML content of the article to summarize.'),
});
export type GenerateArticleSummaryInput = z.infer<
  typeof GenerateArticleSummaryInputSchema
>;

const GenerateArticleSummaryOutputSchema = z.object({
  summary: z
    .string()
    .describe('A brief summary of the article content.'),
});
export type GenerateArticleSummaryOutput = z.infer<
  typeof GenerateArticleSummaryOutputSchema
>;

export async function generateArticleSummary(
  input: GenerateArticleSummaryInput
): Promise<GenerateArticleSummaryOutput> {
  return generateArticleSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateArticleSummaryPrompt',
  input: {schema: GenerateArticleSummaryInputSchema},
  output: {schema: GenerateArticleSummaryOutputSchema},
  prompt: `You are an expert content summarizer.  Given the HTML content of an article, you will create a concise summary of the article's main points.

Article HTML Content: {{{articleHtml}}}`,
});

const generateArticleSummaryFlow = ai.defineFlow(
  {
    name: 'generateArticleSummaryFlow',
    inputSchema: GenerateArticleSummaryInputSchema,
    outputSchema: GenerateArticleSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

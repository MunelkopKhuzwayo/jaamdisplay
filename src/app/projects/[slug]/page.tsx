import { supabase } from '@/lib/supabase';
import type { Post } from '@/types';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BrainCircuit } from 'lucide-react';
import { generateArticleSummary } from '@/ai/flows/generate-article-summary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Revalidate every hour
export const revalidate = 3600;

// Generate static paths at build time for better performance
export async function generateStaticParams() {
  try {
    const { data: posts } = await supabase.from('postsjosh').select('slug');
    return posts?.map(({ slug }) => ({ slug })) || [];
  } catch (error) {
    console.error('Failed to generate static params:', error);
    return [];
  }
}

async function getPost(slug: string): Promise<Post | null> {
  const { data, error } = await supabase.from('postsjosh').select('*').eq('slug', slug).single();

  if (error || !data) {
    // This will be caught by Next.js and trigger a 404
    return null;
  }
  return data;
}

// Helper to extract the content inside the <body> tag
function extractBodyContent(html: string): string {
  const bodyMatch = /<body[^>]*>([\s\S]*)<\/body>/i.exec(html);
  // If a body tag is found, return its content, otherwise return the whole string
  // assuming it's a fragment.
  return bodyMatch ? bodyMatch[1] : html;
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  let summary = post.summary;
  if (!summary && post.html) {
    try {
      const aiSummary = await generateArticleSummary({ articleHtml: post.html });
      summary = aiSummary.summary;
    } catch (e) {
      console.error('AI Summary generation failed:', e);
      // We'll proceed without a summary if generation fails
      summary = 'Summary could not be generated for this article.';
    }
  }

  const content = extractBodyContent(post.html);

  return (
    <main className="w-screen h-screen">
      {/* Render the HTML content from Supabase */}
      <iframe
        title={post.title}
        srcDoc={content}
        className="w-full h-full border-none"
      />
    </main>
  );
}

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
    const { data: posts } = await supabase.from('posts').select('slug');
    return posts?.map(({ slug }) => ({ slug })) || [];
  } catch (error) {
    console.error('Failed to generate static params:', error);
    return [];
  }
}

async function getPost(slug: string): Promise<Post | null> {
  const { data, error } = await supabase.from('posts').select('*').eq('slug', slug).single();

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
    <main>
      <div className="bg-background/80 backdrop-blur-sm sticky top-0 z-20 p-2 border-b">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" passHref>
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Posts
            </Button>
          </Link>
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{post.author}</span>
            <Badge variant="secondary">{post.readtime}</Badge>
          </div>
        </div>
      </div>

      {summary && (
        <div className="py-8 bg-secondary border-b">
          <div className="container mx-auto px-4">
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                <div className="bg-primary/10 p-2 rounded-full">
                  <BrainCircuit className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="font-headline text-2xl">AI-Generated Summary</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{summary}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Render the HTML content from Supabase */}
      <div className="prose-styles" dangerouslySetInnerHTML={{ __html: content }} />
    </main>
  );
}

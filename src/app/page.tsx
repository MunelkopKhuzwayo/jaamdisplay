import { supabase } from '@/lib/supabase';
import type { Post } from '@/types';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

// Revalidate every hour
export const revalidate = 3600;

async function getPosts(): Promise<Pick<Post, 'id' | 'slug' | 'title' | 'summary'>[]> {
  const { data, error } = await supabase
    .from('postsjosh')
    .select('id, slug, title, summary, published_at')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
  return data || [];
}

export default async function Home() {
  const posts = await getPosts();

  return (
    <div className="container mx-auto px-4 py-12 sm:py-16">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-headline font-bold text-primary">Jaam</h1>
      </header>

      {posts.length > 0 ? (
        <main className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Card key={post.id} className="flex flex-col hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="font-headline text-2xl leading-tight">{post.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription>{post.summary || 'No summary available for this post.'}</CardDescription>
              </CardContent>
              <CardFooter>
                <Link href={`/projects/${post.slug}`} passHref className="w-full">
                  <Button variant="outline" className="w-full">
                    Read More <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </main>
      ) : (
        <div className="text-center py-20 bg-secondary rounded-lg">
          <h2 className="text-2xl font-headline">No Posts Found</h2>
          <p className="text-muted-foreground mt-2">
            Please check your Supabase connection or add some posts to the 'postsjosh' table.
          </p>
        </div>
      )}
    </div>
  );
}

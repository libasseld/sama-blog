'use client';

import { usePosts } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import Link from 'next/link';

export default function Home() {
  const { getPosts } = usePosts();
  const { data: posts, isLoading } = getPosts();

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.isArray(posts) ? posts.map((post) => (
        <Link key={post.id} href={`/posts/${post.id}`}>
          <Card className="h-full hover:shadow-lg transition-shadow">
            {post.image_url && post.image_url !== null && (
              <div className="relative w-full h-48 overflow-hidden">
                <img 
                  src={post.image_url} 
                  alt={post.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
              <CardDescription>
                Par {post.author.name} • {formatDistanceToNow(new Date(post.created_at), { locale: fr, addSuffix: true })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-3">{post.content}</p>
            </CardContent>
          </Card>
        </Link>
      )) : (
        <div>Aucun article trouvé</div>
      )}
    </div>
  );
}
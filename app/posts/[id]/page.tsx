"use client";

import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { usePosts, useComments } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import { Pen, Trash, MessageSquare } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Comment {
  id: number;
  name: string;
  comment: string;
  created_at: string;
}

const commentSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  content: z.string().min(10, 'Le commentaire doit contenir au moins 10 caractères'),
});

export default function PostPage() {
  const params = useParams();
  const router = useRouter();
  const postId = Number(params.id);
  const { getPost, deletePost, getComments } = usePosts();
  const { createComment } = useComments();
  const { user } = useAuthStore();
  const { data: post, isLoading } = getPost(postId);
  const { data: commentsData, isLoading: isCommentsLoading, refetch: refetchComments } = getComments(postId);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    if (commentsData) {
      setComments(commentsData);
    }
  }, [commentsData]);

  const form = useForm({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      name: '',
      content: '',
    },
  });

  const onSubmitComment = async (values: z.infer<typeof commentSchema>) => {
    try {
      await createComment.mutateAsync({ 
        postId, 
        payload: { 
          ...values, 
          comment: values.content 
        } 
      });
      form.reset();
      const { data } = await refetchComments();
      if (data) {
        setComments(data);
      }
      toast.success('Commentaire ajouté');
    } catch (error) {
      toast.error("Erreur lors de l'ajout du commentaire");
    }
  };

  const handleDelete = async () => {
    try {
      await deletePost.mutateAsync(postId);
      toast.success('Article supprimé');
      router.push('/');
    } catch (error) {
      toast.error("Erreur lors de la suppression de l'article");
    }
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (!post) {
    return <div>Article non trouvé</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              {post.image_url && post.image_url !== null && (
                <div className="relative w-full h-48 overflow-hidden">
                  <img 
                    src={post.image_url} 
                    alt={post.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardTitle className="text-3xl">{post.title}</CardTitle>
              <CardDescription>
                Par {post.author.name} • {formatDistanceToNow(new Date(post.created_at), { locale: fr, addSuffix: true })}
              </CardDescription>
            </div>
            {user?.id === post.author.id && (
              <div className="flex space-x-2">
                <Button variant="outline" size="icon" onClick={() => router.push(`/posts/${post.id}/edit`)}>
                  <Pen className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => {
                  if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
                    handleDelete();
                  }
                }}>
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap">{post.content}</p>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>Commentaires ({comments?.length || 0})</span>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4">
            {Array.isArray(comments) && comments.length > 0 ? comments.map((comment) => (
              <Card key={comment.id}>
                {comment.comment}
                <CardHeader>
                  <CardTitle className="text-lg">{comment.name}</CardTitle>
                  <CardDescription>
                    {formatDistanceToNow(new Date(comment.created_at), { locale: fr, addSuffix: true })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{comment.id}skssk</p>
                </CardContent>
              </Card>
            )) : (
              <div>Aucun commentaire</div>
            )}
          </CollapsibleContent>
        </Collapsible>
        <Card>
          <CardHeader>
            <CardTitle>Ajouter un commentaire</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitComment)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Commentaire</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={createComment.isLoading}>
                  Publier le commentaire
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
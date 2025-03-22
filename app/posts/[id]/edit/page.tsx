"use client";

import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { usePosts } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useEffect } from 'react';

const schema = z.object({
  title: z.string().min(5, 'Le titre doit contenir au moins 5 caractères'),
  content: z.string().min(20, 'Le contenu doit contenir au moins 20 caractères'),
  image: z.instanceof(File).optional(),
});

export default function EditPost() {
  const params = useParams();
  const router = useRouter();
  const postId = Number(params.id);
  const { getPost, updatePost } = usePosts();
  const { data: post, isLoading } = getPost(postId);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      content: '',
      image: null,
    },
  });

  useEffect(() => {
    if (post) {
      form.reset({
        title: post.title,
        content: post.content,
        image: null,
      });
    }
  }, [post, form]);

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      console.log(values);
      await updatePost.mutateAsync({ id: postId, payload: values });
      toast.success('Article mis à jour avec succès');
      router.push(`/posts/${postId}`);
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de l'article");
    }
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (!post) {
    return <div>Article non trouvé</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Modifier l'article</CardTitle>
          <CardDescription>Mettez à jour votre article</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre</FormLabel>
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
                    <FormLabel>Contenu</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="min-h-[300px]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <Input type="file" accept="image/*" onChange={(e) => {
                        const file = e.target.files?.[0];
                        field.onChange(file);
                      }} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={updatePost.isPending}>
                Mettre à jour
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
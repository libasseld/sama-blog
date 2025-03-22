"use client";

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { usePosts } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const schema = z.object({
  title: z.string().min(5, 'Le titre doit contenir au moins 5 caractères'),
  content: z.string().min(20, 'Le contenu doit contenir au moins 20 caractères'),
  image: z.instanceof(File).optional(),
});

export default function NewPost() {
  const router = useRouter();
  const { createPost } = usePosts();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      content: '',
      image: null,
    },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      const response = await createPost.mutateAsync(values);
      toast.success('Article créé avec succès');
      if (response.post) {
        router.push(`/posts/${response.post.id}`);
      }else{
        toast.error("Erreur lors de la création de l'article");
      }
    } catch (error) {
      toast.error("Erreur lors de la création de l'article");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Nouvel Article</CardTitle>
          <CardDescription>Partagez vos pensées avec le monde</CardDescription>
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
                    <FormLabel>Image (optionnel)</FormLabel>
                    <FormControl>
                      <Input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          field.onChange(file);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Ajoutez une image à votre article
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={createPost.isPending}>
                Publier
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
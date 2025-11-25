'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppContext } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { ChangeEvent } from 'react';
import Image from 'next/image';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  imageUrl: z.string().url('Must be a valid URL or data URL'),
});

export default function SettingsPage() {
  const { banner, setBanner } = useAppContext();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: banner.title,
      imageUrl: banner.imageUrl,
    },
  });

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue('imageUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setBanner(values.title, values.imageUrl);
    toast({
      title: 'Banner Updated',
      description: 'The homepage banner has been saved.',
    });
  };

  const currentImageUrl = form.watch('imageUrl');

  return (
    <div className="grid gap-6">
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Website Banner</CardTitle>
              <CardDescription>
                Update the main banner on the homepage. You can either paste an image URL or upload a file.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="banner-title">Banner Title</Label>
                      <FormControl>
                        <Input id="banner-title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                    <div>
                        <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                            <FormItem>
                            <Label htmlFor="banner-image-url">Banner Image URL</Label>
                            <FormControl>
                                <Input id="banner-image-url" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <div className="mt-4">
                            <Label htmlFor="banner-image-upload">Or Upload Banner</Label>
                            <Input id="banner-image-upload" type="file" accept="image/*" onChange={handleImageUpload} />
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <Label>Banner Preview</Label>
                        <div className="mt-2 relative w-full h-48 bg-muted rounded-md flex items-center justify-center">
                            {currentImageUrl ? (
                                <Image 
                                    src={currentImageUrl}
                                    alt="Banner preview"
                                    fill
                                    className="object-contain rounded-md"
                                />
                            ) : (
                                <p className="text-sm text-muted-foreground">Image preview will appear here</p>
                            )}
                        </div>
                    </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button type="submit">Save</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}

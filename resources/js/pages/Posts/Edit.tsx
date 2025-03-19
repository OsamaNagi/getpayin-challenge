import { useState, useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { DateTimePicker } from '@/components/ui/date-time-picker';

interface Platform {
    id: number;
    name: string;
    type: string;
    pivot?: {
        platform_status: 'pending' | 'published' | 'failed';
    };
}

interface Post {
    id: number;
    title: string;
    content: string;
    image_url: string | null;
    scheduled_time: string;
    status: 'draft' | 'scheduled' | 'published';
    platforms: Platform[];
}

interface Props {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
    platforms: Platform[];
    post: Post;
}

export default function Edit({ auth, platforms, post }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        title: post.title,
        content: post.content,
        image_url: post.image_url || '',
        scheduled_time: new Date(post.scheduled_time),
        platforms: post.platforms.map(p => p.id),
    });

    const [charCount, setCharCount] = useState(post.content.length);

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const content = e.target.value;
        setData('content', content);
        setCharCount(content.length);
    };

    const handlePlatformToggle = (platformId: number) => {
        setData('platforms', data.platforms.includes(platformId)
            ? data.platforms.filter(id => id !== platformId)
            : [...data.platforms, platformId]
        );
    };

    const handleDateChange = (date: Date) => {
        setData('scheduled_time', date);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('posts.update', post.id));
    };

    if (post.status === 'published') {
        return (
            <AppLayout>
                <Head title="Edit Post" />
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Cannot Edit Published Post</AlertTitle>
                            <AlertDescription>
                                This post has already been published and cannot be edited.{' '}
                                <Link href={route('posts.index')} className="font-medium underline">
                                    Return to posts
                                </Link>
                            </AlertDescription>
                        </Alert>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <Head title="Edit Post" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {platforms.length === 0 ? (
                        <Alert variant="destructive" className="mb-6">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>No platforms activated</AlertTitle>
                            <AlertDescription>
                                You need to activate at least one platform before editing a post.{' '}
                                <Link href={route('platforms.index')} className="font-medium underline">
                                    Go to platforms page
                                </Link>
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <Card>
                            <CardHeader>
                                <CardTitle>Edit Post</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={submit} className="space-y-6">
                                    <div>
                                        <Label htmlFor="title">Title</Label>
                                        <Input
                                            id="title"
                                            type="text"
                                            name="title"
                                            value={data.title}
                                            className="mt-1 block w-full"
                                            autoComplete="title"
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('title', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.title} className="mt-2" />
                                    </div>

                                    <div>
                                        <Label htmlFor="content">Content</Label>
                                        <Textarea
                                            id="content"
                                            name="content"
                                            value={data.content}
                                            className="mt-1 block w-full"
                                            onChange={handleContentChange}
                                            required
                                        />
                                        <div className="flex justify-end text-xs text-gray-500 mt-1">
                                            {charCount} characters
                                        </div>
                                        <InputError message={errors.content} className="mt-2" />
                                    </div>

                                    <div>
                                        <Label htmlFor="image_url">Image URL (optional)</Label>
                                        <Input
                                            id="image_url"
                                            type="text"
                                            name="image_url"
                                            value={data.image_url}
                                            className="mt-1 block w-full"
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('image_url', e.target.value)}
                                        />
                                        <InputError message={errors.image_url} className="mt-2" />
                                    </div>

                                    <div>
                                        <Label htmlFor="scheduled_time">Scheduled Time</Label>
                                        <DateTimePicker
                                            date={data.scheduled_time}
                                            setDate={handleDateChange}
                                        />
                                        <InputError message={errors.scheduled_time} className="mt-2" />
                                    </div>

                                    <div>
                                        <Label>Platforms</Label>
                                        <div className="mt-2 space-y-2">
                                            {platforms.map((platform) => (
                                                <div key={platform.id} className="flex items-center">
                                                    <Checkbox
                                                        id={`platform-${platform.id}`}
                                                        checked={data.platforms.includes(platform.id)}
                                                        onCheckedChange={() => handlePlatformToggle(platform.id)}
                                                    />
                                                    <label 
                                                        htmlFor={`platform-${platform.id}`}
                                                        className="ml-2 text-sm font-medium"
                                                    >
                                                        {platform.name}
                                                        {platform.pivot?.platform_status && (
                                                            <span className="ml-2 text-xs text-gray-500">
                                                                (Current status: {platform.pivot.platform_status})
                                                            </span>
                                                        )}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                        {!data.platforms.length && (
                                            <p className="text-sm text-red-500 mt-1">
                                                Please select at least one platform
                                            </p>
                                        )}
                                        <InputError message={errors.platforms} className="mt-2" />
                                    </div>

                                    <div className="flex items-center justify-end space-x-4">
                                        <Button 
                                            variant="outline"
                                            onClick={() => window.history.back()}
                                            type="button"
                                        >
                                            Cancel
                                        </Button>
                                        <Button 
                                            disabled={processing || !data.platforms.length}
                                            type="submit"
                                        >
                                            Update Post
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
} 
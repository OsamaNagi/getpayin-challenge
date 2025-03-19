import { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { DateTimePicker } from '@/components/ui/date-time-picker';

interface Platform {
    id: number;
    name: string;
    type: string;
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
}

export default function Create({ auth, platforms }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        content: '',
        image_url: '',
        scheduled_time: new Date(Date.now() + 3600000), // Default to 1 hour from now
        platforms: [] as number[],
    });

    const [charCount, setCharCount] = useState(0);

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
        post(route('posts.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Create New Post</h2>}
        >
            <Head title="Create Post" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {platforms.length === 0 ? (
                        <Alert variant="destructive" className="mb-6">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>No platforms activated</AlertTitle>
                            <AlertDescription>
                                You need to activate at least one platform before creating a post.{' '}
                                <Link href={route('platforms.index')} className="font-medium underline">
                                    Go to platforms page
                                </Link>
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <Card>
                            <CardHeader>
                                <CardTitle>Create a New Scheduled Post</CardTitle>
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

                                    <div className="flex items-center justify-end">
                                        <Button 
                                            className="ml-4" 
                                            disabled={processing || !data.platforms.length}
                                            type="submit"
                                        >
                                            Schedule Post
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
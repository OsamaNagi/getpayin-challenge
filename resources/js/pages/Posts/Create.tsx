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
import { AlertCircle, ImageIcon, X } from 'lucide-react';
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
        image: null as File | null,
        scheduled_time: new Date(Date.now() + 3600000), // Default to 1 hour from now
        platforms: [] as number[],
    });

    const [charCount, setCharCount] = useState(0);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const content = e.target.value;
        setData('content', content);
        setCharCount(content.length);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setData('image', file);
        
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        } else {
            setPreviewUrl(null);
        }
    };

    const removeImage = () => {
        setData('image', null);
        setPreviewUrl(null);
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
            forceFormData: true,
            onSuccess: () => {
                reset();
                setPreviewUrl(null);
            },
        });
    };

    return (
        <AppLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Create New Post</h2>}
        >
            <Head title="Create Post" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                                        <Label htmlFor="image">Image</Label>
                                        <div className="mt-1 flex items-center gap-4">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="w-32 h-32 flex flex-col items-center justify-center gap-2 relative"
                                                onClick={() => document.getElementById('image')?.click()}
                                            >
                                                {previewUrl ? (
                                                    <>
                                                        <img
                                                            src={previewUrl}
                                                            alt="Preview"
                                                            className="w-full h-full object-cover absolute inset-0 rounded-md"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="icon"
                                                            className="absolute -top-2 -right-2 h-6 w-6"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                removeImage();
                                                            }}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <ImageIcon className="h-8 w-8 text-gray-400" />
                                                        <span className="text-xs text-gray-500">Upload Image</span>
                                                    </>
                                                )}
                                            </Button>
                                            <input
                                                id="image"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">
                                            Supported formats: JPEG, PNG, GIF (max 5MB)
                                        </p>
                                        <InputError message={errors.image} className="mt-2" />
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
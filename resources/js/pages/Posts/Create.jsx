import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Textarea } from '@/Components/Textarea';
import { Checkbox } from '@/Components/Checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { format } from 'date-fns';

export default function Create({ auth, platforms }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        content: '',
        image_url: '',
        scheduled_time: format(new Date(Date.now() + 3600000), "yyyy-MM-dd'T'HH:mm"), // Default to 1 hour from now
        platforms: [],
    });

    const [charCount, setCharCount] = useState(0);

    const handleContentChange = (e) => {
        const content = e.target.value;
        setData('content', content);
        setCharCount(content.length);
    };

    const handlePlatformToggle = (platformId) => {
        setData('platforms', data.platforms.includes(platformId)
            ? data.platforms.filter(id => id !== platformId)
            : [...data.platforms, platformId]
        );
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('posts.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Create New Post</h2>}
        >
            <Head title="Create Post" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Create a New Scheduled Post</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="title" value="Title" />
                                    <TextInput
                                        id="title"
                                        type="text"
                                        name="title"
                                        value={data.title}
                                        className="mt-1 block w-full"
                                        autoComplete="title"
                                        onChange={(e) => setData('title', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.title} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="content" value="Content" />
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
                                    <InputLabel htmlFor="image_url" value="Image URL (optional)" />
                                    <TextInput
                                        id="image_url"
                                        type="text"
                                        name="image_url"
                                        value={data.image_url}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('image_url', e.target.value)}
                                    />
                                    <InputError message={errors.image_url} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="scheduled_time" value="Scheduled Time" />
                                    <TextInput
                                        id="scheduled_time"
                                        type="datetime-local"
                                        name="scheduled_time"
                                        value={data.scheduled_time}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('scheduled_time', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.scheduled_time} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel value="Platforms" />
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
                                    <PrimaryButton className="ml-4" disabled={processing || !data.platforms.length}>
                                        Schedule Post
                                    </PrimaryButton>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 
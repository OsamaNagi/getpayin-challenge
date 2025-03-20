import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface Platform {
    id: number;
    name: string;
    type: string;
    pivot: {
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
    user_id: number;
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
    post: Post;
}

export default function Show({ auth, post }: Props) {
    const getStatusColor = (status: string): string => {
        switch (status) {
            case 'draft':
                return 'bg-gray-200 text-gray-800';
            case 'scheduled':
                return 'bg-blue-200 text-blue-800';
            case 'published':
                return 'bg-green-200 text-green-800';
            default:
                return 'bg-gray-200 text-gray-800';
        }
    };

    const getPlatformStatusColor = (status: string): string => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-200 text-yellow-800';
            case 'published':
                return 'bg-green-200 text-green-800';
            case 'failed':
                return 'bg-red-200 text-red-800';
            default:
                return 'bg-gray-200 text-gray-800';
        }
    };

    return (
        <AppLayout>
            <Head title={`Post - ${post.title}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                            View Post
                        </h1>
                        <Button variant="outline" asChild>
                            <Link href={route('posts.index')}>Back to Posts</Link>
                        </Button>
                    </div>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xl">{post.title}</CardTitle>
                                <Badge className={getStatusColor(post.status)}>
                                    {post.status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Scheduled Time */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Scheduled Time
                                </h3>
                                <p className="mt-1 text-sm">
                                    {format(new Date(post.scheduled_time), 'PPP p')}
                                </p>
                            </div>

                            {/* Content */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Content
                                </h3>
                                <div className="mt-1 prose dark:prose-invert max-w-none">
                                    {post.content}
                                </div>
                            </div>

                            {/* Image */}
                            {post.image_url && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Image
                                    </h3>
                                    <div className="mt-2">
                                        <img
                                            src={post.image_url}
                                            alt="Post image"
                                            className="rounded-lg max-h-96 object-contain"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Platforms */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Platforms
                                </h3>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {post.platforms.map((platform) => (
                                        <Badge
                                            key={platform.id}
                                            className={getPlatformStatusColor(platform.pivot.platform_status)}
                                        >
                                            {platform.name} ({platform.pivot.platform_status})
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            {post.status !== 'published' && (
                                <div className="flex gap-2 pt-4">
                                    <Button asChild>
                                        <Link href={route('posts.edit', post.id)}>
                                            Edit Post
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
} 
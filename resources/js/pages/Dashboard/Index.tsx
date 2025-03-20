import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Calendar from './Calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type BreadcrumbItem } from '@/types';

interface Platform {
    id: number;
    name: string;
    active: boolean;
}

interface Post {
    id: number;
    title: string;
    content: string;
    status: 'draft' | 'scheduled' | 'published';
    scheduled_time: string;
    platforms: Platform[];
}

interface Props {
    posts: Post[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({ posts }: Props) {
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [selectedPlatform, setSelectedPlatform] = useState<string>('all');

    const platforms = Array.from(new Set(posts.flatMap(post => post.platforms.map(p => p.name))));
    
    const filteredPosts = posts.filter(post => {
        const statusMatch = selectedStatus === 'all' || post.status === selectedStatus;
        const platformMatch = selectedPlatform === 'all' || 
            post.platforms.some(p => p.name === selectedPlatform);
        return statusMatch && platformMatch;
    });

    const postStats = {
        total: posts.length,
        draft: posts.filter(p => p.status === 'draft').length,
        scheduled: posts.filter(p => p.status === 'scheduled').length,
        published: posts.filter(p => p.status === 'published').length,
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 px-4 lg:px-8 space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{postStats.total}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Draft Posts</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{postStats.draft}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Scheduled Posts</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{postStats.scheduled}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Published Posts</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{postStats.published}</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-4 mb-4">
                        <div className="w-48">
                            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="scheduled">Scheduled</SelectItem>
                                    <SelectItem value="published">Published</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-48">
                            <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by platform" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Platforms</SelectItem>
                                    {platforms.map(platform => (
                                        <SelectItem key={platform} value={platform}>
                                            {platform}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Calendar */}
                    <Calendar posts={filteredPosts} />
                </div>
            </div>
        </AppLayout>
    );
} 
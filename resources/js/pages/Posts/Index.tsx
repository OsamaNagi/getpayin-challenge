import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
    posts: {
        data: Post[];
        links: any[];
        meta: {
            current_page: number;
            from: number;
            last_page: number;
            links: any[];
            path: string;
            per_page: number;
            to: number;
            total: number;
        };
    };
}

export default function Index({ auth, posts }: Props) {
    const handleDelete = (postId: number) => {
        router.delete(route('posts.destroy', postId));
    };

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
        <AppLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Posts</h2>}
        >
            <Head title="Posts" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-medium">Your Posts</h3>
                            <p className="text-sm text-gray-500">Manage your scheduled and published posts</p>
                        </div>
                        <Button asChild>
                            <Link href={route('posts.create')}>Create New Post</Link>
                        </Button>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>All Posts</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {posts.data.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Title</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Scheduled Time</TableHead>
                                            <TableHead>Platforms</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {posts.data.map((post) => (
                                            <TableRow key={post.id}>
                                                <TableCell className="font-medium">{post.title}</TableCell>
                                                <TableCell>
                                                    <Badge className={getStatusColor(post.status)}>
                                                        {post.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {format(new Date(post.scheduled_time), 'PPP p')}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-wrap gap-1">
                                                        {post.platforms.map((platform) => (
                                                            <Badge 
                                                                key={platform.id}
                                                                className={getPlatformStatusColor(platform.pivot.platform_status)}
                                                            >
                                                                {platform.name} ({platform.pivot.platform_status})
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex space-x-2">
                                                        {post.status !== 'published' && (
                                                            <>
                                                                <Button 
                                                                    variant="outline" 
                                                                    size="sm" 
                                                                    asChild
                                                                >
                                                                    <Link href={route('posts.edit', post.id)}>
                                                                        Edit
                                                                    </Link>
                                                                </Button>
                                                                <AlertDialog>
                                                                    <AlertDialogTrigger asChild>
                                                                        <Button 
                                                                            variant="destructive"
                                                                            size="sm"
                                                                        >
                                                                            Delete
                                                                        </Button>
                                                                    </AlertDialogTrigger>
                                                                    <AlertDialogContent>
                                                                        <AlertDialogHeader>
                                                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                                            <AlertDialogDescription>
                                                                                This action cannot be undone. This will permanently delete your post
                                                                                and remove it from our servers.
                                                                            </AlertDialogDescription>
                                                                        </AlertDialogHeader>
                                                                        <AlertDialogFooter>
                                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                            <AlertDialogAction
                                                                                onClick={() => handleDelete(post.id)}
                                                                                className="bg-red-600 hover:bg-red-700"
                                                                            >
                                                                                Delete
                                                                            </AlertDialogAction>
                                                                        </AlertDialogFooter>
                                                                    </AlertDialogContent>
                                                                </AlertDialog>
                                                            </>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="text-center p-6">
                                    <p className="text-gray-500">No posts found. Create your first post now!</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
} 
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
import { getStatusBadgeColor, getPlatformStatusColor } from '@/utils/colors';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

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
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
    };
}

export default function Index({ auth, posts }: Props) {
    const handleDelete = (postId: number) => {
        router.delete(route('posts.destroy', postId));
    };

    const handlePageChange = (url: string) => {
        router.get(url, {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AppLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Posts</h2>}
        >
            <Head title="Posts" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-row items-center justify-between gap-4 mb-6">
                        <div>
                            <h3 className="text-lg font-medium">Your Posts</h3>
                            <p className="text-sm text-gray-500">Manage your scheduled and published posts</p>
                        </div>
                        <Button asChild className="sm:w-auto">
                            <Link href={route('posts.create')}>Create New Post</Link>
                        </Button>
                    </div>
                    
                    <Card>
                        <CardHeader>
                            <CardTitle>All Posts</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {posts.data.length > 0 ? (
                                <>
                                    <div className="">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="whitespace-nowrap">Title</TableHead>
                                                    <TableHead className="whitespace-nowrap">Content</TableHead>
                                                    <TableHead className="whitespace-nowrap">Status</TableHead>
                                                    <TableHead className="whitespace-nowrap">Scheduled Time</TableHead>
                                                    <TableHead className="whitespace-nowrap">Platforms</TableHead>
                                                    <TableHead className="whitespace-nowrap">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {posts.data.map((post) => (
                                                    <TableRow key={post.id}>
                                                        <TableCell className="font-medium min-w-[120px] max-w-[200px]">
                                                            <div className="truncate" title={post.title}>
                                                                {post.title}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="min-w-[200px] max-w-[300px]">
                                                            <div className="truncate" title={post.content}>
                                                                {post.content.length > 60 ? `${post.content.substring(0, 60)}...` : post.content}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="whitespace-nowrap">
                                                            <Badge className={getStatusBadgeColor(post.status)}>
                                                                {post.status}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="whitespace-nowrap min-w-[180px]">
                                                            {format(new Date(post.scheduled_time), 'PPP p')}
                                                        </TableCell>
                                                        <TableCell className="min-w-[200px]">
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
                                                        <TableCell className="whitespace-nowrap">
                                                            <div className="flex flex-col sm:flex-row gap-2">
                                                                <Button 
                                                                    variant="secondary" 
                                                                    size="sm" 
                                                                    asChild
                                                                >
                                                                    <Link href={route('posts.show', post.id)}>
                                                                        View
                                                                    </Link>
                                                                </Button>
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
                                                                                <AlertDialogFooter className="sm:space-x-2">
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
                                    </div>
                                    <div className="mt-4 flex justify-center">
                                        <Pagination>
                                            <PaginationContent>
                                                {posts.links.map((link, index) => {
                                                    // Skip rendering if it's just "..." text
                                                    if (link.label.includes('...')) {
                                                        return (
                                                            <PaginationItem key={index}>
                                                                <PaginationEllipsis />
                                                            </PaginationItem>
                                                        );
                                                    }

                                                    // Previous link
                                                    if (index === 0) {
                                                        return link.url && (
                                                            <PaginationItem key={index}>
                                                                <PaginationPrevious
                                                                    href="#"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        if (link.url) handlePageChange(link.url);
                                                                    }}
                                                                />
                                                            </PaginationItem>
                                                        );
                                                    }

                                                    // Next link
                                                    if (index === posts.links.length - 1) {
                                                        return link.url && (
                                                            <PaginationItem key={index}>
                                                                <PaginationNext
                                                                    href="#"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        if (link.url) handlePageChange(link.url);
                                                                    }}
                                                                />
                                                            </PaginationItem>
                                                        );
                                                    }

                                                    // Number links
                                                    return (
                                                        <PaginationItem key={index}>
                                                            <PaginationLink
                                                                href="#"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    if (link.url) handlePageChange(link.url);
                                                                }}
                                                                isActive={link.active}
                                                            >
                                                                {link.label}
                                                            </PaginationLink>
                                                        </PaginationItem>
                                                    );
                                                })}
                                            </PaginationContent>
                                        </Pagination>
                                    </div>
                                </>
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
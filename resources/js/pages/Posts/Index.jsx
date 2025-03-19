import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Button } from '@/Components/ui/button';
import { format } from 'date-fns';

export default function Index({ auth, posts }) {
    const getStatusColor = (status) => {
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

    const getPlatformStatusColor = (status) => {
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
        <AuthenticatedLayout
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
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm" 
                                                            asChild
                                                            disabled={post.status === 'published'}
                                                        >
                                                            <Link href={route('posts.edit', post.id)}>
                                                                Edit
                                                            </Link>
                                                        </Button>
                                                        <Link 
                                                            href={route('posts.destroy', post.id)} 
                                                            method="delete" 
                                                            as="button"
                                                            className="px-3 py-1 rounded text-sm bg-red-100 text-red-800 hover:bg-red-200"
                                                        >
                                                            Delete
                                                        </Link>
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
        </AuthenticatedLayout>
    );
} 
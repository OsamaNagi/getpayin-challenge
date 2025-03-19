import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Switch } from '@/Components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { useToast } from '@/Components/ui/use-toast';

export default function Index({ auth, platforms }) {
    const { toast } = useToast();
    const { post, processing } = useForm();

    const togglePlatform = (platform) => {
        post(route('platforms.toggle-active', platform.id), {
            data: { active: !platform.active },
            preserveScroll: true,
            onSuccess: () => {
                toast({
                    title: 'Platform Updated',
                    description: `${platform.name} has been ${!platform.active ? 'activated' : 'deactivated'}.`,
                });
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Platform Settings</h2>}
        >
            <Head title="Platform Settings" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Social Media Platforms</CardTitle>
                            <CardDescription>
                                Manage which platforms you want to use for your posts
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Platform</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {platforms.map((platform) => (
                                        <TableRow key={platform.id}>
                                            <TableCell className="font-medium">{platform.name}</TableCell>
                                            <TableCell>{platform.type}</TableCell>
                                            <TableCell>
                                                <span 
                                                    className={`text-sm px-2 py-1 rounded ${
                                                        platform.active 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}
                                                >
                                                    {platform.active ? 'Active' : 'Inactive'}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-2">
                                                    <Switch
                                                        checked={platform.active}
                                                        onCheckedChange={() => togglePlatform(platform)}
                                                        disabled={processing}
                                                    />
                                                    <span className="text-sm">
                                                        {platform.active ? 'Activated' : 'Activate'}
                                                    </span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 
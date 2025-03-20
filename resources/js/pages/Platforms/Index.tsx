import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

interface Platform {
    id: number;
    name: string;
    active: boolean;
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
    errors?: {
        message?: string;
    };
}

export default function Index({ auth, platforms: initialPlatforms, errors }: Props) {
    // Use local state for platforms to ensure UI updates instantly
    const [platforms, setPlatforms] = useState(initialPlatforms);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Show error toast if there are errors from the server
    if (errors?.message) {
        toast.error('Error', {
            description: errors.message,
        });
    }

    const togglePlatform = async (platform: Platform, index: number) => {
        // Optimistically update the UI immediately
        const newActive = !platform.active;
        const updatedPlatforms = [...platforms];
        updatedPlatforms[index] = { ...platform, active: newActive };
        setPlatforms(updatedPlatforms);
        
        setIsSubmitting(true);
        
        // Use Inertia router for the request
        router.post(route('platforms.toggle-active', platform.id), 
            { active: newActive },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Platform Updated', {
                        description: `${platform.name} has been ${newActive ? 'activated' : 'deactivated'}.`,
                    });
                },
                onError: () => {
                    // Revert UI change on error
                    const revertedPlatforms = [...platforms];
                    revertedPlatforms[index] = { ...platform };
                    setPlatforms(revertedPlatforms);
                    
                    toast.error('Failed to update platform', {
                        description: 'There was an error updating the platform. Please try again.',
                    });
                },
                onFinish: () => {
                    setIsSubmitting(false);
                }
            }
        );
    };

    return (
        <AppLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Platform Settings</h2>}
        >
            <Head title="Platform Settings" />

            <div className="py-12">
                <div className="max-w-7xl px-4 mx-auto sm:px-6 lg:px-8">
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
                                        {/* <TableHead>Type</TableHead> */}
                                        <TableHead>Status</TableHead>
                                        <TableHead>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {platforms.map((platform, index) => (
                                        <TableRow key={platform.id}>
                                            <TableCell className="font-medium">{platform.name}</TableCell>
                                            {/* <TableCell>{platform.type}</TableCell> */}
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
                                                        onCheckedChange={() => togglePlatform(platform, index)}
                                                        disabled={isSubmitting}
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
        </AppLayout>
    );
} 
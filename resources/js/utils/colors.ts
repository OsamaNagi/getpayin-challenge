type PostStatus = 'draft' | 'scheduled' | 'published';
type PlatformStatus = 'pending' | 'published' | 'failed';

export const getStatusColor = (status: PostStatus): string => {
    switch (status) {
        case 'draft':
            return '#6b7280'; // gray-500
        case 'scheduled':
            return '#3b82f6'; // blue-500
        case 'published':
            return '#10b981'; // emerald-500
        default:
            return '#6b7280';
    }
};

export const getStatusBadgeColor = (status: PostStatus): string => {
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

export const getPlatformStatusColor = (status: PlatformStatus): string => {
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
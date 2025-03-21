export type PlatformType = 'instagram' | 'facebook' | 'twitter' | 'linkedin';

export interface Platform {
    id: number;
    name: string;
    type: PlatformType;
    active: boolean;
    icon?: string;
} 
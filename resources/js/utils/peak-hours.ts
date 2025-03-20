interface TimeRange {
    start: number; // Hour in 24-hour format
    end: number;
}

interface PlatformPeakHours {
    weekdays: TimeRange[];
    weekends: TimeRange[];
}

interface PeakHoursData {
    [key: string]: PlatformPeakHours;
}

export const peakHours: PeakHoursData = {
    twitter: {
        weekdays: [
            { start: 9, end: 11 },  // 9 AM - 11 AM
            { start: 15, end: 16 }  // 3 PM - 4 PM
        ],
        weekends: [
            { start: 9, end: 12 }   // 9 AM - 12 PM
        ]
    },
    instagram: {
        weekdays: [
            { start: 11, end: 14 }, // 11 AM - 2 PM
            { start: 19, end: 21 }  // 7 PM - 9 PM
        ],
        weekends: [
            { start: 10, end: 14 }  // 10 AM - 2 PM
        ]
    },
    linkedin: {
        weekdays: [
            { start: 8, end: 10 },  // 8 AM - 10 AM
            { start: 16, end: 18 }  // 4 PM - 6 PM
        ],
        weekends: []  // Not recommended on weekends
    }
};

export function isWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
}

export function formatHour(hour: number): string {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour} ${period}`;
}

export function getNextPeakHour(platforms: string[], currentDate: Date = new Date()): Date | null {
    if (platforms.length === 0) return null;

    const currentHour = currentDate.getHours();
    const isWeekendDay = isWeekend(currentDate);
    let nextPeakHour: number | null = null;

    // Get all peak hours for selected platforms
    platforms.forEach(platform => {
        const platformData = peakHours[platform.toLowerCase()];
        if (!platformData) return;

        const ranges = isWeekendDay ? platformData.weekends : platformData.weekdays;
        ranges.forEach(range => {
            // If we're before or in a peak period, consider its start time
            if (currentHour < range.end) {
                const potentialNext = currentHour < range.start ? range.start : currentHour + 1;
                if (nextPeakHour === null || potentialNext < nextPeakHour) {
                    nextPeakHour = potentialNext;
                }
            }
        });
    });

    // If no peak hour found today, get the first peak hour of the next day
    if (nextPeakHour === null) {
        const tomorrow = new Date(currentDate);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        return getNextPeakHour(platforms, tomorrow);
    }

    const nextDate = new Date(currentDate);
    nextDate.setHours(nextPeakHour, 0, 0, 0);
    return nextDate;
}

export function isPeakHour(platforms: string[], date: Date): boolean {
    const hour = date.getHours();
    const isWeekendDay = isWeekend(date);

    return platforms.some(platform => {
        const platformData = peakHours[platform.toLowerCase()];
        if (!platformData) return false;

        const ranges = isWeekendDay ? platformData.weekends : platformData.weekdays;
        return ranges.some(range => hour >= range.start && hour < range.end);
    });
} 
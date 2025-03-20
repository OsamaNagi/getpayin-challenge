import React from 'react';
import { Button } from '@/components/ui/button';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Clock, Info } from 'lucide-react';
import { peakHours, formatHour, getNextPeakHour } from '@/utils/peak-hours';

interface PeakHoursSuggestionProps {
    selectedPlatforms: string[];
    onTimeSelect: (date: Date) => void;
    currentDate: Date;
}

export function PeakHoursSuggestion({ selectedPlatforms, onTimeSelect, currentDate }: PeakHoursSuggestionProps) {
    const handleSuggestTime = () => {
        const nextPeak = getNextPeakHour(selectedPlatforms, currentDate);
        if (nextPeak) {
            onTimeSelect(nextPeak);
        }
    };

    if (selectedPlatforms.length === 0) {
        return null;
    }

    return (
        <div className="flex items-center gap-2 mt-2">
            <HoverCard>
                <HoverCardTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2"
                    >
                        <Info className="h-4 w-4 mr-1" />
                        Peak Hours Info
                    </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                    <div className="space-y-4">
                        {selectedPlatforms.map(platform => {
                            const platformData = peakHours[platform.toLowerCase()];
                            if (!platformData) return null;

                            return (
                                <div key={platform} className="space-y-2">
                                    <h4 className="font-medium">{platform}</h4>
                                    <div className="text-sm space-y-1">
                                        <p className="text-muted-foreground">
                                            Weekdays:{' '}
                                            {platformData.weekdays.map((range, i) => (
                                                <span key={i}>
                                                    {formatHour(range.start)} - {formatHour(range.end)}
                                                    {i < platformData.weekdays.length - 1 ? ', ' : ''}
                                                </span>
                                            ))}
                                        </p>
                                        <p className="text-muted-foreground">
                                            Weekends:{' '}
                                            {platformData.weekends.length > 0 ? (
                                                platformData.weekends.map((range, i) => (
                                                    <span key={i}>
                                                        {formatHour(range.start)} - {formatHour(range.end)}
                                                        {i < platformData.weekends.length - 1 ? ', ' : ''}
                                                    </span>
                                                ))
                                            ) : (
                                                'Not recommended'
                                            )}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </HoverCardContent>
            </HoverCard>
            <Button
                variant="outline"
                size="sm"
                className="h-8"
                onClick={handleSuggestTime}
            >
                <Clock className="h-4 w-4 mr-1" />
                Suggest Time
            </Button>
        </div>
    );
} 